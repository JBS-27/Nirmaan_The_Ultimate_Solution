import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { estimateProject, estimateRooms, type RoomInput } from "@/lib/estimator";
import { findCity, type ProjectType } from "@/lib/constants";
import { addDays, num, todayISO } from "@/lib/utils";
import type { Project, ProjectSnapshot } from "@/lib/types";
import { requireProjectAccess } from "./access";
import {
  mapAttendance,
  mapBill,
  mapMaterial,
  mapMessage,
  mapPayment,
  mapPayout,
  mapPhase,
  mapPhoto,
  mapProject,
  mapWorker,
} from "./map";
import { seedRichSample } from "./demo-seed";
import { ensureCatalog } from "./seed";
import { DEMO_SITE_NAME } from "@/lib/site-media";

async function insertEstimate(
  sql: Awaited<ReturnType<typeof getSql>>,
  projectId: number,
  type: ProjectType,
  plotSqft: number,
  floors: number,
  city: string,
  startDate: string,
  targetDate: string,
  budget: number,
) {
  const est = estimateProject({ type, plotSqft, floors, city, startDate, targetDate, budget });
  const phaseIds: Record<string, number> = {};
  for (let i = 0; i < est.phases.length; i++) {
    const p = est.phases[i]!;
    const rows = await sql<{ id: number }>`
      insert into phases (project_id, name, sort_order, start_date, end_date, status, progress, estimated_cost)
      values (
        ${projectId}, ${p.name}, ${i}, ${p.startDate}, ${p.endDate},
        ${i === 0 ? "active" : "upcoming"}, ${i === 0 ? 12 : 0}, ${p.estimatedCost}
      )
      returning id
    `;
    phaseIds[p.key] = rows[0]!.id;
  }
  for (const m of est.materials) {
    const pid = phaseIds[m.phaseKey] ?? null;
    await sql`
      insert into materials (
        project_id, phase_id, name, category, unit, qty_needed, qty_ordered, qty_received, qty_used, unit_price, status
      ) values (
        ${projectId}, ${pid}, ${m.name}, ${m.category}, ${m.unit}, ${m.qtyNeeded},
        0, 0, 0, ${m.unitPrice}, 'needed'
      )
    `;
  }
  return est;
}

export const listProjects = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<(Project & { progress: number; spent: number })[]> => {
    const sql = await getSql();
    await ensureCatalog(sql);
    const [profile] = await sql<{ role: string }>`select role from profiles where user_id = ${context.userId}`;
    const rows =
      profile?.role === "admin"
        ? await sql`select * from projects order by created_at desc`
        : await sql`
            select distinct p.*
            from projects p
            left join hires h on h.project_id = p.id
            left join professionals pr on pr.id = h.professional_id
            where p.owner_id = ${context.userId} or pr.user_id = ${context.userId}
            order by p.created_at desc
          `;
    const out: (Project & { progress: number; spent: number })[] = [];
    for (const r of rows) {
      const p = mapProject(r);
      const phases = await sql<{ progress: number; estimated_cost: number }>`
        select progress, estimated_cost from phases where project_id = ${p.id}
      `;
      const w = phases.reduce((s, x) => s + num(x.estimated_cost), 0) || 1;
      const progress = Math.round(
        phases.reduce((s, x) => s + num(x.progress) * num(x.estimated_cost), 0) / w,
      );
      const bills = await sql<{ s: number }>`
        select coalesce(sum(amount),0)::float8 as s from bills where project_id = ${p.id} and paid = true
      `;
      const pays = await sql<{ s: number }>`
        select coalesce(sum(amount),0)::float8 as s from payments where project_id = ${p.id}
      `;
      const pouts = await sql<{ s: number }>`
        select coalesce(sum(amount),0)::float8 as s from payouts where project_id = ${p.id}
      `;
      const ords = await sql<{ s: number }>`
        select coalesce(sum(qty * unit_price),0)::float8 as s from orders where project_id = ${p.id}
      `;
      const spent = num(bills[0]?.s) + num(pays[0]?.s) + num(pouts[0]?.s) + num(ords[0]?.s);
      out.push({ ...p, progress, spent });
    }
    return out;
  });

export const getProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }): Promise<ProjectSnapshot> => {
    const sql = await getSql();
    const access = await requireProjectAccess(sql, context.userId, id);

    const [proj] = await sql`select * from projects where id = ${id}`;
    const project = mapProject(proj!);
    const phases = (await sql`select * from phases where project_id = ${id} order by sort_order`).map(mapPhase);
    const materials = (await sql`select * from materials where project_id = ${id} order by id`).map(mapMaterial);
    const bills = (await sql`select * from bills where project_id = ${id} order by bill_date desc`).map(mapBill);
    const payments = (await sql`select * from payments where project_id = ${id} order by paid_at desc`).map(mapPayment);
    const workers = (await sql`select * from workers where project_id = ${id} order by id`).map(mapWorker);
    const attendance = (await sql`select * from attendance where project_id = ${id} order by work_date desc`).map(mapAttendance);
    const payouts = (await sql`select * from payouts where project_id = ${id} order by paid_at desc`).map(mapPayout);
    const photos = (await sql`select * from photos where project_id = ${id} order by created_at desc`).map(mapPhoto);
    const messages = (await sql`select * from messages where project_id = ${id} order by created_at asc`).map(mapMessage);

    const quotes = await sql`
      select q.*, pr.name as professional_name
      from quotes q join professionals pr on pr.id = q.professional_id
      where q.project_id = ${id} order by q.created_at desc
    `;
    const hires = await sql`
      select h.*, pr.name as professional_name, pr.role as role
      from hires h join professionals pr on pr.id = h.professional_id
      where h.project_id = ${id}
    `;
    const orders = await sql`select * from orders where project_id = ${id} order by created_at desc`;
    const changeRows = await sql`select * from change_orders where project_id = ${id} order by created_at desc`;
    const logRows = await sql`select * from daily_logs where project_id = ${id} order by log_date desc`;

    const w = phases.reduce((s, x) => s + x.estimatedCost, 0) || 1;
    const progress = Math.round(phases.reduce((s, x) => s + x.progress * x.estimatedCost, 0) / w);

    const billPaid = bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
    const paySum = payments.reduce((s, p) => s + p.amount, 0);
    const payoutSum = payouts.reduce((s, p) => s + p.amount, 0);
    const orderSum = orders.reduce((s, o) => s + num(o.qty) * num(o.unit_price), 0);
    const spent = billPaid + paySum + payoutSum + orderSum;
    const remaining = project.budget - spent;

    const crewPending = workers.reduce((sum, wkr) => {
      const days = attendance.filter((a) => a.workerId === wkr.id && a.present).length;
      const paid = payouts.filter((p) => p.workerId === wkr.id).reduce((s, p) => s + p.amount, 0);
      return sum + Math.max(0, days * wkr.dailyRate - paid);
    }, 0);

    const today = todayISO();
    const risks: ProjectSnapshot["risks"] = [];
    if (spent > project.budget) {
      risks.push({ level: "danger", title: "Budget exceeded", detail: `Spend is over the ${project.name} envelope. Freeze extras until you re-baseline.` });
    } else if (spent > project.budget * 0.85) {
      risks.push({ level: "warn", title: "Budget tightening", detail: "Over 85% of the envelope is committed. Watch finishing allowances." });
    }
    for (const ph of phases) {
      if (ph.endDate < today && ph.progress < 100 && ph.status !== "done") {
        risks.push({ level: "warn", title: `${ph.name} is behind`, detail: `Planned finish ${ph.endDate}, progress ${ph.progress}%.` });
      }
    }
    if (crewPending > 20000) {
      risks.push({ level: "info", title: "Crew payouts pending", detail: "Outstanding wages will hit cash this week if you close attendance." });
    }
    const lowMat = materials.filter((m) => m.qtyReceived + 0.01 < m.qtyNeeded * 0.3 && m.status === "needed");
    if (lowMat.length) {
      risks.push({ level: "info", title: "Materials not ordered", detail: `${lowMat.length} items still at zero receipt — including ${lowMat[0]!.name}.` });
    }

    return {
      project,
      phases,
      materials,
      bills,
      payments,
      workers,
      attendance,
      payouts,
      photos,
      messages,
      quotes: quotes.map((q) => ({
        id: num(q.id),
        projectId: num(q.project_id),
        ownerId: String(q.owner_id),
        professionalId: num(q.professional_id),
        amount: q.amount == null ? null : num(q.amount),
        message: q.message ? String(q.message) : null,
        status: String(q.status),
        createdAt: String(q.created_at),
        professionalName: String(q.professional_name),
      })),
      hires: hires.map((h) => ({
        id: num(h.id),
        projectId: num(h.project_id),
        professionalId: num(h.professional_id),
        status: String(h.status),
        hiredAt: String(h.hired_at).slice(0, 10),
        professionalName: String(h.professional_name),
        role: String(h.role),
      })),
      orders: orders.map((o) => ({
        id: num(o.id),
        projectId: num(o.project_id),
        supplierId: num(o.supplier_id),
        itemName: String(o.item_name),
        qty: num(o.qty),
        unitPrice: num(o.unit_price),
        status: String(o.status),
        createdAt: String(o.created_at),
      })),
      changeOrders: changeRows.map((c) => ({
        id: num(c.id),
        projectId: num(c.project_id),
        title: String(c.title),
        detail: c.detail ? String(c.detail) : null,
        costDelta: num(c.cost_delta),
        daysDelta: num(c.days_delta),
        status: String(c.status),
        createdAt: String(c.created_at),
      })),
      dailyLogs: logRows.map((l) => ({
        id: num(l.id),
        projectId: num(l.project_id),
        logDate: String(l.log_date).slice(0, 10),
        weather: String(l.weather),
        workersCount: num(l.workers_count),
        notes: l.notes ? String(l.notes) : null,
        issues: l.issues ? String(l.issues) : null,
      })),
      access,
      progress,
      spent,
      remaining,
      crewPending,
      risks,
    };
  });

type CreateInput = {
  name: string;
  city: string;
  address?: string;
  projectType: ProjectType;
  plotSqft: number;
  floors: number;
  budget: number;
  startDate: string;
  targetDate: string;
  requirements?: string;
  sample?: boolean;
  rooms?: RoomInput[];
};

async function plantProject(userId: string, data: CreateInput) {
  const sql = await getSql();
  const city = findCity(data.city);
  const plot = Math.max(200, Math.round(data.plotSqft));
  const floors = Math.max(1, Math.min(8, Math.round(data.floors)));
  const budget = Math.max(100000, Math.round(data.budget));
  const inserted = await sql<{ id: number }>`
    insert into projects (
      owner_id, name, city, address, lat, lng, project_type, plot_sqft, floors,
      budget, start_date, target_date, requirements, status
    ) values (
      ${userId}, ${data.name.trim() || "Untitled home"}, ${city.name},
      ${data.address ?? null}, ${city.lat}, ${city.lng}, ${data.projectType},
      ${plot}, ${floors}, ${budget}, ${data.startDate}, ${data.targetDate},
      ${data.requirements ?? null}, 'active'
    )
    returning id
  `;
  const id = inserted[0]!.id;
  const est = await insertEstimate(
    sql, id, data.projectType, plot, floors, city.name, data.startDate, data.targetDate, budget,
  );

  if (data.rooms && data.rooms.length > 0) {
    const extra = estimateRooms(data.rooms, city.name);
    for (const m of extra.extras) {
      const [ph] = await sql<{ id: number }>`
        select id from phases where project_id = ${id} and name ilike ${"%" + (m.phaseKey === "finishing" ? "Finish" : m.phaseKey) + "%"}
        order by sort_order limit 1
      `;
      await sql`
        insert into materials (
          project_id, phase_id, name, category, unit, qty_needed, qty_ordered, qty_received, qty_used, unit_price, status
        ) values (
          ${id}, ${ph?.id ?? null}, ${m.name}, ${m.category}, ${m.unit}, ${m.qtyNeeded},
          0, 0, 0, ${m.unitPrice}, 'needed'
        )
      `;
    }
  }

  if (data.sample) {
    await seedRichSample(sql, id, userId, data.startDate);
  }

  await sql`
    insert into notifications (user_id, title, body, href)
    values (
      ${userId},
      ${"Project created: " + (data.name.trim() || "Untitled home")},
      ${est.notes[0] ?? "Template, phases and BOQ are ready."},
      ${"/app/projects/" + id}
    )
  `;

  return { id, estimatedCost: est.estimatedCost, builtUpSqft: est.builtUpSqft, notes: est.notes };
}

export const createProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CreateInput) => input)
  .handler(async ({ context, data }) => plantProject(context.userId, data));

export const updatePhase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; phaseId: number; progress: number; status?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, data.projectId);
    const progress = Math.max(0, Math.min(100, Math.round(data.progress)));
    const status = data.status ?? (progress >= 100 ? "done" : progress > 0 ? "active" : "upcoming");
    await sql`
      update phases set progress = ${progress}, status = ${status}
      where id = ${data.phaseId} and project_id = ${data.projectId}
    `;
    return { ok: true as const };
  });

export const loadDemoProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const existing = await sql<{ id: number }>`
      select id from projects where owner_id = ${context.userId} and name = ${DEMO_SITE_NAME} order by id desc limit 1
    `;
    if (existing[0]) return { id: Number(existing[0].id), created: false as const };
    const start = todayISO();
    const res = await plantProject(context.userId, {
      name: DEMO_SITE_NAME,
      city: "Bengaluru",
      address: "4th Block, Koramangala",
      projectType: "new_build",
      plotSqft: 2400,
      floors: 2,
      budget: 4200000,
      startDate: start,
      targetDate: addDays(start, 270),
      requirements: "3 BHK independent house, vastu-aware, covered parking, terrace waterproofing.",
      sample: true,
    });
    return { id: res.id, created: true as const };
  });

export const previewEstimate = createServerFn({ method: "POST" })
  .validator((input: {
    type: ProjectType;
    plotSqft: number;
    floors: number;
    city: string;
    startDate: string;
    targetDate: string;
    budget?: number;
  }) => input)
  .handler(async ({ data }) => estimateProject(data));
