import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { o as isUnauthorized } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-async-C1dAHjTM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAsync(fn, deps = []) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [tick, setTick] = (0, import_react.useState)(0);
	const reload = (0, import_react.useCallback)(() => setTick((t) => t + 1), []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		setError(null);
		fn().then((value) => {
			if (!cancelled) setData(value);
		}).catch((err) => {
			if (cancelled) return;
			if (isUnauthorized(err)) {
				setError("Unauthorized");
				return;
			}
			setError(err instanceof Error ? err.message : "Something went wrong");
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [tick, ...deps]);
	return {
		data,
		loading,
		error,
		reload,
		setData
	};
}
//#endregion
export { useAsync as t };
