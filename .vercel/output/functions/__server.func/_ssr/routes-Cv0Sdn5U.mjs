import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useCurrentUserState, t as Logo } from "./logo-BUcnDYg2.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-BMSobqg9.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { T as ArrowRight, h as Layers, n as Wallet, s as ShieldCheck, x as ClipboardList, y as Eye } from "../_libs/lucide-react.mjs";
import { i as money } from "./format-sbvqgmOQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cv0Sdn5U.js
var import_jsx_runtime = require_jsx_runtime();
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-11 w-24 animate-pulse rounded-md bg-bg-sunken" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app",
			children: "Open workspace"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "ghost",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				children: "Sign in"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				children: "Start a project"
			})
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line/70 bg-bg/85 px-4 backdrop-blur-md md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden items-center gap-6 text-sm text-muted md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#how",
								className: "hover:text-ink",
								children: "How it works"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#twin",
								className: "hover:text-ink",
								children: "Digital twin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#market",
								className: "hover:text-ink",
								children: "Marketplace"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/hero-site.svg",
						alt: "Residential house under construction at golden hour",
						className: "absolute inset-0 size-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/25" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-end md:px-8 md:py-24",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-cream",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-[0.18em] text-cream/70 uppercase",
									children: "Construction OS · India first"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-4 font-display text-4xl leading-[1.05] font-medium tracking-tight text-balance md:text-6xl",
									children: "Build the house. See every brick."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-md text-base text-cream/80 md:text-lg",
									children: "Most homes overrun by 15–25%. Nirmaan is the digital twin of your site — materials, bills, crew and schedule — so homeowners are never the last to know."
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
												children: ["Create your site book", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											className: "bg-cream text-ink hover:bg-bg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/app",
												children: ["Continue to projects", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											variant: "outline",
											className: "border-cream/30 bg-transparent text-cream hover:bg-cream/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#twin",
												children: "See the twin"
											})
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardPreview, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-line bg-bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8",
					children: [
						{
							k: "15–25%",
							v: "Typical overrun Nirmaan is built to cut"
						},
						{
							k: "8 phases",
							v: "From site prep to handover, templated"
						},
						{
							k: "Live BOQ",
							v: "Needed, ordered, received, used"
						},
						{
							k: "Crew wages",
							v: "Attendance in, payout out"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tracking-tight md:text-3xl",
						children: s.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: s.v
					})] }, s.k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "how",
				className: "bg-grid mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-forest uppercase",
						children: "Four moves"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 max-w-xl font-display text-3xl tracking-tight md:text-5xl",
						children: "A site book a non-engineer can actually run."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 md:grid-cols-4",
						children: [
							{
								n: "01",
								t: "Plant the project",
								d: "Plot, floors, city, budget. Nirmaan drafts phases, a BOQ and a cash envelope."
							},
							{
								n: "02",
								t: "Hire the circle",
								d: "Verified architects, engineers, contractors and mistry — quote and hire in-app."
							},
							{
								n: "03",
								t: "Log the truth",
								d: "Bills (photo + OCR), attendance, deliveries, photos. Everyone sees the same numbers."
							},
							{
								n: "04",
								t: "Ask the twin",
								d: "“How much cement is left for the first floor?” The assistant answers from your ledger."
							}
						].map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-card)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-faint",
									children: step.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-display text-xl tracking-tight",
									children: step.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: step.d
								})
							]
						}, step.n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "twin",
				className: "bg-forest text-cream",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.18em] text-cream/60 uppercase",
							children: "The twin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-3xl tracking-tight md:text-5xl",
							children: "One ledger for stuff, people, and money."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-8 space-y-4 text-sm text-cream/80",
							children: [
								{
									icon: Layers,
									t: "Materials that move",
									d: "Needed / ordered / received / used — with waste factors and local rates."
								},
								{
									icon: Wallet,
									t: "Cash that doesn't vanish",
									d: "Bills, UPI payouts, remaining envelope, overrun flags before the plaster goes up."
								},
								{
									icon: ClipboardList,
									t: "A crew you can pay fairly",
									d: "Daily rates, GPS or tap attendance, pending wages calculated — not argued."
								},
								{
									icon: Eye,
									t: "Photos with a timestamp",
									d: "Progress log with AI notes. “Foundation complete — 85% of planned concrete used.”"
								}
							].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(row.icon, { className: "mt-0.5 size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-cream",
									children: row.t
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row.d })] })]
							}, row.t))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/materials.svg",
							alt: "Cement, steel and bricks in a material yard",
							className: "h-56 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-cream/15 md:h-64"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/finishing.svg",
								alt: "Interior finishing of a home",
								className: "h-40 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-cream/15"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/plans.svg",
								alt: "Floor plan on a desk",
								className: "h-40 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-cream/15"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "market",
				className: "mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.18em] text-forest uppercase",
							children: "Marketplace"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 max-w-lg font-display text-3xl tracking-tight md:text-5xl",
							children: "Verified locals, not a directory dump."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-sm text-muted",
							children: "Architects, civil engineers, contractors, mistry and registered shops — filter by city, rates, and what they actually built."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 md:grid-cols-3",
						children: [
							{
								role: "Architect",
								name: "Meera Rao Studio",
								city: "Bengaluru",
								rate: "₹180–320 / sqft"
							},
							{
								role: "Civil engineer",
								name: "Arjun Structural Lab",
								city: "Bengaluru",
								rate: "₹45k–1.2L / project"
							},
							{
								role: "Contractor",
								name: "Red Earth Builders",
								city: "Bengaluru",
								rate: "₹1,950–2,800 / sqft"
							}
						].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl bg-bg-elevated p-5 shadow-[var(--shadow-card)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs tracking-wide text-forest uppercase",
									children: card.role
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-xl tracking-tight",
									children: card.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: card.city
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 font-medium tabular-nums",
									children: card.rate
								})
							]
						}, card.name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Browse the market"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-line bg-bg-sunken",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-1 size-5 text-forest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight md:text-3xl",
							children: "Start with a sample 3BHK."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-lg text-sm text-muted",
							children: "Sign in, plant a Bengaluru home, and walk a live BOQ, crew sheet and cash envelope — no spreadsheet required."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							children: ["Open Nirmaan", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line px-4 py-8 text-sm text-muted md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Built for the people who pay for the house — and the people who raise it." })]
				})
			})
		]
	});
}
function DashboardPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl bg-bg-elevated p-3 text-ink shadow-[var(--shadow-card)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-bg p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Koramangala 3BHK"
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-2",
					children: [
						{
							n: "Foundation",
							p: 80
						},
						{
							n: "RCC structure",
							p: 45
						},
						{
							n: "Brickwork",
							p: 12
						}
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-28 truncate text-xs text-muted",
								children: p.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 flex-1 overflow-hidden rounded-full bg-bg-sunken",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-ink/80",
									style: { width: `${p.p}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-8 text-right font-mono text-xs tabular-nums",
								children: [p.p, "%"]
							})
						]
					}, p.n))
				})
			]
		})
	});
}
//#endregion
export { Home as component };
