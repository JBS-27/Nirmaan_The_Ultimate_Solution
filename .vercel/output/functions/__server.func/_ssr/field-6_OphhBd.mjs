import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/field-6_OphhBd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Label = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-sm font-medium text-ink-soft", className),
	...props
}));
Label.displayName = "Label";
function Field({ label, hint, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("flex flex-col gap-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-faint",
				children: hint
			}) : null
		]
	});
}
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-11 w-full rounded-md border border-line bg-bg-elevated px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40", className),
		...props
	});
}
//#endregion
export { NativeSelect as n, Field as t };
