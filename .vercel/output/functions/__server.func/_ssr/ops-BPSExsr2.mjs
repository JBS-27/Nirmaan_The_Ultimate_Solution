import { r as createServerFn } from "./ssr.mjs";
import { n as asDate, s as num, t as addDays } from "./utils-Dhq_xXK2.mjs";
import { r as getSql } from "./db-D72tsCeV.mjs";
import { t as authMiddleware } from "./middleware-B4AAJXQg.mjs";
import { i as money, o as qty } from "./format-sbvqgmOQ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as requireProjectAccess, t as requireOwnedProject } from "./access-DX-qzaPd.mjs";
import { t as ensureCatalog } from "./seed-OVWykS8x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-BPSExsr2.js
var addChangeOrder_createServerFn_handler = createServerRpc({
	id: "59cc0c6cb21be9e0fcac852b7fa53acbce9e351863c3fd06acdbe3f7eea620ab",
	name: "addChangeOrder",
	filename: "src/lib/server/ops.ts"
}, (opts) => addChangeOrder.__executeServer(opts));
var addChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addChangeOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	const rows = await sql`
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
	return { id: rows[0].id };
});
var decideChangeOrder_createServerFn_handler = createServerRpc({
	id: "e6956c39d61611ef393416c105032b76e40be24ed4a622145ff0a92459fed7ad",
	name: "decideChangeOrder",
	filename: "src/lib/server/ops.ts"
}, (opts) => decideChangeOrder.__executeServer(opts));
var decideChangeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(decideChangeOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	await sql`
      update change_orders set status = ${data.status}
      where id = ${data.id} and project_id = ${data.projectId}
    `;
	if (data.status === "approved") {
		const [row] = await sql`
        select cost_delta, days_delta from change_orders where id = ${data.id}
      `;
		if (row) {
			await sql`
          update projects set budget = budget + ${num(row.cost_delta)}
          where id = ${data.projectId} and owner_id = ${context.userId}
        `;
			if (num(row.days_delta) !== 0) {
				const [proj] = await sql`
            select target_date from projects where id = ${data.projectId}
          `;
				await sql`
            update projects set target_date = ${addDays(asDate(proj?.target_date) || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), num(row.days_delta))}
            where id = ${data.projectId} and owner_id = ${context.userId}
          `;
			}
		}
	}
	return { ok: true };
});
var addDailyLog_createServerFn_handler = createServerRpc({
	id: "2bc1689edeeb3e8e1b2f8eeb5963941700b19ae8fab0d18573e165be84d79420",
	name: "addDailyLog",
	filename: "src/lib/server/ops.ts"
}, (opts) => addDailyLog.__executeServer(opts));
var addDailyLog = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addDailyLog_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
var exportProjectReport_createServerFn_handler = createServerRpc({
	id: "c09c06b8e76fd748a1ea6615374553a1df6deac8c123daa10d61c2bb5326187b",
	name: "exportProjectReport",
	filename: "src/lib/server/ops.ts"
}, (opts) => exportProjectReport.__executeServer(opts));
var exportProjectReport = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(exportProjectReport_createServerFn_handler, async ({ context, data: id }) => {
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
		...bills.map((b) => `${String(b.bill_date).slice(0, 10)}\t${b.vendor}\t${b.category}\t${money(num(b.amount))}\t${b.paid ? "PAID" : "DUE"}`),
		"",
		"PAYMENTS",
		...pays.map((x) => `${String(x.paid_at).slice(0, 10)}\t${x.payee}\t${x.method}\t${money(num(x.amount))}`),
		"",
		"BOQ",
		...mats.map((m) => `${m.name}\tneed ${qty(num(m.qty_needed), String(m.unit))}\tused ${qty(num(m.qty_used))}\t@ ${money(num(m.unit_price))}`)
	];
	return {
		filename: `nirmaan-${id}-ledger.txt`,
		text: lines.join("\n")
	};
});
var listMyDesk_createServerFn_handler = createServerRpc({
	id: "ddd840228c6fa726b1aa1789f6a732d65a0676541bab144474e43be74a34639e",
	name: "listMyDesk",
	filename: "src/lib/server/ops.ts"
}, (opts) => listMyDesk.__executeServer(opts));
var listMyDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyDesk_createServerFn_handler, async ({ context }) => {
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
			projectName: String(q.project_name)
		})),
		jobs: jobs.map((j) => ({
			id: num(j.id),
			projectId: num(j.project_id),
			status: String(j.status),
			role: String(j.role),
			projectName: String(j.project_name),
			city: String(j.city)
		})),
		orders: orders.map((o) => ({
			id: num(o.id),
			projectId: num(o.project_id),
			itemName: String(o.item_name),
			qty: num(o.qty),
			unitPrice: num(o.unit_price),
			status: String(o.status),
			projectName: String(o.project_name)
		}))
	};
});
var updateOrderStatus_createServerFn_handler = createServerRpc({
	id: "d30d95627b96231cd1494bc87df99c0dd82a46be8202e9bb7a858a0907fe33ec",
	name: "updateOrderStatus",
	filename: "src/lib/server/ops.ts"
}, (opts) => updateOrderStatus.__executeServer(opts));
var updateOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateOrderStatus_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const [row] = await sql`
      select o.id, o.project_id, o.owner_id
      from orders o
      join suppliers s on s.id = o.supplier_id
      where o.id = ${data.orderId} and s.user_id = ${context.userId}
    `;
	if (!row) throw new Error("Order not found");
	await sql`update orders set status = ${data.status} where id = ${data.orderId}`;
	if (data.status === "delivered") await sql`
        insert into notifications (user_id, title, body, href)
        values (
          ${row.owner_id},
          'Delivery received',
          'A supplier marked an order delivered. Reconcile quantities on the BOQ.',
          ${"/app/projects/" + row.project_id + "?tab=materials"}
        )
      `;
	return { ok: true };
});
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "5f8a988a16656da064cad5fb46cacead60a34550cde4b8af9da3c1479d5bf530",
	name: "getAdminOverview",
	filename: "src/lib/server/ops.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const [profile] = await sql`select role from profiles where user_id = ${context.userId}`;
	if (profile?.role !== "admin") throw new Error("Admin only");
	await ensureCatalog(sql);
	const [users] = await sql`select count(*)::int as n from profiles`;
	const [projects] = await sql`select count(*)::int as n from projects`;
	const [pros] = await sql`select count(*)::int as n from professionals`;
	const [unverified] = await sql`select count(*)::int as n from professionals where verified = false`;
	const [orders] = await sql`select count(*)::int as n from orders`;
	const [spend] = await sql`select coalesce(sum(amount),0)::float8 as s from payments`;
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
			status: String(p.status)
		})),
		queue: queue.map((p) => ({
			id: num(p.id),
			name: String(p.name),
			role: String(p.role),
			city: String(p.city),
			verified: Boolean(p.verified)
		}))
	};
});
var verifyProfessional_createServerFn_handler = createServerRpc({
	id: "bc125fb145b50e60bec1b623391b75508742aa89580f81faf4a556c83d167f1f",
	name: "verifyProfessional",
	filename: "src/lib/server/ops.ts"
}, (opts) => verifyProfessional.__executeServer(opts));
var verifyProfessional = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(verifyProfessional_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const [profile] = await sql`select role from profiles where user_id = ${context.userId}`;
	if (profile?.role !== "admin") throw new Error("Admin only");
	await sql`update professionals set verified = true where id = ${id}`;
	return { ok: true };
});
//#endregion
export { addChangeOrder_createServerFn_handler, addDailyLog_createServerFn_handler, decideChangeOrder_createServerFn_handler, exportProjectReport_createServerFn_handler, getAdminOverview_createServerFn_handler, listMyDesk_createServerFn_handler, updateOrderStatus_createServerFn_handler, verifyProfessional_createServerFn_handler };
