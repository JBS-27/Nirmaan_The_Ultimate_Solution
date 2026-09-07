import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useCurrentUserState } from "./use-current-user-DG6UNzh9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CbsSoAl8.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardAlias() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return null;
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		search: { redirect: "/app" }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
}
//#endregion
export { DashboardAlias as component };
