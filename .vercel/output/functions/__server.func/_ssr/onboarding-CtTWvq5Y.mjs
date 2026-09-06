import { o as __toESM } from "../_runtime.mjs";
import { r as CITIES, s as ROLES } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./utils-Dhq_xXK2.mjs";
import { i as useCurrentUserState, t as Logo } from "./logo-BUcnDYg2.mjs";
import { t as RedirectToSignIn } from "./gates-BMSobqg9.mjs";
import { i as saveProfile } from "./profile-B0Lp5z0P.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { n as NativeSelect, t as Field } from "./field-6_OphhBd.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-CtTWvq5Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [role, setRole] = (0, import_react.useState)("owner");
	const [displayName, setDisplayName] = (0, import_react.useState)(user?.displayName ?? "");
	const [city, setCity] = (0, import_react.useState)("Bengaluru");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (isPending) return null;
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await saveProfile({ data: {
				role,
				displayName: displayName.trim() || user?.displayName || "Builder",
				city,
				phone: phone || void 0
			} });
			navigate({ to: "/app" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save profile");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "bg-grid min-h-dvh px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-display text-3xl font-medium tracking-tight",
					children: "How do you show up on site?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "This sets your home screen. You can still create and run projects from any role."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-6",
					onSubmit: submit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
							children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRole(r.id),
								className: cn("rounded-xl border px-4 py-3 text-left transition-colors", role === r.id ? "border-forest bg-forest-soft" : "border-line bg-bg-elevated hover:border-ink/20"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: r.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: r.blurb
								})]
							}, r.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Your name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Home city",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								value: city,
								onChange: (e) => setCity(e.target.value),
								children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.name,
									children: [
										c.name,
										", ",
										c.state
									]
								}, c.name))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone (optional)",
							hint: "Used only for crew payouts and supplier calls.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								inputMode: "tel"
							})
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Saving…" : "Enter Nirmaan"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Onboarding as component };
