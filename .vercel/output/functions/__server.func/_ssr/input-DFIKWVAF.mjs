import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-DFIKWVAF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = (0, import_react.forwardRef)(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	ref,
	className: cn("flex h-11 w-full rounded-md border border-line bg-bg-elevated px-3 text-sm text-ink shadow-[0_0_0_1px_rgba(26,25,22,0.02)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40 disabled:opacity-50", className),
	...props
}));
Input.displayName = "Input";
//#endregion
export { Input as t };
