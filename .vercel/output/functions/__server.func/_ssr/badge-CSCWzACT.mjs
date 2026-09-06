import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CSCWzACT.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
			neutral: "bg-bg-sunken text-ink-soft",
			forest: "bg-forest-soft text-forest-deep",
			warn: "bg-[#f3e6c8] text-warn",
			danger: "bg-[#f3d8d4] text-danger",
			ok: "bg-forest-soft text-ok"
		}[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
