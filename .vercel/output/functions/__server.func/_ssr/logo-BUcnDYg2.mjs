import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-BUcnDYg2.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				className: "fill-forest"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 22V12.5L16 8l8 4.5V22",
				className: "stroke-cream",
				strokeWidth: "1.6",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 22v-6h8v6",
				className: "stroke-cream",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 8v4",
				className: "stroke-cream",
				strokeWidth: "1.6"
			})
		]
	});
}
function Logo({ className, wordmark = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), wordmark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-xl font-medium tracking-tight text-ink",
			children: "Nirmaan"
		}) : null]
	});
}
//#endregion
export { useCurrentUserState as i, LogoMark as n, useCurrentUser as r, Logo as t };
