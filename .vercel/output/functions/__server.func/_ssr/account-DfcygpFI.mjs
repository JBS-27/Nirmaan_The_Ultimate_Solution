import { o as __toESM } from "../_runtime.mjs";
import { r as CITIES, s as ROLES } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as useCurrentUser } from "./logo-BUcnDYg2.mjs";
import { i as UserButton } from "./gates-BMSobqg9.mjs";
import { i as saveProfile, t as getMyProfile } from "./profile-B0Lp5z0P.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { n as PageHeader } from "./app-shell-D51N6pSh.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect, t as Field } from "./field-6_OphhBd.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
import { t as Textarea } from "./textarea-CbfET7rk.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-DfcygpFI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Account() {
	const user = useCurrentUser();
	const q = useAsync(() => getMyProfile(), []);
	const p = q.data;
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("owner");
	const [city, setCity] = (0, import_react.useState)("Bengaluru");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [languages, setLanguages] = (0, import_react.useState)("English, Hindi");
	(0, import_react.useEffect)(() => {
		if (!p) return;
		setDisplayName(p.displayName);
		setRole(p.role);
		setCity(p.city ?? "Bengaluru");
		setPhone(p.phone ?? "");
		setBio(p.bio ?? "");
		setLanguages(p.languages);
	}, [p]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Account",
		title: "Your profile",
		description: "Role and city shape marketplace matches. Projects you own stay with this sign-in.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "max-w-lg p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: user?.primaryEmail ?? "Signed in"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				await saveProfile({ data: {
					displayName,
					role,
					city,
					phone: phone || void 0,
					bio: bio || void 0,
					languages
				} });
				toast.success("Profile saved");
				q.reload();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: displayName,
						onChange: (e) => setDisplayName(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Role",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: role,
						onChange: (e) => setRole(e.target.value),
						children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r.id,
							children: r.label
						}, r.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "City",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: city,
						onChange: (e) => setCity(e.target.value),
						children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.name,
							children: c.name
						}, c.name))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Languages",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: languages,
						onChange: (e) => setLanguages(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Bio",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: bio,
						onChange: (e) => setBio(e.target.value),
						rows: 3
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save"
				})
			]
		})]
	})] });
}
//#endregion
export { Account as component };
