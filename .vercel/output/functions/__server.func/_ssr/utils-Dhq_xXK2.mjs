import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-Dhq_xXK2.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function num(v) {
	if (typeof v === "number" && Number.isFinite(v)) return v;
	if (typeof v === "string") {
		const n = Number(v);
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function asDate(v) {
	if (typeof v === "string") return v.slice(0, 10);
	if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
	return "";
}
function asIso(v) {
	if (typeof v === "string") return v;
	if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString();
	return (/* @__PURE__ */ new Date()).toISOString();
}
function isUnauthorized(err) {
	return err instanceof Error && (err.message === "Unauthorized" || err.status === 401);
}
function todayISO() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function addDays(iso, days) {
	const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
	const da = (/* @__PURE__ */ new Date(a + "T00:00:00")).getTime();
	const db = (/* @__PURE__ */ new Date(b + "T00:00:00")).getTime();
	return Math.round((db - da) / 864e5);
}
//#endregion
export { daysBetween as a, todayISO as c, cn as i, asDate as n, isUnauthorized as o, asIso as r, num as s, addDays as t };
