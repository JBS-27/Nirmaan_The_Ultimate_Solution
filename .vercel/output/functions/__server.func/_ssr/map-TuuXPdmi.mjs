import { n as asDate, r as asIso, s as num } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-TuuXPdmi.js
function mapProfile(r) {
	return {
		userId: String(r.user_id),
		role: String(r.role),
		displayName: String(r.display_name ?? ""),
		phone: r.phone ? String(r.phone) : null,
		city: r.city ? String(r.city) : null,
		bio: r.bio ? String(r.bio) : null,
		languages: String(r.languages ?? "English, Hindi"),
		onboarded: Boolean(r.onboarded)
	};
}
function mapProject(r) {
	return {
		id: num(r.id),
		ownerId: String(r.owner_id),
		name: String(r.name),
		city: String(r.city),
		address: r.address ? String(r.address) : null,
		lat: r.lat == null ? null : num(r.lat),
		lng: r.lng == null ? null : num(r.lng),
		projectType: String(r.project_type),
		plotSqft: num(r.plot_sqft),
		floors: num(r.floors),
		budget: num(r.budget),
		currency: String(r.currency ?? "INR"),
		startDate: asDate(r.start_date),
		targetDate: asDate(r.target_date),
		requirements: r.requirements ? String(r.requirements) : null,
		status: String(r.status),
		createdAt: asIso(r.created_at)
	};
}
function mapPhase(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		name: String(r.name),
		sortOrder: num(r.sort_order),
		startDate: asDate(r.start_date),
		endDate: asDate(r.end_date),
		status: String(r.status),
		progress: num(r.progress),
		estimatedCost: num(r.estimated_cost)
	};
}
function mapMaterial(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		phaseId: r.phase_id == null ? null : num(r.phase_id),
		name: String(r.name),
		category: String(r.category),
		unit: String(r.unit),
		qtyNeeded: num(r.qty_needed),
		qtyOrdered: num(r.qty_ordered),
		qtyReceived: num(r.qty_received),
		qtyUsed: num(r.qty_used),
		unitPrice: num(r.unit_price),
		supplierName: r.supplier_name ? String(r.supplier_name) : null,
		status: String(r.status)
	};
}
function mapBill(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		vendor: String(r.vendor),
		amount: num(r.amount),
		billDate: asDate(r.bill_date),
		category: String(r.category),
		notes: r.notes ? String(r.notes) : null,
		paid: Boolean(r.paid),
		ocrText: r.ocr_text ? String(r.ocr_text) : null
	};
}
function mapPayment(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		payee: String(r.payee),
		amount: num(r.amount),
		method: String(r.method),
		category: String(r.category),
		paidAt: asDate(r.paid_at),
		notes: r.notes ? String(r.notes) : null
	};
}
function mapWorker(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		name: String(r.name),
		skill: String(r.skill),
		dailyRate: num(r.daily_rate),
		phone: r.phone ? String(r.phone) : null,
		status: String(r.status)
	};
}
function mapAttendance(r) {
	return {
		id: num(r.id),
		workerId: num(r.worker_id),
		projectId: num(r.project_id),
		workDate: asDate(r.work_date),
		present: Boolean(r.present),
		hours: num(r.hours),
		method: String(r.method)
	};
}
function mapPayout(r) {
	return {
		id: num(r.id),
		workerId: num(r.worker_id),
		projectId: num(r.project_id),
		amount: num(r.amount),
		periodLabel: r.period_label ? String(r.period_label) : null,
		paidAt: asDate(r.paid_at)
	};
}
function mapPhoto(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		phaseId: r.phase_id == null ? null : num(r.phase_id),
		caption: r.caption ? String(r.caption) : null,
		imageUrl: String(r.image_url),
		annotation: r.annotation ? String(r.annotation) : null,
		createdAt: asIso(r.created_at)
	};
}
function mapMessage(r) {
	return {
		id: num(r.id),
		projectId: num(r.project_id),
		authorId: String(r.author_id),
		authorName: String(r.author_name),
		body: String(r.body),
		createdAt: asIso(r.created_at)
	};
}
function mapPro(r) {
	return {
		id: num(r.id),
		userId: r.user_id ? String(r.user_id) : null,
		role: String(r.role),
		name: String(r.name),
		city: String(r.city),
		specializations: String(r.specializations),
		rateMin: num(r.rate_min),
		rateMax: num(r.rate_max),
		rateUnit: String(r.rate_unit),
		rating: num(r.rating),
		reviews: num(r.reviews),
		bio: String(r.bio),
		licenses: r.licenses ? String(r.licenses) : null,
		languages: String(r.languages),
		verified: Boolean(r.verified),
		responseHours: num(r.response_hours),
		availability: String(r.availability)
	};
}
function mapSupplier(r) {
	return {
		id: num(r.id),
		userId: r.user_id ? String(r.user_id) : null,
		name: String(r.name),
		city: String(r.city),
		categories: String(r.categories),
		rating: num(r.rating),
		reviews: num(r.reviews),
		deliveryDays: num(r.delivery_days),
		phone: r.phone ? String(r.phone) : null,
		verified: Boolean(r.verified),
		address: r.address ? String(r.address) : null
	};
}
//#endregion
export { mapPayment as a, mapPhoto as c, mapProject as d, mapSupplier as f, mapMessage as i, mapPro as l, mapBill as n, mapPayout as o, mapWorker as p, mapMaterial as r, mapPhase as s, mapAttendance as t, mapProfile as u };
