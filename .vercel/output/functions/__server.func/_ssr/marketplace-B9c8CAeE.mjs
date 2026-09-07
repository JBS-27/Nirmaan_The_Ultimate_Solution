import { o as __toESM } from "../_runtime.mjs";
import { r as CITIES } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Badge } from "./badge-CSCWzACT.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect } from "./field-6_OphhBd.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
import { i as money } from "./format-sbvqgmOQ.mjs";
import { s as Route$12 } from "./router-B2rdV4PY.mjs";
import { n as CATALOG_SUPPLIERS, t as CATALOG_PROS } from "./catalog-CHm0mlsh.mjs";
import { n as TabBar, t as Tab } from "./tabs-BIdimLhj.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-CwwwxEA3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketplace-B9c8CAeE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LABEL = {
	architect: "Architect",
	engineer: "Civil engineer",
	contractor: "Contractor",
	worker: "Skilled worker"
};
function PublicMarket() {
	const { tab, city: cityParam } = Route$12.useSearch();
	const { user } = useCurrentUserState();
	const [city, setCity] = (0, import_react.useState)(cityParam ?? "Bengaluru");
	const [role, setRole] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const signedIn = Boolean(user);
	const pros = (0, import_react.useMemo)(() => {
		return CATALOG_PROS.filter((p) => {
			if (city && p.city !== city) return false;
			if (role && p.role !== role) return false;
			if (q) {
				if (!`${p.name} ${p.specializations} ${p.bio} ${p.city}`.toLowerCase().includes(q.toLowerCase())) return false;
			}
			return true;
		});
	}, [
		city,
		role,
		q
	]);
	const shops = (0, import_react.useMemo)(() => {
		return CATALOG_SUPPLIERS.filter((s) => {
			if (city && s.city !== city) return false;
			if (q) {
				if (!`${s.name} ${s.categories} ${s.city}`.toLowerCase().includes(q.toLowerCase())) return false;
			}
			return true;
		});
	}, [city, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, { active: "market" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-forest uppercase",
						children: "Marketplace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight md:text-5xl",
						children: "Verified locals, not a directory dump."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-muted",
						children: "Bengaluru-first architects, engineers, contractors, mistry and registered shops. Browse freely — request a quote or hire after you sign in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabBar, {
						className: "mt-8 w-fit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/marketplace",
							search: {
								tab: "pros",
								city
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								active: tab !== "suppliers",
								children: "Professionals"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/marketplace",
							search: {
								tab: "suppliers",
								city
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								active: tab === "suppliers",
								children: "Material shops"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search name, skill, shop…",
								value: q,
								onChange: (e) => setQ(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: city,
								onChange: (e) => setCity(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All cities"
								}), CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.name,
									children: c.name
								}, c.name))]
							}),
							tab !== "suppliers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: role,
								onChange: (e) => setRole(e.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "All roles"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "architect",
										children: "Architect"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "engineer",
										children: "Civil engineer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "contractor",
										children: "Contractor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "worker",
										children: "Skilled worker"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
						]
					}),
					tab === "suppliers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 space-y-4",
						children: shops.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-6 text-sm text-muted",
							children: "No shops match that filter."
						}) : shops.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl tracking-tight",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted",
										children: [
											s.city,
											" · ",
											s.categories,
											" · ",
											s.deliveryDays,
											"d delivery"
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										tone: "forest",
										children: [
											s.rating.toFixed(1),
											" · ",
											s.reviews
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-4 divide-y divide-line",
									children: s.products.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between gap-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: pr.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted",
											children: [
												pr.category,
												" · ",
												pr.stock
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: [money(pr.price), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted",
												children: [" / ", pr.unit]
											})]
										})]
									}, pr.name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "mt-4",
									variant: "outline",
									children: signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/app/market",
										search: { tab: "suppliers" },
										children: "Order from a site book"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										search: { redirect: "/app/market" },
										children: "Order from a site book"
									})
								})
							]
						}, s.name))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-3 md:grid-cols-2",
						children: pros.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-6 text-sm text-muted",
							children: "No professionals match that filter."
						}) : pros.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "flex h-full flex-col p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs tracking-wide text-forest uppercase",
											children: ROLE_LABEL[p.role] ?? p.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-1 font-display text-xl tracking-tight",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: p.city
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "forest",
										children: "Verified"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 line-clamp-3 flex-1 text-sm text-ink-soft",
									children: p.bio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [
											money(p.rateMin),
											"–",
											money(p.rateMax),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted",
												children: [" / ", p.rateUnit]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted tabular-nums",
										children: [
											p.rating.toFixed(1),
											" · ",
											p.reviews,
											" reviews"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										children: signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/app/market",
											search: { tab: "pros" },
											children: "Request quote"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/login",
											search: { redirect: "/app/market" },
											children: "Request quote"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										children: signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/app/market",
											search: { tab: "pros" },
											children: "Hire"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/login",
											search: { redirect: "/app/market" },
											children: "Hire"
										})
									})]
								})
							]
						}, `${p.role}-${p.name}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { PublicMarket as component };
