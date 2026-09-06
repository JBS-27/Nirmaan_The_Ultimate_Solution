import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { t as Badge } from "./badge-CSCWzACT.mjs";
import { t as Skeleton } from "./skeleton-0mKYnHDu.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect } from "./field-6_OphhBd.mjs";
import { t as Textarea } from "./textarea-CbfET7rk.mjs";
import { t as useAsync } from "./use-async-C1dAHjTM.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as money } from "./format-sbvqgmOQ.mjs";
import { r as listProjects } from "./projects-C8H6aJTU.mjs";
import { r as Route$1 } from "./router-Drx5sfKU.mjs";
import { n as hireProfessional, s as requestQuote, t as getProfessional } from "./market-BgNvSvCG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market._proId-BplKhqtK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProProfile() {
	const { proId } = Route$1.useParams();
	const id = Number(proId);
	const pro = useAsync(() => getProfessional({ data: id }), [id]);
	const projects = useAsync(() => listProjects(), []);
	const [projectId, setProjectId] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("Need a quote for my residential project. Drawings available.");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const p = pro.data;
	if (pro.loading && !p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" });
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Professional not found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "outline",
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/market",
				search: {},
				children: "Back"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-forest uppercase",
				children: p.role
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: p.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-muted",
				children: [
					p.city,
					" · responds in ",
					p.responseHours,
					"h · ",
					p.availability
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					p.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "forest",
						children: "Verified"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [
						p.rating.toFixed(1),
						" · ",
						p.reviews,
						" reviews"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: p.languages })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-xl text-ink-soft",
				children: p.bio
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "Specialisations · "
				}), p.specializations]
			}),
			p.licenses ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "Licences · "
				}), p.licenses]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-display text-3xl tracking-tight tabular-nums",
				children: [
					money(p.rateMin),
					"–",
					money(p.rateMax),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-base text-muted",
						children: [" / ", p.rateUnit]
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-fit p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl tracking-tight",
					children: "Request a quote"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Attach this professional to one of your sites."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: projectId,
							onChange: (e) => setProjectId(e.target.value ? Number(e.target.value) : ""),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select project"
							}), (projects.data ?? []).map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: pr.id,
								children: pr.name
							}, pr.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: message,
							onChange: (e) => setMessage(e.target.value),
							rows: 4
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: !projectId || busy,
							onClick: async () => {
								if (!projectId) return;
								setBusy(true);
								try {
									const res = await requestQuote({ data: {
										projectId: Number(projectId),
										professionalId: p.id,
										message
									} });
									toast.success(`Quote from ${res.name}: ${money(res.amount)}`);
								} catch (err) {
									toast.error(err instanceof Error ? err.message : "Could not request quote");
								} finally {
									setBusy(false);
								}
							},
							children: "Request quote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-full",
							disabled: !projectId || busy,
							onClick: async () => {
								if (!projectId) return;
								setBusy(true);
								try {
									await hireProfessional({ data: {
										projectId: Number(projectId),
										professionalId: p.id
									} });
									toast.success(`Hired ${p.name}`);
								} finally {
									setBusy(false);
								}
							},
							children: "Hire directly"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ProProfile as component };
