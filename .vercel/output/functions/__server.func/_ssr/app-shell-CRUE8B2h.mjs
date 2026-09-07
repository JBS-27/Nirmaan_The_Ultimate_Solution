import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
import { i as UserButton, t as RedirectToSignIn } from "./gates-CKpEmF9M.mjs";
import { n as listNotifications, r as markNotificationsRead, t as getMyProfile } from "./profile-CJlM7wT9.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Logo } from "./logo-BiCS6cfI.mjs";
import { t as Badge } from "./badge-CSCWzACT.mjs";
import { t as Skeleton } from "./skeleton-0mKYnHDu.mjs";
import { _ as House, d as MessageSquare, i as UserRound, l as Plus, o as Store, v as Hammer, w as Bell } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CRUE8B2h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/app",
		label: "Home",
		icon: House,
		primary: false
	},
	{
		to: "/app/market",
		label: "Market",
		icon: Store,
		primary: false
	},
	{
		to: "/app/new",
		label: "New",
		icon: Plus,
		primary: true
	},
	{
		to: "/app/assistant",
		label: "Assistant",
		icon: MessageSquare,
		primary: false
	},
	{
		to: "/app/account",
		label: "You",
		icon: UserRound,
		primary: false
	}
];
function AppShell() {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [onboarded, setOnboarded] = (0, import_react.useState)(null);
	const [role, setRole] = (0, import_react.useState)("owner");
	const [unread, setUnread] = (0, import_react.useState)(0);
	const [openNotes, setOpenNotes] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyProfile().then((p) => {
			setOnboarded(p.onboarded);
			setRole(p.role);
		}).catch(() => setOnboarded(false));
		listNotifications().then((n) => {
			setNotes(n);
			setUnread(n.filter((x) => !x.read).length);
		}).catch(() => void 0);
	}, [user, pathname]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-14 items-center justify-between border-b border-line px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-8 rounded-full" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" })
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, { to: "/login" });
	if (onboarded === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex h-14 items-center justify-between border-b border-line px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-32" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-8 rounded-full" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" })
		})]
	});
	if (!onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/onboarding" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "ml-6 hidden items-center gap-1 md:flex",
						children: [role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/admin",
							className: cn("rounded-md px-3 py-2 text-sm font-medium", pathname === "/app/admin" ? "bg-bg-sunken text-ink" : "text-muted hover:text-ink"),
							children: "Admin"
						}) : null, NAV.filter((n) => n.to !== "/app/new").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							search: {},
							className: cn("rounded-md px-3 py-2 text-sm font-medium", pathname === item.to || item.to !== "/app" && pathname.startsWith(item.to) ? "bg-bg-sunken text-ink" : "text-muted hover:text-ink"),
							children: item.label
						}, item.to))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								className: "hidden md:inline-flex",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/app/new",
									search: {},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "size-4" }), "New project"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									className: "relative",
									onClick: async () => {
										setOpenNotes((v) => !v);
										if (!openNotes) {
											const n = await listNotifications().catch(() => []);
											setNotes(n);
											setUnread(n.filter((x) => !x.read).length);
										}
									},
									"aria-label": "Notifications",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2 right-2 size-1.5 rounded-full bg-forest" }) : null]
								}), openNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-12 right-0 z-40 w-80 rounded-xl bg-bg-elevated p-2 shadow-[var(--shadow-card)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between px-2 py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: "Alerts"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs text-muted",
											onClick: async () => {
												await markNotificationsRead();
												setUnread(0);
											},
											children: "Mark read"
										})]
									}), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-2 py-6 text-center text-sm text-muted",
										children: "Quiet site — no alerts yet."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "max-h-80 overflow-auto",
										children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "rounded-md px-2 py-2 hover:bg-bg-sunken",
											children: n.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: n.href,
												onClick: () => setOpenNotes(false),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium",
													children: n.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted",
													children: n.body
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: n.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted",
												children: n.body
											})] })
										}, n.id))
									})]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 pt-6 pb-24 md:pb-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden",
				children: NAV.map((item) => {
					const Icon = item.icon;
					const active = pathname === item.to || item.to !== "/app" && pathname.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						search: {},
						className: cn("flex flex-col items-center gap-1 py-2 text-[11px] font-medium", item.primary ? "text-forest" : active ? "text-ink" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex size-10 items-center justify-center rounded-full", item.primary && "bg-forest text-cream", !item.primary && active && "bg-bg-sunken"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						}), item.label]
					}, item.to);
				})
			})
		]
	});
}
function PageHeader({ kicker, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: "forest",
				className: "mb-2",
				children: kicker
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight md:text-4xl",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-muted",
				children: description
			}) : null
		] }), action]
	});
}
//#endregion
export { PageHeader as n, AppShell as t };
