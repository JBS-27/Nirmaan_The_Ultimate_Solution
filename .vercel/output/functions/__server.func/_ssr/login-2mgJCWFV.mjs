import { o as __toESM } from "../_runtime.mjs";
import { t as APP_NAME } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
import { i as useCurrentUserState, n as LogoMark, t as Logo } from "./logo-BUcnDYg2.mjs";
import { t as GROK_PROVIDERS } from "./server-DiEiNQkV.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Skeleton } from "./skeleton-0mKYnHDu.mjs";
import { T as ArrowRight, b as EyeOff, i as UserRound, m as Lock, p as Mail, s as ShieldCheck, y as Eye } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
import { i as money } from "./format-sbvqgmOQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-2mgJCWFV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	async function onEmail(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || email.split("@")[0]
				});
				if (res.error) throw new Error(res.error.message || "Could not create account");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message || "Could not sign in");
			}
			window.location.href = "/app";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "bg-grid min-h-dvh lg:grid lg:grid-cols-[1.15fr_0.85fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative flex flex-col px-4 py-6 sm:px-8 lg:px-12 lg:py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-flex lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "ml-auto hidden text-sm text-muted hover:text-ink lg:inline-flex",
					children: "Back to site"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-2xl p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-[0.18em] text-forest uppercase",
							children: mode === "in" ? "Returning builder" : "New site book"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl",
							children: mode === "in" ? "Welcome back" : "Open your ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: mode === "in" ? "Sign in to the sites, crew and cash you already run." : `${APP_NAME} is for homeowners and the people who raise the house.`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 rounded-lg bg-bg p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setMode("in");
									setError(null);
								},
								className: cn("h-10 rounded-md text-sm font-medium transition-colors", mode === "in" ? "bg-bg-elevated text-ink shadow-[var(--shadow-card)]" : "text-muted"),
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setMode("up");
									setError(null);
								},
								className: cn("h-10 rounded-md text-sm font-medium transition-colors", mode === "up" ? "bg-bg-elevated text-ink shadow-[var(--shadow-card)]" : "text-muted"),
								children: "Create account"
							})]
						}),
						isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2",
									children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										className: "h-12 w-full justify-between bg-bg px-4",
										onClick: () => signIn(p.providerId, { callbackURL: "/app" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderMark, { idp: p.idp }),
												"Continue with ",
												p.label
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-faint" })]
									}, p.providerId))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 py-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] tracking-[0.16em] text-faint uppercase",
											children: "or with email"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "space-y-3",
									onSubmit: onEmail,
									children: [
										mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium",
												children: "Full name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: name,
													onChange: (e) => setName(e.target.value),
													autoComplete: "name",
													placeholder: "Meera Rao",
													className: "bg-bg pl-10"
												})]
											})]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-medium",
												children: "Work email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "email",
													required: true,
													value: email,
													onChange: (e) => setEmail(e.target.value),
													autoComplete: "email",
													placeholder: "you@studio.in",
													className: "bg-bg pl-10"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex flex-col gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center justify-between text-sm font-medium",
												children: ["Password", mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-normal text-faint",
													children: "8 characters minimum"
												}) : null]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: showPassword ? "text" : "password",
														required: true,
														minLength: 8,
														value: password,
														onChange: (e) => setPassword(e.target.value),
														autoComplete: mode === "up" ? "new-password" : "current-password",
														placeholder: mode === "up" ? "Create a password" : "Your password",
														className: "bg-bg pr-11 pl-10"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-bg-sunken hover:text-ink",
														onClick: () => setShowPassword((v) => !v),
														"aria-label": showPassword ? "Hide password" : "Show password",
														children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
													})
												]
											})]
										}),
										error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "rounded-md bg-danger/10 px-3 py-2 text-sm text-danger",
											role: "alert",
											children: error
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											className: "mt-1 h-12 w-full",
											disabled: busy,
											children: [busy ? "Please wait…" : mode === "in" ? "Sign in to workspace" : "Create site book", !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" }) : null]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-8 flex items-start gap-2 border-t border-line pt-5 text-xs text-faint",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-3.5 shrink-0 text-forest" }), "Session stays on this device. Projects you create are scoped to your sign-in — not shared with the marketplace until you hire someone."]
						})
					]
				})
			})]
		})]
	});
}
function BrandPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative hidden overflow-hidden bg-ink lg:flex lg:min-h-dvh lg:flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/hero-site.svg",
				alt: "",
				className: "absolute inset-0 size-full object-cover opacity-55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-ink via-ink/70 to-forest-deep/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-1 flex-col p-10 xl:p-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-medium tracking-tight text-cream",
							children: "Nirmaan"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 max-w-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.2em] text-cream/50 uppercase",
								children: "Construction OS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-display text-4xl leading-[1.08] font-medium tracking-tight text-balance text-cream xl:text-5xl",
								children: "Know what the site spent before the contractor tells you."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-md text-sm leading-relaxed text-cream/70",
								children: "One ledger for materials, bills, crew and schedule — so a first-time homeowner is never the last to know."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 max-w-md rounded-2xl bg-cream/10 p-2 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-bg-elevated p-5 text-ink",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] tracking-[0.16em] text-muted uppercase",
										children: "Koramangala 3BHK"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-display text-2xl tracking-tight",
										children: "42% complete"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-forest-soft px-2.5 py-1 text-[11px] font-medium text-forest-deep",
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
											className: "text-[11px] text-muted",
											children: "Spent"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium tabular-nums",
											children: money(186e4)
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted",
											children: "Envelope"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium tabular-nums",
											children: money(42e5)
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted",
											children: "Cement left"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium tabular-nums",
											children: "186 bags"
										})] })
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-auto grid grid-cols-3 gap-6 pt-12 text-cream",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] tracking-[0.14em] text-cream/45 uppercase",
								children: "Overrun cut"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-display text-2xl tracking-tight",
								children: "15–25%"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] tracking-[0.14em] text-cream/45 uppercase",
								children: "Phases"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-display text-2xl tracking-tight",
								children: "8"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] tracking-[0.14em] text-cream/45 uppercase",
								children: "Cities"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-display text-2xl tracking-tight",
								children: "10"
							})] })
						]
					})
				]
			})
		]
	});
}
function LoginSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-md" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-md" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] tracking-[0.16em] text-faint uppercase",
						children: "checking session"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-11 w-full rounded-md" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-11 w-full rounded-md" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-md" })
		]
	});
}
function ProviderMark({ idp }) {
	if (idp === "google") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
				opacity: "0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
				opacity: "0.75"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z",
				opacity: "0.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
				opacity: "0.45"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M14.23 3h3.18l-6.96 7.95L18.5 21h-3.4l-4.7-6.15L5.6 21H2.4l7.44-8.5L2 3h3.5l4.25 5.64L14.23 3Zm-1.12 16.2h1.76L7.02 4.7H5.14l7.97 14.5Z"
		})
	});
}
//#endregion
export { Login as component };
