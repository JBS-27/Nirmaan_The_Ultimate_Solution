import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-BIdimLhj.js
var import_jsx_runtime = require_jsx_runtime();
function TabBar({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex gap-1 overflow-x-auto rounded-lg bg-bg-sunken p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className),
		...props
	});
}
function Tab({ active, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors", active ? "bg-bg-elevated text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink", className),
		...props
	});
}
//#endregion
export { TabBar as n, Tab as t };
