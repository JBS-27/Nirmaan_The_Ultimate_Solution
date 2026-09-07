import { a as PHASE_TEMPLATES } from "./constants-ReRsv3ys.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-CKpEmF9M.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { T as ArrowRight, h as Layers, n as Wallet, x as ClipboardList, y as Eye } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { a as pct, i as money } from "./format-sbvqgmOQ.mjs";
import { r as listProjects } from "./projects-CUAJZCc9.mjs";
import { t as Progress } from "./progress-VnzjVNto.mjs";
import { n as PublicHeader, t as PublicFooter } from "./public-header-CwwwxEA3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/twin-B6na0Bqr.js
var import_jsx_runtime = require_jsx_runtime();
function TwinPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicHeader, { active: "twin" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "bg-forest text-cream",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto grid max-w-6xl items-end gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.18em] text-cream/60 uppercase",
								children: "Digital twin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-display text-4xl font-medium tracking-tight md:text-6xl",
								children: "One ledger for stuff, people, and money."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-md text-cream/80",
								children: "Plant a project and Nirmaan drafts eight phases, a live BOQ and a cash envelope. The twin is the site book — not a slide."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "bg-cream text-ink hover:bg-bg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/login",
											search: { redirect: "/app/new" },
											children: ["Create your site book", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										})
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										className: "bg-cream text-ink hover:bg-bg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/app",
											children: ["Open your sites", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										})
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										variant: "outline",
										className: "border-cream/30 bg-transparent text-cream hover:bg-cream/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/marketplace",
											children: "Browse the market"
										})
									})
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveOrSample, {})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.18em] text-forest uppercase",
							children: "Eight phases"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 max-w-xl font-display text-3xl tracking-tight md:text-5xl",
							children: "Site prep to handover, templated for India."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-10 grid gap-3 md:grid-cols-2",
							children: PHASE_TEMPLATES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-4 rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-card)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-faint",
									children: String(i + 1).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl tracking-tight",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted",
									children: [
										"About ",
										Math.round(p.costShare * 100),
										"% of envelope · ",
										Math.round(p.timeShare * 100),
										"% of the calendar"
									]
								})] })]
							}, p.key))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-y border-line bg-bg-sunken",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8",
						children: [
							{
								icon: Layers,
								t: "Materials that move",
								d: "Needed / ordered / received / used — with waste factors and local rates."
							},
							{
								icon: Wallet,
								t: "Cash that doesn't vanish",
								d: "Bills, UPI payouts, remaining envelope, overrun flags before plaster."
							},
							{
								icon: ClipboardList,
								t: "A crew you can pay fairly",
								d: "Daily rates, tap attendance, pending wages calculated — not argued."
							},
							{
								icon: Eye,
								t: "Ask the twin",
								d: "“How much cement is left for the first floor?” answered from your ledger."
							}
						].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(row.icon, { className: "mt-0.5 size-4 shrink-0 text-forest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: row.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: row.d
							})] })]
						}, row.t))
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
function LiveOrSample() {
	const { user, isPending } = useCurrentUserState();
	if (isPending || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleTwin, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveTwin, {});
}
function LiveTwin() {
	const projects = useAsync(() => listProjects(), []);
	const p = projects.data?.[0];
	if (projects.loading && !p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleTwin, {});
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SampleTwin, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "bg-bg-elevated p-3 text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-bg p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: p.city
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tracking-tight",
						children: p.name
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-forest-soft px-2.5 py-1 text-xs font-medium text-forest-deep",
						children: pct(p.progress)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: p.progress,
					className: "mt-4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Spent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium tabular-nums",
						children: money(p.spent)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Envelope"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium tabular-nums",
						children: money(p.budget)
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/projects/$projectId",
						params: { projectId: String(p.id) },
						search: {},
						children: "Open this twin"
					})
				})
			]
		})
	});
}
function SampleTwin() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "bg-bg-elevated p-3 text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-bg p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Sample · Koramangala 3BHK"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tracking-tight",
						children: "42% complete"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-forest-soft px-2.5 py-1 text-xs font-medium text-forest-deep",
						children: "On watch"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-1.5 overflow-hidden rounded-full bg-bg-sunken",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[42%] rounded-full bg-forest" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-3 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Spent"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium tabular-nums",
							children: money(186e4)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Envelope"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium tabular-nums",
							children: money(42e5)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Cement left"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium tabular-nums",
							children: "186 bags"
						})] })
					]
				})
			]
		})
	});
}
//#endregion
export { TwinPage as component };
