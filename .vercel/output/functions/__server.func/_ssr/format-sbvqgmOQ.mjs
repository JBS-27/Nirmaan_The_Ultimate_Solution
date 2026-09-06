//#region node_modules/.nitro/vite/services/ssr/assets/format-sbvqgmOQ.js
function money(n, currency = "INR") {
	try {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency,
			maximumFractionDigits: 0
		}).format(Math.round(n));
	} catch {
		return `₹${Math.round(n).toLocaleString("en-IN")}`;
	}
}
function compactMoney(n) {
	const abs = Math.abs(n);
	if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
	if (abs >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
	if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`;
	return money(n);
}
function qty(n, unit) {
	const rounded = Math.abs(n - Math.round(n)) < .05 ? Math.round(n) : Number(n.toFixed(1));
	return unit ? `${rounded.toLocaleString("en-IN")} ${unit}` : rounded.toLocaleString("en-IN");
}
function formatDate(iso) {
	if (!iso) return "—";
	return (/* @__PURE__ */ new Date(iso.slice(0, 10) + "T00:00:00")).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function formatShort(iso) {
	if (!iso) return "—";
	return (/* @__PURE__ */ new Date(iso.slice(0, 10) + "T00:00:00")).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short"
	});
}
function pct(n) {
	return `${Math.round(n)}%`;
}
//#endregion
export { pct as a, money as i, formatDate as n, qty as o, formatShort as r, compactMoney as t };
