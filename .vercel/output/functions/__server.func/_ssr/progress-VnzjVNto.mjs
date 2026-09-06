import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-VnzjVNto.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value, className }) {
	const v = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-bg-sunken", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-forest transition-[width] duration-500 ease-out",
			style: { width: `${v}%` }
		})
	});
}
//#endregion
export { Progress as t };
