import { r as createServerFn } from "./ssr.mjs";
import { s as num } from "./utils-Dhq_xXK2.mjs";
import { r as getSql } from "./db-D72tsCeV.mjs";
import { t as authMiddleware } from "./middleware-B4AAJXQg.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as requireOwnedProject } from "./access-DX-qzaPd.mjs";
import { f as mapSupplier, l as mapPro } from "./map-TuuXPdmi.mjs";
import { t as ensureCatalog } from "./seed-OVWykS8x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-DmoYdRng.js
var listProfessionals_createServerFn_handler = createServerRpc({
	id: "a5720b07415edc2b0285a0d96695b4cf7a5dd60eca2bb44b90689f1cc63b9ed5",
	name: "listProfessionals",
	filename: "src/lib/server/market.ts"
}, (opts) => listProfessionals.__executeServer(opts));
var listProfessionals = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(listProfessionals_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureCatalog(sql);
	let rows = await sql`select * from professionals order by rating desc, reviews desc`;
	if (data.city) rows = rows.filter((r) => String(r.city) === data.city);
	if (data.role) rows = rows.filter((r) => String(r.role) === data.role);
	if (data.q) {
		const q = data.q.toLowerCase();
		rows = rows.filter((r) => `${r.name} ${r.specializations} ${r.bio} ${r.city}`.toLowerCase().includes(q));
	}
	return rows.map(mapPro);
});
var getProfessional_createServerFn_handler = createServerRpc({
	id: "b09a85c0746ba947b29b309b1035ee72520fdc9f2b83ae114df08b75a915bf8e",
	name: "getProfessional",
	filename: "src/lib/server/market.ts"
}, (opts) => getProfessional.__executeServer(opts));
var getProfessional = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getProfessional_createServerFn_handler, async ({ data: id }) => {
	const sql = await getSql();
	await ensureCatalog(sql);
	const [row] = await sql`select * from professionals where id = ${id}`;
	return row ? mapPro(row) : null;
});
var listSuppliers_createServerFn_handler = createServerRpc({
	id: "e8db1f6314bd4f1962ad52c070e4d7eb56ea22331a95cb86b670d2759508c70c",
	name: "listSuppliers",
	filename: "src/lib/server/market.ts"
}, (opts) => listSuppliers.__executeServer(opts));
var listSuppliers = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input = {}) => input).handler(listSuppliers_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await ensureCatalog(sql);
	let rows = await sql`select * from suppliers order by rating desc`;
	if (data.city) rows = rows.filter((r) => String(r.city) === data.city);
	if (data.q) {
		const q = data.q.toLowerCase();
		rows = rows.filter((r) => `${r.name} ${r.categories} ${r.city}`.toLowerCase().includes(q));
	}
	const products = await sql`select * from products`;
	return rows.map((s) => {
		const supplier = mapSupplier(s);
		return {
			...supplier,
			products: products.filter((p) => num(p.supplier_id) === supplier.id).map((p) => ({
				id: num(p.id),
				supplierId: num(p.supplier_id),
				name: String(p.name),
				category: String(p.category),
				unit: String(p.unit),
				price: num(p.price),
				stock: String(p.stock)
			}))
		};
	});
});
var requestQuote_createServerFn_handler = createServerRpc({
	id: "f7512fab3619a10aa51224cc1da03f0722aa6fb61b955f0e12609f75003c5cda",
	name: "requestQuote",
	filename: "src/lib/server/market.ts"
}, (opts) => requestQuote.__executeServer(opts));
var requestQuote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(requestQuote_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	const [pro] = await sql`
      select rate_min, rate_max, name from professionals where id = ${data.professionalId}
    `;
	const [proj] = await sql`
      select budget, plot_sqft, name from projects where id = ${data.projectId}
    `;
	if (!pro || !proj) throw new Error("Not found");
	const amount = Math.round((num(pro.rate_min) + num(pro.rate_max)) / 2);
	await sql`
      insert into quotes (project_id, owner_id, professional_id, amount, message, status)
      values (${data.projectId}, ${context.userId}, ${data.professionalId}, ${amount}, ${data.message ?? null}, 'quoted')
    `;
	await sql`
      insert into notifications (user_id, title, body, href)
      values (
        ${context.userId},
        ${"Quote in from " + pro.name},
        ${"Indicative " + amount + " — review and hire from the project."},
        ${"/app/projects/" + data.projectId + "?tab=team"}
      )
    `;
	return {
		amount,
		name: String(pro.name)
	};
});
var hireProfessional_createServerFn_handler = createServerRpc({
	id: "ce376a081ef9ab70538e09b25c25b92a27e6c6bd29d1b4d5e52f0d5f429297f1",
	name: "hireProfessional",
	filename: "src/lib/server/market.ts"
}, (opts) => hireProfessional.__executeServer(opts));
var hireProfessional = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(hireProfessional_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	if (!(await sql`
      select id from hires where project_id = ${data.projectId} and professional_id = ${data.professionalId}
    `)[0]) await sql`
        insert into hires (project_id, professional_id, status)
        values (${data.projectId}, ${data.professionalId}, 'active')
      `;
	await sql`
      update quotes set status = 'accepted'
      where project_id = ${data.projectId} and professional_id = ${data.professionalId} and owner_id = ${context.userId}
    `;
	const [pro] = await sql`
      select name, role from professionals where id = ${data.professionalId}
    `;
	await sql`
      insert into messages (project_id, author_id, author_name, body)
      values (
        ${data.projectId}, ${context.userId}, 'You',
        ${"Hired " + (pro?.name ?? "professional") + " as " + (pro?.role ?? "consultant") + "."}
      )
    `;
	if (pro?.role === "worker") {
		const [exists] = await sql`
        select id from workers where project_id = ${data.projectId} and name = ${pro.name ?? ""}
      `;
		if (!exists) await sql`
          insert into workers (project_id, name, skill, daily_rate, status)
          values (${data.projectId}, ${pro.name ?? "Worker"}, 'Mason', 1100, 'active')
        `;
	}
	return { ok: true };
});
var matchProfessionals_createServerFn_handler = createServerRpc({
	id: "ea245cee147f8e726e879e0d40cb69193a923a24ab20f9238e6b51c8ea4e1dd9",
	name: "matchProfessionals",
	filename: "src/lib/server/market.ts"
}, (opts) => matchProfessionals.__executeServer(opts));
var matchProfessionals = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(matchProfessionals_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	await ensureCatalog(sql);
	const [proj] = await sql`
      select city, project_type, floors, budget, plot_sqft from projects where id = ${data.projectId}
    `;
	if (!proj) throw new Error("Not found");
	let rows = await sql`select * from professionals order by rating desc`;
	if (data.role) rows = rows.filter((r) => String(r.role) === data.role);
	const floors = num(proj.floors);
	const budget = num(proj.budget);
	return rows.map((r) => {
		const pro = mapPro(r);
		let score = pro.rating * 12 + Math.min(20, pro.reviews / 4);
		const reasons = [];
		if (pro.city === String(proj.city)) {
			score += 28;
			reasons.push(`Same city (${pro.city})`);
		} else {
			score -= 8;
			reasons.push(`Travels from ${pro.city}`);
		}
		if (floors >= 3 && /RCC|structural|storey|3|4/i.test(`${pro.specializations} ${pro.bio}`)) {
			score += 16;
			reasons.push("Fits multi-storey RCC work");
		}
		if (budget > 0 && pro.rateUnit === "project" && pro.rateMax < budget * .12) {
			score += 10;
			reasons.push("Fee sits inside the envelope");
		}
		if (pro.availability.toLowerCase().includes("available")) {
			score += 8;
			reasons.push(pro.availability);
		}
		if (pro.verified) score += 6;
		return {
			...pro,
			matchScore: Math.round(score),
			reason: reasons.slice(0, 3).join(" · ") || pro.specializations
		};
	}).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "eff12e028cf476f6e11931cc9890b0cda92fc20361d33e4e4bf3592435b84596",
	name: "placeOrder",
	filename: "src/lib/server/market.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(placeOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireOwnedProject(sql, context.userId, data.projectId);
	await sql`
      insert into orders (project_id, owner_id, supplier_id, product_id, item_name, qty, unit_price, status)
      values (
        ${data.projectId}, ${context.userId}, ${data.supplierId}, ${data.productId ?? null},
        ${data.itemName}, ${data.qty}, ${data.unitPrice}, 'placed'
      )
    `;
	await sql`
      update materials set
        qty_ordered = qty_ordered + ${data.qty},
        supplier_name = (select name from suppliers where id = ${data.supplierId}),
        status = 'partial'
      where project_id = ${data.projectId} and lower(name) like ${"%" + data.itemName.toLowerCase().split(" ")[0] + "%"}
    `;
	return { ok: true };
});
//#endregion
export { getProfessional_createServerFn_handler, hireProfessional_createServerFn_handler, listProfessionals_createServerFn_handler, listSuppliers_createServerFn_handler, matchProfessionals_createServerFn_handler, placeOrder_createServerFn_handler, requestQuote_createServerFn_handler };
