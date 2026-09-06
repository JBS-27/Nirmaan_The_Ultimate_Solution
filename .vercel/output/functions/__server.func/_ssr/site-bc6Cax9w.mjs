import { r as createServerFn } from "./ssr.mjs";
import { c as todayISO } from "./utils-Dhq_xXK2.mjs";
import { r as getSql } from "./db-D72tsCeV.mjs";
import { t as authMiddleware } from "./middleware-B4AAJXQg.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as requireProjectAccess, t as requireOwnedProject } from "./access-DX-qzaPd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-bc6Cax9w.js
var upsertMaterial_createServerFn_handler = createServerRpc({
	id: "cb62dfce478ed19e2022769e82a8d6ddaaab3c6566a927165c730fa67c9d7e8c",
	name: "upsertMaterial",
	filename: "src/lib/server/site.ts"
}, (opts) => upsertMaterial.__executeServer(opts));
var upsertMaterial = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertMaterial_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireProjectAccess(sql, context.userId, data.projectId);
	const ordered = data.qtyOrdered ?? 0;
	const received = data.qtyReceived ?? 0;
	const used = data.qtyUsed ?? 0;
	const status = received >= data.qtyNeeded && data.qtyNeeded > 0 ? "received" : ordered > 0 || received > 0 ? "partial" : "needed";
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
	return { id: (await sql`
      insert into materials (
        project_id, name, category, unit, qty_needed, qty_ordered, qty_received, qty_used, unit_price, supplier_name, status
      ) values (
        ${data.projectId}, ${data.name}, ${data.category}, ${data.unit}, ${data.qtyNeeded},
        ${ordered}, ${received}, ${used}, ${data.unitPrice}, ${data.supplierName ?? null}, ${status}
      ) returning id
    `)[0].id };
});
var addBill_createServerFn_handler = createServerRpc({
	id: "7177914f98908d76a6f51bfd7c409295bab5accafc84be2a97aefdfebb2ad3f2",
	name: "addBill",
	filename: "src/lib/server/site.ts"
}, (opts) => addBill.__executeServer(opts));
var addBill = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addBill_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	return { id: (await sql`
      insert into bills (project_id, vendor, amount, bill_date, category, notes, paid, ocr_text)
      values (
        ${data.projectId}, ${data.vendor}, ${data.amount}, ${data.billDate},
        ${data.category}, ${data.notes ?? null}, ${data.paid ?? false}, ${data.ocrText ?? null}
      ) returning id
    `)[0].id };
});
var toggleBillPaid_createServerFn_handler = createServerRpc({
	id: "9bd96065613de2177a1b4e98f7e400fedb7192fc80fe26c12690cdbc958dcb65",
	name: "toggleBillPaid",
	filename: "src/lib/server/site.ts"
}, (opts) => toggleBillPaid.__executeServer(opts));
var toggleBillPaid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleBillPaid_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	await sql`update bills set paid = ${data.paid} where id = ${data.billId} and project_id = ${data.projectId}`;
	return { ok: true };
});
var addPayment_createServerFn_handler = createServerRpc({
	id: "e8897c218d3c6f571f99a0d3f1c506e5f81c5147408ee884bb503c4d28ac6d2b",
	name: "addPayment",
	filename: "src/lib/server/site.ts"
}, (opts) => addPayment.__executeServer(opts));
var addPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addPayment_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	await sql`
      insert into payments (project_id, payee, amount, method, category, paid_at, notes)
      values (${data.projectId}, ${data.payee}, ${data.amount}, ${data.method}, ${data.category}, ${data.paidAt}, ${data.notes ?? null})
    `;
	return { ok: true };
});
var addWorker_createServerFn_handler = createServerRpc({
	id: "ea193e82929f27e9839e53b4a77abf58fb78f98fc144b6271189e6b2463933fa",
	name: "addWorker",
	filename: "src/lib/server/site.ts"
}, (opts) => addWorker.__executeServer(opts));
var addWorker = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addWorker_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	return { id: (await sql`
      insert into workers (project_id, name, skill, daily_rate, phone)
      values (${data.projectId}, ${data.name}, ${data.skill}, ${data.dailyRate}, ${data.phone ?? null})
      returning id
    `)[0].id };
});
var markAttendance_createServerFn_handler = createServerRpc({
	id: "0ab90137436319046d3c35ca6a60ec67204cdd6fac4ed1651f8a548284be0279",
	name: "markAttendance",
	filename: "src/lib/server/site.ts"
}, (opts) => markAttendance.__executeServer(opts));
var markAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(markAttendance_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireProjectAccess(sql, context.userId, data.projectId);
	const date = data.workDate ?? todayISO();
	await sql`
      insert into attendance (worker_id, project_id, work_date, present, hours, method)
      values (${data.workerId}, ${data.projectId}, ${date}, ${data.present}, ${data.hours ?? 8}, ${data.method ?? "manual"})
      on conflict (worker_id, work_date) do update set
        present = excluded.present, hours = excluded.hours, method = excluded.method
    `;
	return { ok: true };
});
var payWorker_createServerFn_handler = createServerRpc({
	id: "234305ad70417c5711376128978514410316723f224a589fbb54de6fbcc084e9",
	name: "payWorker",
	filename: "src/lib/server/site.ts"
}, (opts) => payWorker.__executeServer(opts));
var payWorker = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(payWorker_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
var addPhoto_createServerFn_handler = createServerRpc({
	id: "3e9e952576b67d16ef63a68efa2092df4c0e4c87dbc9bf26fb87d4489526f568",
	name: "addPhoto",
	filename: "src/lib/server/site.ts"
}, (opts) => addPhoto.__executeServer(opts));
var addPhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addPhoto_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireProjectAccess(sql, context.userId, data.projectId);
	await sql`
      insert into photos (project_id, phase_id, caption, image_url, annotation)
      values (${data.projectId}, ${data.phaseId ?? null}, ${data.caption ?? null}, ${data.imageUrl}, ${data.annotation ?? null})
    `;
	return { ok: true };
});
var addMessage_createServerFn_handler = createServerRpc({
	id: "0deb0df5d754f7662e454520c88647d00a56481894f9296fb166892d5e043687",
	name: "addMessage",
	filename: "src/lib/server/site.ts"
}, (opts) => addMessage.__executeServer(opts));
var addMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addMessage_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireProjectAccess(sql, context.userId, data.projectId);
	const [profile] = await sql`
      select display_name from profiles where user_id = ${context.userId}
    `;
	const name = profile?.display_name || "You";
	await sql`
      insert into messages (project_id, author_id, author_name, body)
      values (${data.projectId}, ${context.userId}, ${name}, ${data.body.trim()})
    `;
	return { ok: true };
});
//#endregion
export { addBill_createServerFn_handler, addMessage_createServerFn_handler, addPayment_createServerFn_handler, addPhoto_createServerFn_handler, addWorker_createServerFn_handler, markAttendance_createServerFn_handler, payWorker_createServerFn_handler, toggleBillPaid_createServerFn_handler, upsertMaterial_createServerFn_handler };
