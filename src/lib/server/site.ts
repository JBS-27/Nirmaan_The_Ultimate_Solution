import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { todayISO } from "@/lib/utils";
import { requireOwnedProject, requireProjectAccess } from "./access";

export const upsertMaterial = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    projectId: number;
    name: string;
    category: string;
    unit: string;
    qtyNeeded: number;
    qtyOrdered?: number;
    qtyReceived?: number;
    qtyUsed?: number;
    unitPrice: number;
    supplierName?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, data.projectId);
    const ordered = data.qtyOrdered ?? 0;
    const received = data.qtyReceived ?? 0;
    const used = data.qtyUsed ?? 0;
    const status =
      received >= data.qtyNeeded && data.qtyNeeded > 0
        ? "received"
        : ordered > 0 || received > 0
          ? "partial"
          : "needed";
    if (data.id) {
      await sql`
        update materials set
          name = ${data.name}, category = ${data.category}, unit = ${data.unit},
          qty_needed = ${data.qtyNeeded}, qty_ordered = ${ordered}, qty_received = ${received},
          qty_used = ${used}, unit_price = ${data.unitPrice}, supplier_name = ${data.supplierName ?? null},
          status = ${status}
        where id = ${data.id} and project_id = ${data.projectId}
      `;
      return { id: data.id };
    }
    const rows = await sql<{ id: number }>`
      insert into materials (
        project_id, name, category, unit, qty_needed, qty_ordered, qty_received, qty_used, unit_price, supplier_name, status
      ) values (
        ${data.projectId}, ${data.name}, ${data.category}, ${data.unit}, ${data.qtyNeeded},
        ${ordered}, ${received}, ${used}, ${data.unitPrice}, ${data.supplierName ?? null}, ${status}
      ) returning id
    `;
    return { id: rows[0]!.id };
  });

export const addBill = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    projectId: number;
    vendor: string;
    amount: number;
    billDate: string;
    category: string;
    notes?: string;
    paid?: boolean;
    ocrText?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    const rows = await sql<{ id: number }>`
      insert into bills (project_id, vendor, amount, bill_date, category, notes, paid, ocr_text)
      values (
        ${data.projectId}, ${data.vendor}, ${data.amount}, ${data.billDate},
        ${data.category}, ${data.notes ?? null}, ${data.paid ?? false}, ${data.ocrText ?? null}
      ) returning id
    `;
    return { id: rows[0]!.id };
  });

export const toggleBillPaid = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; billId: number; paid: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    await sql`update bills set paid = ${data.paid} where id = ${data.billId} and project_id = ${data.projectId}`;
    return { ok: true as const };
  });

export const addPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    projectId: number;
    payee: string;
    amount: number;
    method: string;
    category: string;
    paidAt: string;
    notes?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    await sql`
      insert into payments (project_id, payee, amount, method, category, paid_at, notes)
      values (${data.projectId}, ${data.payee}, ${data.amount}, ${data.method}, ${data.category}, ${data.paidAt}, ${data.notes ?? null})
    `;
    return { ok: true as const };
  });

export const addWorker = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; name: string; skill: string; dailyRate: number; phone?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    const rows = await sql<{ id: number }>`
      insert into workers (project_id, name, skill, daily_rate, phone)
      values (${data.projectId}, ${data.name}, ${data.skill}, ${data.dailyRate}, ${data.phone ?? null})
      returning id
    `;
    return { id: rows[0]!.id };
  });

export const markAttendance = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    projectId: number;
    workerId: number;
    workDate?: string;
    present: boolean;
    hours?: number;
    method?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, data.projectId);
    const date = data.workDate ?? todayISO();
    await sql`
      insert into attendance (worker_id, project_id, work_date, present, hours, method)
      values (${data.workerId}, ${data.projectId}, ${date}, ${data.present}, ${data.hours ?? 8}, ${data.method ?? "manual"})
      on conflict (worker_id, work_date) do update set
        present = excluded.present, hours = excluded.hours, method = excluded.method
    `;
    return { ok: true as const };
  });

export const payWorker = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; workerId: number; amount: number; periodLabel?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireOwnedProject(sql, context.userId, data.projectId);
    await sql`
      insert into payouts (worker_id, project_id, amount, period_label, paid_at)
      values (${data.workerId}, ${data.projectId}, ${data.amount}, ${data.periodLabel ?? "Weekly"}, ${todayISO()})
    `;
    await sql`
      insert into payments (project_id, payee, amount, method, category, paid_at, notes)
      select ${data.projectId}, name, ${data.amount}, 'upi', 'labor', ${todayISO()}, ${data.periodLabel ?? "Wage payout"}
      from workers where id = ${data.workerId} and project_id = ${data.projectId}
    `;
    return { ok: true as const };
  });

export const addPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; phaseId?: number; caption?: string; imageUrl: string; annotation?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, data.projectId);
    await sql`
      insert into photos (project_id, phase_id, caption, image_url, annotation)
      values (${data.projectId}, ${data.phaseId ?? null}, ${data.caption ?? null}, ${data.imageUrl}, ${data.annotation ?? null})
    `;
    return { ok: true as const };
  });

export const addMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { projectId: number; body: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireProjectAccess(sql, context.userId, data.projectId);
    const [profile] = await sql<{ display_name: string }>`
      select display_name from profiles where user_id = ${context.userId}
    `;
    const name = profile?.display_name || "You";
    await sql`
      insert into messages (project_id, author_id, author_name, body)
      values (${data.projectId}, ${context.userId}, ${name}, ${data.body.trim()})
    `;
    return { ok: true as const };
  });
