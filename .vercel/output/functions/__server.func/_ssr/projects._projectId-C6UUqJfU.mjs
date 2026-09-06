import { o as __toESM } from "../_runtime.mjs";
import { c as SKILLS, i as MATERIAL_CATEGORIES, n as BILL_CATEGORIES } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as daysBetween, c as todayISO, i as cn } from "./utils-Dhq_xXK2.mjs";
import { t as authMiddleware } from "./middleware-B4AAJXQg.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Badge } from "./badge-CSCWzACT.mjs";
import { t as Skeleton } from "./skeleton-0mKYnHDu.mjs";
import { C as Camera, S as Check, a as TriangleAlert, d as MessageSquare, f as MapPin, g as IndianRupee, l as Plus, r as Users, t as X } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect, t as Field } from "./field-6_OphhBd.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
import { t as Textarea } from "./textarea-CbfET7rk.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as pct, i as money, n as formatDate, o as qty, r as formatShort, t as compactMoney } from "./format-sbvqgmOQ.mjs";
import { i as exportProjectReport, n as addDailyLog, r as decideChangeOrder, t as addChangeOrder } from "./ops-DjO1KJiz.mjs";
import { a as updatePhase, n as getProject } from "./projects-C8H6aJTU.mjs";
import { t as Progress } from "./progress-VnzjVNto.mjs";
import { n as Route } from "./router-Drx5sfKU.mjs";
import { a as optimizeSchedule, o as parseBillOcr, t as annotatePhoto } from "./ai-DTwm6TF6.mjs";
import { n as hireProfessional } from "./market-BgNvSvCG.mjs";
import { n as TabBar, t as Tab } from "./tabs-BIdimLhj.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._projectId-C6UUqJfU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-bg-elevated p-5 text-ink shadow-[var(--shadow-card)] focus:outline-none", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-2 text-muted hover:bg-bg-sunken",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-xl font-medium tracking-tight", className),
		...props
	});
}
function DialogDesc({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
		className: cn("mt-1 text-sm text-muted", className),
		...props
	});
}
var upsertMaterial = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cb62dfce478ed19e2022769e82a8d6ddaaab3c6566a927165c730fa67c9d7e8c"));
var addBill = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7177914f98908d76a6f51bfd7c409295bab5accafc84be2a97aefdfebb2ad3f2"));
var toggleBillPaid = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9bd96065613de2177a1b4e98f7e400fedb7192fc80fe26c12690cdbc958dcb65"));
var addPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e8897c218d3c6f571f99a0d3f1c506e5f81c5147408ee884bb503c4d28ac6d2b"));
var addWorker = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ea193e82929f27e9839e53b4a77abf58fb78f98fc144b6271189e6b2463933fa"));
var markAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0ab90137436319046d3c35ca6a60ec67204cdd6fac4ed1651f8a548284be0279"));
var payWorker = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("234305ad70417c5711376128978514410316723f224a589fbb54de6fbcc084e9"));
var addPhoto = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3e9e952576b67d16ef63a68efa2092df4c0e4c87dbc9bf26fb87d4489526f568"));
var addMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0deb0df5d754f7662e454520c88647d00a56481894f9296fb166892d5e043687"));
var TABS = [
	{
		id: "overview",
		label: "Overview"
	},
	{
		id: "materials",
		label: "Materials"
	},
	{
		id: "crew",
		label: "Crew"
	},
	{
		id: "bills",
		label: "Bills"
	},
	{
		id: "schedule",
		label: "Schedule"
	},
	{
		id: "photos",
		label: "Photos"
	},
	{
		id: "money",
		label: "Money"
	},
	{
		id: "team",
		label: "Team"
	},
	{
		id: "changes",
		label: "Changes"
	},
	{
		id: "log",
		label: "Daily log"
	},
	{
		id: "chat",
		label: "Chat"
	}
];
function ProjectPage() {
	const { projectId } = Route.useParams();
	const { tab: tabParam } = Route.useSearch();
	const tab = tabParam ?? "overview";
	const id = Number(projectId);
	const q = useAsync(() => getProject({ data: id }), [id]);
	const snap = q.data;
	if (q.loading && !snap) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-2/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full rounded-xl" })]
	});
	if (!snap) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "Site not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			variant: "outline",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app",
				children: "Back to sites"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-1 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
					snap.project.city,
					snap.project.address ? ` · ${snap.project.address}` : ""
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl font-medium tracking-tight md:text-4xl",
				children: snap.project.name
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: snap.remaining < 0 ? "danger" : "forest",
						children: snap.project.status
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: snap.project.projectType.replace("_", " ") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app/assistant",
							search: { projectId: String(snap.project.id) },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), "Ask the twin"]
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {
			className: "mb-5",
			children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/projects/$projectId",
				params: { projectId },
				search: { tab: t.id },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
					active: tab === t.id,
					children: t.label
				})
			}, t.id))
		}),
		tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, { snap }),
		tab === "materials" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Materials, {
			snap,
			onChange: q.reload
		}),
		tab === "crew" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crew, {
			snap,
			onChange: q.reload
		}),
		tab === "bills" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bills, {
			snap,
			onChange: q.reload
		}),
		tab === "schedule" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Schedule, {
			snap,
			onChange: q.reload
		}),
		tab === "photos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Photos, {
			snap,
			onChange: q.reload
		}),
		tab === "money" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, {
			snap,
			onChange: q.reload
		}),
		tab === "team" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Team, {
			snap,
			onChange: q.reload
		}),
		tab === "changes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Changes, {
			snap,
			onChange: q.reload
		}),
		tab === "log" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyLogs, {
			snap,
			onChange: q.reload
		}),
		tab === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chat, {
			snap,
			onChange: q.reload
		})
	] });
}
function Overview({ snap }) {
	const daysLeft = daysBetween(todayISO(), snap.project.targetDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Progress",
						value: pct(snap.progress),
						hint: `${snap.phases.filter((p) => p.status === "done").length} of ${snap.phases.length} phases`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Spent",
						value: compactMoney(snap.spent),
						hint: `of ${money(snap.project.budget)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Remaining",
						value: compactMoney(snap.remaining),
						hint: snap.remaining < 0 ? "Over envelope" : "In envelope",
						danger: snap.remaining < 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Days to handover",
						value: String(daysLeft),
						hint: daysLeft < 0 ? "Past target" : "On the clock",
						danger: daysLeft < 0
					})
				]
			}),
			snap.risks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "space-y-2 p-4",
				children: snap.risks.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: cn("mt-0.5 size-4 shrink-0", r.level === "danger" ? "text-danger" : r.level === "warn" ? "text-warn" : "text-forest") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: r.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: r.detail
					})] })]
				}, r.title))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs tracking-wide text-muted uppercase",
					children: "Phases"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: snap.phases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted tabular-nums",
							children: [
								formatShort(p.startDate),
								" – ",
								formatShort(p.endDate),
								" · ",
								pct(p.progress)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: p.progress })] }, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-xs tracking-wide text-muted uppercase",
						children: "Materials still needed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: snap.materials.slice(0, 6).map((m) => {
							const left = Math.max(0, m.qtyNeeded - m.qtyUsed);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate pr-3",
									children: m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 tabular-nums text-muted",
									children: qty(left, m.unit)
								})]
							}, m.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs tracking-wide text-muted uppercase",
							children: "Crew pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tracking-tight tabular-nums",
							children: money(snap.crewPending)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [snap.workers.length, " people on the books"]
						}),
						snap.photos[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: snap.photos[0].imageUrl,
							alt: snap.photos[0].caption ?? "Latest site photo",
							className: "mt-4 h-32 w-full rounded-lg object-cover outline outline-1 -outline-offset-1 outline-ink/10"
						}) : null
					]
				})]
			})
		]
	});
}
function Stat({ label, value, hint, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 font-display text-2xl tracking-tight tabular-nums", danger && "text-danger"),
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function Materials({ snap, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)();
	const [name, setName] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Cement");
	const [unit, setUnit] = (0, import_react.useState)("bags");
	const [qtyNeeded, setQtyNeeded] = (0, import_react.useState)(0);
	const [ordered, setOrdered] = (0, import_react.useState)(0);
	const [received, setReceived] = (0, import_react.useState)(0);
	const [used, setUsed] = (0, import_react.useState)(0);
	const [unitPrice, setUnitPrice] = (0, import_react.useState)(0);
	const totalNeed = snap.materials.reduce((s, m) => s + m.qtyNeeded * m.unitPrice, 0);
	const totalRecv = snap.materials.reduce((s, m) => s + m.qtyReceived * m.unitPrice, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"BOQ value ",
					money(totalNeed),
					" · received ",
					money(totalRecv)
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setEditId(void 0);
					setName("");
					setOpen(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add item"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-bg-elevated shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs tracking-wide text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Item"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Need"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Ordered"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "In"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Used"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Status"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: snap.materials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "cursor-pointer border-b border-line/70 last:border-0 hover:bg-bg-sunken/50",
					onClick: () => {
						setName(m.name);
						setCategory(m.category);
						setUnit(m.unit);
						setQtyNeeded(m.qtyNeeded);
						setUnitPrice(m.unitPrice);
						setEditId(m.id);
						setOrdered(m.qtyOrdered);
						setReceived(m.qtyReceived);
						setUsed(m.qtyUsed);
						setOpen(true);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [m.category, m.supplierName ? ` · ${m.supplierName}` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: qty(m.qtyNeeded, m.unit)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: qty(m.qtyOrdered)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: qty(m.qtyReceived)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: qty(m.qtyUsed)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-3 tabular-nums",
							children: money(m.unitPrice)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: m.status === "received" ? "ok" : m.status === "partial" ? "warn" : "neutral",
								children: m.status
							})
						})
					]
				}, m.id)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editId ? "Update material" : "Add material" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDesc, { children: "Quantities use the same units as the BOQ. Tap a row to reconcile ordered / received / used." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-3",
					onSubmit: async (e) => {
						e.preventDefault();
						await upsertMaterial({ data: {
							id: editId,
							projectId: snap.project.id,
							name,
							category,
							unit,
							qtyNeeded,
							qtyOrdered: ordered,
							qtyReceived: received,
							qtyUsed: used,
							unitPrice
						} });
						toast.success(editId ? "BOQ updated" : "Added to BOQ");
						setOpen(false);
						setName("");
						setEditId(void 0);
						onChange();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Category",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
									value: category,
									onChange: (e) => setCategory(e.target.value),
									children: MATERIAL_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Unit",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: unit,
									onChange: (e) => setUnit(e.target.value)
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Qty needed",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: qtyNeeded,
										onChange: (e) => setQtyNeeded(Number(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Unit price",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: unitPrice,
										onChange: (e) => setUnitPrice(Number(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Ordered",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: ordered,
										onChange: (e) => setOrdered(Number(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Received",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: received,
										onChange: (e) => setReceived(Number(e.target.value))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Used",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: used,
										onChange: (e) => setUsed(Number(e.target.value))
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "Save item"
						})
					]
				})
			] })
		})
	] });
}
function Crew({ snap, onChange }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [skill, setSkill] = (0, import_react.useState)("Mason");
	const [rate, setRate] = (0, import_react.useState)(900);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Tap present for today. Payouts use days × daily rate."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), "Add worker"]
			})]
		}),
		snap.workers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-6 text-sm text-muted",
			children: "No crew on this site yet. Add a mason or hire from the market."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: snap.workers.map((w) => {
				const days = snap.attendance.filter((a) => a.workerId === w.id && a.present).length;
				const paid = snap.payouts.filter((p) => p.workerId === w.id).reduce((s, p) => s + p.amount, 0);
				const pending = Math.max(0, days * w.dailyRate - paid);
				const today = snap.attendance.find((a) => a.workerId === w.id && a.workDate === todayISO());
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: w.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									w.skill,
									" · ",
									money(w.dailyRate),
									"/day"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: today?.present ? "ok" : "neutral",
								children: today?.present ? "On site" : "Not marked"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm tabular-nums",
							children: [
								days,
								" days · pending ",
								money(pending)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: today?.present ? "secondary" : "outline",
								onClick: async () => {
									await markAttendance({ data: {
										projectId: snap.project.id,
										workerId: w.id,
										present: !today?.present,
										method: "manual"
									} });
									onChange();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), today?.present ? "Undo today" : "Mark present"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: pending <= 0,
								onClick: async () => {
									await payWorker({ data: {
										projectId: snap.project.id,
										workerId: w.id,
										amount: pending,
										periodLabel: "Attendance to date"
									} });
									toast.success(`Paid ${w.name}`);
									onChange();
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4" }),
									"Pay ",
									money(pending)
								]
							})]
						})
					]
				}, w.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add worker" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					await addWorker({ data: {
						projectId: snap.project.id,
						name,
						skill,
						dailyRate: rate
					} });
					setOpen(false);
					setName("");
					onChange();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Skill",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: skill,
							onChange: (e) => setSkill(e.target.value),
							children: SKILLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Daily rate (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: rate,
							onChange: (e) => setRate(Number(e.target.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Add to crew"
					})
				]
			})] })
		})
	] });
}
function Bills({ snap, onChange }) {
	const [vendor, setVendor] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)(0);
	const [category, setCategory] = (0, import_react.useState)("materials");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [notes, setNotes] = (0, import_react.useState)("");
	const [ocrBusy, setOcrBusy] = (0, import_react.useState)(false);
	async function onFile(file) {
		setOcrBusy(true);
		try {
			const dataUrl = await compressImage(file);
			const parsed = await parseBillOcr({ data: { imageDataUrl: dataUrl } });
			if (parsed.ok) {
				setVendor(parsed.vendor);
				setAmount(parsed.amount);
				if (parsed.date) setDate(parsed.date);
				setCategory(parsed.category);
				setNotes(parsed.notes);
				toast.success("Bill fields filled from the photo");
			} else toast.error(parsed.error);
		} finally {
			setOcrBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: snap.bills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6 text-sm text-muted",
				children: "No bills yet. Photograph a receipt or enter one by hand."
			}) : snap.bills.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-start justify-between gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: b.vendor
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						formatDate(b.billDate),
						" · ",
						b.category,
						b.notes ? ` · ${b.notes}` : ""
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium tabular-nums",
						children: money(b.amount)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-1 text-xs text-forest",
						onClick: async () => {
							await toggleBillPaid({ data: {
								projectId: snap.project.id,
								billId: b.id,
								paid: !b.paid
							} });
							onChange();
						},
						children: b.paid ? "Paid" : "Mark paid"
					})]
				})]
			}, b.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-fit p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "Log a bill"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					await addBill({ data: {
						projectId: snap.project.id,
						vendor,
						amount,
						billDate: date,
						category,
						notes: notes || void 0
					} });
					toast.success("Bill logged");
					setVendor("");
					setAmount(0);
					setNotes("");
					onChange();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Photo (OCR)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "file",
							accept: "image/*",
							disabled: ocrBusy,
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) onFile(f);
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Vendor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: vendor,
							onChange: (e) => setVendor(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: amount,
								onChange: (e) => setAmount(Number(e.target.value))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: BILL_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: ocrBusy,
						children: ocrBusy ? "Reading bill…" : "Save bill"
					})
				]
			})]
		})]
	});
}
function Schedule({ snap, onChange }) {
	const [advice, setAdvice] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const span = Math.max(1, daysBetween(snap.project.startDate, snap.project.targetDate));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							const res = await optimizeSchedule({ data: { projectId: snap.project.id } });
							setAdvice(res.ok ? res.text : res.error);
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "Reading risks…" : "AI schedule check"
				})
			}),
			advice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "whitespace-pre-wrap p-4 text-sm",
				children: advice
			}) : null,
			snap.phases.map((p) => {
				const left = Math.max(0, daysBetween(snap.project.startDate, p.startDate));
				const width = Math.max(8, daysBetween(p.startDate, p.endDate) / span * 100);
				const offset = left / span * 100;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									formatShort(p.startDate),
									" – ",
									formatShort(p.endDate),
									" · ",
									money(p.estimatedCost)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: p.status === "done" ? "ok" : p.status === "active" ? "forest" : "neutral",
								children: p.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-grid-dense mt-3 h-8 overflow-hidden rounded-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-md bg-forest/80",
								style: {
									width: `${width}%`,
									marginLeft: `${offset}%`
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 flex items-center gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-16 text-muted",
									children: "Progress"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 100,
									defaultValue: p.progress,
									className: "flex-1 accent-forest",
									onMouseUp: async (e) => {
										const value = Number(e.target.value);
										await updatePhase({ data: {
											projectId: snap.project.id,
											phaseId: p.id,
											progress: value
										} });
										onChange();
									},
									onTouchEnd: async (e) => {
										const value = Number(e.target.value);
										await updatePhase({ data: {
											projectId: snap.project.id,
											phaseId: p.id,
											progress: value
										} });
										onChange();
									}
								}, `${p.id}-${p.progress}`),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10 text-right tabular-nums",
									children: pct(p.progress)
								})
							]
						})
					]
				}, p.id);
			})
		]
	});
}
function Photos({ snap, onChange }) {
	const [caption, setCaption] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-4 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: "Log progress"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 grid gap-3 sm:grid-cols-[1fr_auto]",
			onSubmit: async (e) => {
				e.preventDefault();
				const file = e.currentTarget.elements.namedItem("photo")?.files?.[0];
				if (!file) {
					toast.error("Choose a photo");
					return;
				}
				setBusy(true);
				try {
					const imageUrl = await compressImage(file);
					const note = await annotatePhoto({ data: { caption } });
					await addPhoto({ data: {
						projectId: snap.project.id,
						caption: caption || void 0,
						imageUrl,
						annotation: note.text
					} });
					setCaption("");
					onChange();
				} finally {
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Photo",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						name: "photo",
						accept: "image/*",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Caption",
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						placeholder: "East wall plaster, first floor"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: busy,
					className: "sm:col-start-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), busy ? "Logging…" : "Save photo"]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: snap.photos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "overflow-hidden rounded-xl bg-bg-elevated shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: p.imageUrl,
				alt: p.caption ?? "Site photo",
				className: "h-48 w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: p.caption || "Untitled"
					}),
					p.annotation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: p.annotation
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-faint",
						children: formatDate(p.createdAt.slice(0, 10))
					})
				]
			})]
		}, p.id))
	})] });
}
function Money({ snap, onChange }) {
	const [payee, setPayee] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)(0);
	const [category, setCategory] = (0, import_react.useState)("other");
	const chart = (0, import_react.useMemo)(() => {
		const byCat = {};
		for (const b of snap.bills.filter((x) => x.paid)) byCat[b.category] = (byCat[b.category] ?? 0) + b.amount;
		for (const p of snap.payments) byCat[p.category] = (byCat[p.category] ?? 0) + p.amount;
		return Object.entries(byCat).map(([name, value]) => ({
			name,
			value: Math.round(value)
		}));
	}, [snap]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Envelope"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: async () => {
							const report = await exportProjectReport({ data: snap.project.id });
							const blob = new Blob([report.text], { type: "text/plain" });
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = report.filename;
							a.click();
							URL.revokeObjectURL(url);
						},
						children: "Export GST ledger"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-3xl tracking-tight tabular-nums",
					children: money(snap.project.budget)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: Math.min(100, snap.spent / Math.max(1, snap.project.budget) * 100),
					className: "mt-3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Spent ", money(snap.spent)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: snap.remaining < 0 ? "text-danger" : "",
						children: ["Left ", money(snap.remaining)]
					})]
				}),
				chart.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-48",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chart,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "rgba(26,25,22,0.08)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => money(v) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: "#1f5c4d",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Pay a bill to see the split."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Record a payment"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-3 space-y-3",
					onSubmit: async (e) => {
						e.preventDefault();
						await addPayment({ data: {
							projectId: snap.project.id,
							payee,
							amount,
							method: "upi",
							category,
							paidAt: todayISO()
						} });
						setPayee("");
						setAmount(0);
						onChange();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Payee",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: payee,
								onChange: (e) => setPayee(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: amount,
								onChange: (e) => setAmount(Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: category,
								onChange: (e) => setCategory(e.target.value),
								children: BILL_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: "Save payment"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: snap.payments.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.payee }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: money(p.amount)
						})]
					}, p.id))
				})
			]
		})]
	});
}
function Team({ snap, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Quotes and hires sit on this site."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/market",
						search: {},
						children: "Find professionals"
					})
				})]
			}),
			snap.hires.length === 0 && snap.quotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6 text-sm text-muted",
				children: "No one hired yet. Browse the market and request a quote."
			}) : null,
			snap.hires.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: h.professionalName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						h.role,
						" · hired ",
						formatDate(h.hiredAt)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "ok",
					children: h.status
				})]
			}, h.id)),
			snap.quotes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex items-center justify-between gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: q.professionalName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [q.status, q.amount ? ` · ${money(q.amount)}` : ""]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: q.status }), q.status !== "accepted" && snap.access === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: async () => {
							await hireProfessional({ data: {
								projectId: snap.project.id,
								professionalId: q.professionalId
							} });
							toast.success("Hired");
							onChange();
						},
						children: "Accept & hire"
					}) : null]
				})]
			}, q.id)),
			snap.orders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs tracking-wide text-muted uppercase",
				children: "Material orders"
			}), snap.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-2 flex justify-between p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					o.itemName,
					" × ",
					qty(o.qty)
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: money(o.qty * o.unitPrice)
				})]
			}, o.id))] }) : null
		]
	});
}
function Changes({ snap, onChange }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [detail, setDetail] = (0, import_react.useState)("");
	const [cost, setCost] = (0, import_react.useState)(0);
	const [days, setDays] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr_0.85fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: snap.changeOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6 text-sm text-muted",
				children: "No scope changes yet. Log extras before they eat the envelope."
			}) : snap.changeOrders.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: c.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							money(c.costDelta),
							" · ",
							c.daysDelta,
							" days",
							c.detail ? ` · ${c.detail}` : ""
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: c.status === "approved" ? "ok" : c.status === "rejected" ? "danger" : "warn",
						children: c.status
					})]
				}), c.status === "proposed" && snap.access === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: async () => {
							await decideChangeOrder({ data: {
								projectId: snap.project.id,
								id: c.id,
								status: "approved"
							} });
							onChange();
						},
						children: "Approve"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: async () => {
							await decideChangeOrder({ data: {
								projectId: snap.project.id,
								id: c.id,
								status: "rejected"
							} });
							onChange();
						},
						children: "Reject"
					})]
				}) : null]
			}, c.id))
		}), snap.access === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-fit p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "Propose a change"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					await addChangeOrder({ data: {
						projectId: snap.project.id,
						title,
						detail: detail || void 0,
						costDelta: cost,
						daysDelta: days
					} });
					setTitle("");
					setDetail("");
					toast.success("Change order logged");
					onChange();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Detail",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: detail,
							onChange: (e) => setDetail(e.target.value),
							rows: 3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Cost delta (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: cost,
								onChange: (e) => setCost(Number(e.target.value))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Days delta",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: days,
								onChange: (e) => setDays(Number(e.target.value))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Save change order"
					})
				]
			})]
		}) : null]
	});
}
function DailyLogs({ snap, onChange }) {
	const [weather, setWeather] = (0, import_react.useState)("Clear");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [issues, setIssues] = (0, import_react.useState)("");
	const present = snap.attendance.filter((a) => a.workDate === todayISO() && a.present).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr_0.85fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: snap.dailyLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6 text-sm text-muted",
				children: "No daily logs. Crew can write weather, headcount and issues here."
			}) : snap.dailyLogs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							formatDate(l.logDate),
							" · ",
							l.weather,
							" · ",
							l.workersCount,
							" on site"
						]
					}),
					l.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: l.notes
					}) : null,
					l.issues ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-warn",
						children: l.issues
					}) : null
				]
			}, l.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-fit p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "Today's log"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					await addDailyLog({ data: {
						projectId: snap.project.id,
						logDate: todayISO(),
						weather,
						workersCount: present,
						notes: notes || void 0,
						issues: issues || void 0
					} });
					setNotes("");
					setIssues("");
					toast.success("Log saved");
					onChange();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Weather",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: weather,
							onChange: (e) => setWeather(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Clear" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Cloudy" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rain" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Heat" })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [present, " marked present today — used as headcount."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value),
							rows: 3
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Issues",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: issues,
							onChange: (e) => setIssues(e.target.value),
							rows: 2
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						children: "Save today"
					})
				]
			})]
		})]
	});
}
function Chat({ snap, onChange }) {
	const [body, setBody] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: snap.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "No messages. Leave a note for the crew or yourself."
		}) : snap.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-bg-elevated px-4 py-3 shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					m.authorName,
					" · ",
					formatDate(m.createdAt.slice(0, 10))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm",
				children: m.body
			})]
		}, m.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-4 flex gap-2",
		onSubmit: async (e) => {
			e.preventDefault();
			if (!body.trim()) return;
			await addMessage({ data: {
				projectId: snap.project.id,
				body
			} });
			setBody("");
			onChange();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: body,
			onChange: (e) => setBody(e.target.value),
			placeholder: "Site note…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			children: "Send"
		})]
	})] });
}
function compressImage(file) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const scale = Math.min(1, 960 / img.width);
			canvas.width = Math.max(1, Math.round(img.width * scale));
			canvas.height = Math.max(1, Math.round(img.height * scale));
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(/* @__PURE__ */ new Error("No canvas"));
				return;
			}
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .62));
		};
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image"));
		img.src = url;
	});
}
//#endregion
export { ProjectPage as component };
