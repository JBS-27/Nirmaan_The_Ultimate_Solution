import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as getMyProfile } from "./profile-B0Lp5z0P.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Badge } from "./badge-CSCWzACT.mjs";
import { t as Skeleton } from "./skeleton-0mKYnHDu.mjs";
import { f as MapPin, l as Plus, v as Hammer } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./app-shell-D51N6pSh.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { a as pct, i as money } from "./format-sbvqgmOQ.mjs";
import { o as listMyDesk, s as updateOrderStatus } from "./ops-DjO1KJiz.mjs";
import { r as listProjects } from "./projects-C8H6aJTU.mjs";
import { t as Progress } from "./progress-VnzjVNto.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-DTa2jCuD.js
var import_jsx_runtime = require_jsx_runtime();
function AppHome() {
	const profile = useAsync(() => getMyProfile(), []);
	const role = profile.data?.role ?? "owner";
	if (profile.loading && !profile.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-xl" })]
	});
	if (role === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminJump, {});
	if (role === "supplier") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierHome, {});
	if (role === "architect" || role === "engineer" || role === "contractor" || role === "worker") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeHome, { role });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerHome, {});
}
function AdminJump() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Admin",
		title: "Platform desk",
		description: "Verification queue, live sites, and marketplace volume.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/admin",
				children: "Open admin"
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerHome, { compact: true })] });
}
function OwnerHome({ compact }) {
	const projects = useAsync(() => listProjects(), []);
	const profile = useAsync(() => getMyProfile(), []);
	const list = projects.data ?? [];
	const active = list.filter((p) => p.status !== "handed_over");
	const spend = list.reduce((s, p) => s + p.spent, 0);
	const budget = list.reduce((s, p) => s + p.budget, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		compact ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: profile.data ? profile.data.role : "Workspace",
			title: profile.data?.displayName ? `Hello, ${profile.data.displayName.split(" ")[0]}` : "Your sites",
			description: "Every live house, renovation and extension you own — progress, envelope, and the next risk.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app/new",
					search: {},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New project"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid grid-cols-2 gap-3 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Active sites",
					value: String(active.length)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Envelope",
					value: budget ? money(budget) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Spent",
					value: spend ? money(spend) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "City",
					value: profile.data?.city ?? "—"
				})
			]
		}),
		projects.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-44 rounded-xl" })]
		}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col items-start gap-4 p-6 md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-12 items-center justify-center rounded-lg bg-forest-soft text-forest",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "No sites yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-md text-sm text-muted",
					children: "Plant a project and Nirmaan will draft phases, a bill of quantities and a cash envelope from your plot, floors and city."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/new",
							search: {},
							children: "Create a project"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/new",
							search: { sample: "1" },
							children: "Load a sample 3BHK"
						})
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/projects/$projectId",
				params: { projectId: String(p.id) },
				search: {},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-full transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl tracking-tight",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-1 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
									p.city,
									p.address ? ` · ${p.address}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: p.status === "active" ? "forest" : "neutral",
								children: p.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: p.progress,
							className: "mt-4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [pct(p.progress), " complete"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [money(p.spent), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [" / ", money(p.budget)]
								})]
							})]
						})
					]
				})
			}, p.id))
		})
	] });
}
function TradeHome({ role }) {
	const desk = useAsync(() => listMyDesk(), []);
	const jobs = desk.data?.jobs ?? [];
	const quotes = desk.data?.quotes ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: role,
			title: "Your jobs",
			description: "Sites that hired you, plus incoming quote requests.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/market",
					search: {},
					children: "Marketplace"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid grid-cols-2 gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Active hires",
				value: String(jobs.length)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				label: "Open quotes",
				value: String(quotes.filter((q) => q.status !== "accepted").length)
			})]
		}),
		desk.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }) : jobs.length === 0 && quotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Waiting on a hire"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-md text-sm text-muted",
				children: "Your listing is live. When a homeowner requests a quote or hires you, the site book appears here."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/projects/$projectId",
				params: { projectId: String(j.projectId) },
				search: {},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: j.projectName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							j.city,
							" · ",
							j.role
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "ok",
						children: j.status
					})]
				})
			}, j.id)), quotes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: q.projectName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						q.status,
						q.amount ? ` · ${money(q.amount)}` : "",
						q.message ? ` — ${q.message}` : ""
					]
				})]
			}, q.id))]
		})
	] });
}
function SupplierHome() {
	const desk = useAsync(() => listMyDesk(), []);
	const orders = desk.data?.orders ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Supplier",
		title: "Incoming orders",
		description: "Mark dispatch and delivery. Owners see the same status on the site BOQ."
	}), desk.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-6 text-sm text-muted",
		children: "No orders yet. Keep stock and rates current on your listing."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-wrap items-center justify-between gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: o.itemName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					o.projectName,
					" · ",
					o.qty,
					" @ ",
					money(o.unitPrice)
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: o.status }),
					o.status === "placed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: async () => {
							await updateOrderStatus({ data: {
								orderId: o.id,
								status: "dispatched"
							} });
							desk.reload();
						},
						children: "Dispatch"
					}) : null,
					o.status === "dispatched" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: async () => {
							await updateOrderStatus({ data: {
								orderId: o.id,
								status: "delivered"
							} });
							desk.reload();
						},
						children: "Mark delivered"
					}) : null
				]
			})]
		}, o.id))
	})] });
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl tracking-tight tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { AppHome as component };
