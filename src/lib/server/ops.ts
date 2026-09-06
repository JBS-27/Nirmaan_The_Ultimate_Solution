import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { money, qty } from "@/lib/format";
import { addDays, asDate, num } from "@/lib/utils";
import { requireOwnedProject, requireProjectAccess } from "./access";
import { ensureCatalog } from "./seed";

export const addChangeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    projectId: number;
    title: string;
    detail?: string;
    costDelta: number;
    daysDelta: number;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    const rows = await sql<{ id: number }>`
      insert into change_orders (project_id, title, detail, cost_delta, days_delta, status)
      values (
        ${data.projectId}, ${data.title.trim()}, ${data.detail ?? null},
        ${Math.round(data.costDelta)}, ${Math.round(data.daysDelta)}, 'proposed'
      )
      returning id
    `;
    await sql`
      insert into notifications (user_id, title, body, href)
      values (
        ${context.userId},
        ${"Change order: " + data.title.trim()},
        ${"Impact " + money(data.costDelta) + ", " + data.daysDelta + " days."},
        ${"/app/projects/" + data.projectId + "?tab=changes"}
      )
    `;
    return { id: rows[0]!.id };
  });

export const decideChangeOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; id: number; status: "approved" | "rejected" }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    await sql`
      update change_orders set status = ${data.status}
      where id = ${data.id} and project_id = ${data.projectId}
    `;
    if (data.status === "approved") {
      const [row] = await sql<{ cost_delta: number; days_delta: number }>`
        select cost_delta, days_delta from change_orders where id = ${data.id}
      `;
      if (row) {
        await sql`
          update projects set budget = budget + ${num(row.cost_delta)}
          where id = ${data.projectId} and owner_id = ${context.userId}
        `;
        if (num(row.days_delta) !== 0) {
          const [proj] = await sql<{ target_date: unknown }>`
            select target_date from projects where id = ${data.projectId}
          `;
          const next = addDays(asDate(proj?.target_date) || new Date().toISOString().slice(0, 10), num(row.days_delta));
          await sql`
            update projects set target_date = ${next}
            where id = ${data.projectId} and owner_id = ${context.userId}
          `;
        }
      }
    }
    return { ok: true as const };
  });

export const addDailyLog = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    projectId: number;
    logDate: string;
    weather: string;
    workersCount: number;
    notes?: string;
    issues?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, data.projectId);
    await sql`
      insert into daily_logs (project_id, log_date, weather, workers_count, notes, issues)
      values (
        ${data.projectId}, ${data.logDate}, ${data.weather},
        ${Math.max(0, Math.round(data.workersCount))}, ${data.notes ?? null}, ${data.issues ?? null}
      )
      on conflict (project_id, log_date) do update set
        weather = excluded.weather,
        workers_count = excluded.workers_count,
        notes = excluded.notes,
        issues = excluded.issues
    `;
    return { ok: true as const };
  });

export const exportProjectReport = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, id);
    const [p] = await sql`select * from projects where id = ${id}`;
    const bills = await sql`select * from bills where project_id = ${id} order by bill_date`;
    const pays = await sql`select * from payments where project_id = ${id} order by paid_at`;
    const mats = await sql`select * from materials where project_id = ${id}`;
    const lines = [
      `NIRMAAN SITE REPORT`,
      `${p?.name} · ${p?.city} · GST-ready ledger`,
      `Budget ${money(num(p?.budget))} · ${p?.start_date} → ${p?.target_date}`,
      "",
      "BILLS",
      ...bills.map(
        (b) =>
          `${String(b.bill_date).slice(0, 10)}\t${b.vendor}\t${b.category}\t${money(num(b.amount))}\t${b.paid ? "PAID" : "DUE"}`,
      ),
      "",
      "PAYMENTS",
      ...pays.map((x) => `${String(x.paid_at).slice(0, 10)}\t${x.payee}\t${x.method}\t${money(num(x.amount))}`),
      "",
      "BOQ",
      ...mats.map(
        (m) =>
          `${m.name}\tneed ${qty(num(m.qty_needed), String(m.unit))}\tused ${qty(num(m.qty_used))}\t@ ${money(num(m.unit_price))}`,
      ),
    ];
    return { filename: `nirmaan-${id}-ledger.txt`, text: lines.join("\n") };
  });

export const listMyDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureCatalog(sql);
    const quotes = await sql`
      select q.*, pr.name as professional_name, p.name as project_name
      from quotes q
      join professionals pr on pr.id = q.professional_id
      join projects p on p.id = q.project_id
      where pr.user_id = ${context.userId}
      order by q.created_at desc
      limit 20
    `;
    const jobs = await sql`
      select h.*, pr.role as role, p.name as project_name, p.city as city, p.id as project_id
      from hires h
      join professionals pr on pr.id = h.professional_id
      join projects p on p.id = h.project_id
      where pr.user_id = ${context.userId}
      order by h.hired_at desc
    `;
    const orders = await sql`
      select o.*, s.name as supplier_name, p.name as project_name
      from orders o
      join suppliers s on s.id = o.supplier_id
      join projects p on p.id = o.project_id
      where s.user_id = ${context.userId}
      order by o.created_at desc
      limit 30
    `;
    return {
      quotes: quotes.map((q) => ({
        id: num(q.id),
        projectId: num(q.project_id),
        amount: q.amount == null ? null : num(q.amount),
        message: q.message ? String(q.message) : null,
        status: String(q.status),
        professionalName: String(q.professional_name),
        projectName: String(q.project_name),
      })),
      jobs: jobs.map((j) => ({
        id: num(j.id),
        projectId: num(j.project_id),
        status: String(j.status),
        role: String(j.role),
        projectName: String(j.project_name),
        city: String(j.city),
      })),
      orders: orders.map((o) => ({
        id: num(o.id),
        projectId: num(o.project_id),
        itemName: String(o.item_name),
        qty: num(o.qty),
        unitPrice: num(o.unit_price),
        status: String(o.status),
        projectName: String(o.project_name),
      })),
    };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { orderId: number; status: "placed" | "dispatched" | "delivered" }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const [row] = await sql<{ id: number; project_id: number; owner_id: string }>`
      select o.id, o.project_id, o.owner_id
      from orders o
      join suppliers s on s.id = o.supplier_id
      where o.id = ${data.orderId} and s.user_id = ${context.userId}
    `;
    if (!row) throw new Error("Order not found");
    await sql`update orders set status = ${data.status} where id = ${data.orderId}`;
    if (data.status === "delivered") {
      await sql`
        insert into notifications (user_id, title, body, href)
        values (
          ${row.owner_id},
          'Delivery received',
          'A supplier marked an order delivered. Reconcile quantities on the BOQ.',
          ${"/app/projects/" + row.project_id + "?tab=materials"}
        )
      `;
    }
    return { ok: true as const };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const [profile] = await sql<{ role: string }>`select role from profiles where user_id = ${context.userId}`;
    if (profile?.role !== "admin") throw new Error("Admin only");
    await ensureCatalog(sql);
    const [users] = await sql<{ n: number }>`select count(*)::int as n from profiles`;
    const [projects] = await sql<{ n: number }>`select count(*)::int as n from projects`;
    const [pros] = await sql<{ n: number }>`select count(*)::int as n from professionals`;
    const [unverified] = await sql<{ n: number }>`select count(*)::int as n from professionals where verified = false`;
    const [orders] = await sql<{ n: number }>`select count(*)::int as n from orders`;
    const [spend] = await sql<{ s: number }>`select coalesce(sum(amount),0)::float8 as s from payments`;
    const recent = await sql`
      select id, name, city, budget, status, created_at from projects order by created_at desc limit 8
    `;
    const queue = await sql`
      select id, name, role, city, verified from professionals where verified = false order by id desc limit 12
    `;
    return {
      users: num(users?.n),
      projects: num(projects?.n),
      professionals: num(pros?.n),
      unverified: num(unverified?.n),
      orders: num(orders?.n),
      payments: num(spend?.s),
      recent: recent.map((p) => ({
        id: num(p.id),
        name: String(p.name),
        city: String(p.city),
        budget: num(p.budget),
        status: String(p.status),
      })),
      queue: queue.map((p) => ({
        id: num(p.id),
        name: String(p.name),
        role: String(p.role),
        city: String(p.city),
        verified: Boolean(p.verified),
      })),
    };
  });

export const verifyProfessional = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const [profile] = await sql<{ role: string }>`select role from profiles where user_id = ${context.userId}`;
    if (profile?.role !== "admin") throw new Error("Admin only");
    await sql`update professionals set verified = true where id = ${id}`;
    return { ok: true as const };
  });
