import { o as __toESM } from "../_runtime.mjs";
import { r as CITIES } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Badge } from "./badge-CSCWzACT.mjs";
import { t as Skeleton } from "./skeleton-0mKYnHDu.mjs";
import { n as PageHeader } from "./app-shell-CRUE8B2h.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect } from "./field-6_OphhBd.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as money } from "./format-sbvqgmOQ.mjs";
import { r as listProjects } from "./projects-CUAJZCc9.mjs";
import { a as Route$4 } from "./router-B2rdV4PY.mjs";
import { a as matchProfessionals, i as listSuppliers, o as placeOrder, r as listProfessionals } from "./market-B3u6CWHb.mjs";
import { n as TabBar, t as Tab } from "./tabs-BIdimLhj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-SbZzR-37.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Market() {
	const { tab: tabParam } = Route$4.useSearch();
	const tab = tabParam ?? "pros";
	const [city, setCity] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const filter = (0, import_react.useMemo)(() => ({
		city: city || void 0,
		role: role || void 0,
		q: q || void 0
	}), [
		city,
		role,
		q
	]);
	const pros = useAsync(() => listProfessionals({ data: filter }), [
		filter.city,
		filter.role,
		filter.q
	]);
	const suppliers = useAsync(() => listSuppliers({ data: {
		city: city || void 0,
		q: q || void 0
	} }), [city, q]);
	const projects = useAsync(() => listProjects(), []);
	const [matchProject, setMatchProject] = (0, import_react.useState)("");
	const [matches, setMatches] = (0, import_react.useState)(null);
	const [matching, setMatching] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Marketplace",
			title: tab === "suppliers" ? "Material shops" : "Verified locals",
			description: "Architects, engineers, contractors, crews and registered suppliers — filtered by city and trade."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabBar, {
			className: "mb-4 w-fit",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/market",
				search: { tab: "pros" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
					active: tab === "pros",
					children: "Professionals"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/market",
				search: { tab: "suppliers" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
					active: tab === "suppliers",
					children: "Suppliers"
				})
			})]
		}),
		tab === "pros" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-5 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "AI match — top 5 for a site"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "City, floors, budget and specialisation, not a generic directory sort."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						className: "max-w-xs",
						value: matchProject,
						onChange: (e) => setMatchProject(e.target.value ? Number(e.target.value) : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Choose project"
						}), (projects.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: !matchProject || matching,
						onClick: async () => {
							if (!matchProject) return;
							setMatching(true);
							try {
								const rows = await matchProfessionals({ data: {
									projectId: Number(matchProject),
									role: role || void 0
								} });
								setMatches(rows);
							} finally {
								setMatching(false);
							}
						},
						children: matching ? "Matching…" : "Recommend"
					})]
				}),
				matches ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: matches.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/market/$proId",
						params: { proId: String(m.id) },
						className: "flex justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: m.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", m.reason]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-muted",
							children: m.matchScore
						})]
					}) }, m.id))
				}) : null
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 grid gap-2 sm:grid-cols-3",
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
				tab === "pros" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
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
		tab === "pros" ? pros.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: (pros.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/market/$proId",
				params: { proId: String(p.id) },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-full p-5 transition-[box-shadow] hover:shadow-[var(--shadow-card-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs tracking-wide text-forest uppercase",
									children: p.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-display text-xl tracking-tight",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: p.city
								})
							] }), p.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "forest",
								children: "Verified"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 line-clamp-2 text-sm text-ink-soft",
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
						})
					]
				})
			}, p.id))
		}) : suppliers.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }) : suppliers.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierList, { rows: suppliers.data }) : null
	] });
}
function SupplierList({ rows }) {
	const projects = useAsync(() => listProjects(), []);
	const [projectId, setProjectId] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
				value: projectId,
				onChange: (e) => setProjectId(e.target.value ? Number(e.target.value) : ""),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Ship to project…"
				}), (projects.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: p.id,
					children: p.name
				}, p.id))]
			})
		}), rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
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
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [money(pr.price), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [" / ", pr.unit]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: !projectId,
							onClick: async () => {
								if (!projectId) return;
								await placeOrder({ data: {
									projectId: Number(projectId),
									supplierId: s.id,
									productId: pr.id,
									itemName: pr.name,
									qty: 1,
									unitPrice: pr.price
								} });
								toast.success(`Ordered ${pr.name}`);
							},
							children: "Order"
						})]
					})]
				}, pr.id))
			})]
		}, s.id))]
	});
}
//#endregion
export { Market as component };
