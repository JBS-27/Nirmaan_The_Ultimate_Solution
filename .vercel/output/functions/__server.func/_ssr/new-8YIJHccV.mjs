import { o as __toESM } from "../_runtime.mjs";
import { o as PROJECT_TYPES, r as CITIES } from "./constants-ReRsv3ys.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as todayISO, t as addDays } from "./utils-Dhq_xXK2.mjs";
import { t as Button } from "./button-BJUb9JTF.mjs";
import { n as PageHeader } from "./app-shell-CRUE8B2h.mjs";
import { t as Card } from "./card-BlHSO0wt.mjs";
import { n as NativeSelect, t as Field } from "./field-6_OphhBd.mjs";
import { t as Input } from "./input-DFIKWVAF.mjs";
import { t as Textarea } from "./textarea-CbfET7rk.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as money } from "./format-sbvqgmOQ.mjs";
import { i as previewEstimate, t as createProject } from "./projects-CUAJZCc9.mjs";
import { i as Route$3 } from "./router-B2rdV4PY.mjs";
import { r as extractPlanQuantities } from "./ai-6z1P--NT.mjs";
import { n as estimateRooms } from "./estimator-DvUi7E1M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-8YIJHccV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewProject() {
	const { sample } = Route$3.useSearch();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)(sample ? "Koramangala 3BHK" : "");
	const [city, setCity] = (0, import_react.useState)("Bengaluru");
	const [address, setAddress] = (0, import_react.useState)(sample ? "4th Block, Koramangala" : "");
	const [projectType, setProjectType] = (0, import_react.useState)("new_build");
	const [plotSqft, setPlotSqft] = (0, import_react.useState)(sample ? 2400 : 1200);
	const [floors, setFloors] = (0, import_react.useState)(sample ? 2 : 2);
	const [budget, setBudget] = (0, import_react.useState)(sample ? 42e5 : 25e5);
	const [startDate, setStartDate] = (0, import_react.useState)(todayISO());
	const [targetDate, setTargetDate] = (0, import_react.useState)(addDays(todayISO(), 270));
	const [requirements, setRequirements] = (0, import_react.useState)(sample ? "3 BHK independent house, vastu-aware, covered parking, terrace waterproofing." : "");
	const [est, setEst] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [rooms, setRooms] = (0, import_react.useState)([{
		name: "Living",
		lengthFt: 14,
		widthFt: 12,
		heightFt: 10
	}]);
	const [planBusy, setPlanBusy] = (0, import_react.useState)(false);
	const roomExtras = (0, import_react.useMemo)(() => estimateRooms(rooms, city), [rooms, city]);
	const payload = (0, import_react.useMemo)(() => ({
		type: projectType,
		plotSqft,
		floors,
		city,
		startDate,
		targetDate,
		budget
	}), [
		projectType,
		plotSqft,
		floors,
		city,
		startDate,
		targetDate,
		budget
	]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		previewEstimate({ data: payload }).then((e) => {
			if (!cancelled) setEst(e);
		}).catch(() => void 0);
		return () => {
			cancelled = true;
		};
	}, [payload]);
	async function submit(asSample = Boolean(sample)) {
		setBusy(true);
		try {
			const res = await createProject({ data: {
				name: name || "Untitled home",
				city,
				address: address || void 0,
				projectType,
				plotSqft,
				floors,
				budget,
				startDate,
				targetDate,
				requirements: requirements || void 0,
				sample: asSample,
				rooms: rooms.filter((r) => r.lengthFt > 0 && r.widthFt > 0)
			} });
			toast.success("Project planted — BOQ and phases are ready.");
			navigate({
				to: "/app/projects/$projectId",
				params: { projectId: String(res.id) },
				search: {}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create project");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "New site",
		title: "Plant a project",
		description: "Tell Nirmaan the plot and the envelope. It will draft eight phases and a local bill of quantities."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit: (e) => {
				e.preventDefault();
				submit(false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Project name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Whitefield duplex",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "City",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: city,
							onChange: (e) => setCity(e.target.value),
							children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.name,
								children: c.name
							}, c.name))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: projectType,
							onChange: (e) => setProjectType(e.target.value),
							children: PROJECT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: t.id,
								children: t.label
							}, t.id))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Site address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: address,
						onChange: (e) => setAddress(e.target.value),
						placeholder: "Street, area"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Plot (sqft)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 200,
								value: plotSqft,
								onChange: (e) => setPlotSqft(Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Floors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								max: 8,
								value: floors,
								onChange: (e) => setFloors(Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Budget (₹)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1e5,
								step: 5e4,
								value: budget,
								onChange: (e) => setBudget(Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: startDate,
								onChange: (e) => setStartDate(e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Target handover",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: targetDate,
						onChange: (e) => setTargetDate(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "What are you building?",
					hint: "Rooms, parking, vastu, rental floors — anything the estimator should respect.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: requirements,
						onChange: (e) => setRequirements(e.target.value),
						rows: 4
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Room dimensions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Adds tile and paint lines to the BOQ. Upload a plan to extract rooms."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Plan photo",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "file",
								accept: "image/*",
								disabled: planBusy,
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									setPlanBusy(true);
									try {
										const dataUrl = await fileToDataUrl(file);
										const parsed = await extractPlanQuantities({ data: {
											imageDataUrl: dataUrl,
											city
										} });
										if (parsed.ok && parsed.rooms.length) {
											setRooms(parsed.rooms);
											toast.success("Rooms read from the plan");
										} else toast.error(parsed.ok ? "No rooms found" : parsed.error);
									} finally {
										setPlanBusy(false);
									}
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-2",
							children: rooms.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 md:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: r.name,
										onChange: (e) => setRooms((prev) => prev.map((x, idx) => idx === i ? {
											...x,
											name: e.target.value
										} : x))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: r.lengthFt,
										onChange: (e) => setRooms((prev) => prev.map((x, idx) => idx === i ? {
											...x,
											lengthFt: Number(e.target.value)
										} : x))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: r.widthFt,
										onChange: (e) => setRooms((prev) => prev.map((x, idx) => idx === i ? {
											...x,
											widthFt: Number(e.target.value)
										} : x))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: r.heightFt ?? 10,
										onChange: (e) => setRooms((prev) => prev.map((x, idx) => idx === i ? {
											...x,
											heightFt: Number(e.target.value)
										} : x))
									})
								]
							}, `${r.name}-${i}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							className: "mt-3",
							onClick: () => setRooms((prev) => [...prev, {
								name: "Room",
								lengthFt: 10,
								widthFt: 10,
								heightFt: 10
							}]),
							children: "Add room"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: [
								roomExtras.floorSqft,
								" sqft floor · extra tiles ",
								roomExtras.extras[0]?.qtyNeeded,
								" sqft"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Planting…" : "Create project"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy,
						onClick: () => void submit(true),
						children: "Create with sample site log"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "h-fit p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted uppercase",
				children: "Live estimate"
			}), est ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl tracking-tight tabular-nums",
					children: money(est.estimatedCost)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						est.builtUpSqft.toLocaleString("en-IN"),
						" sqft built-up · ",
						money(est.costPerSqft),
						" / sqft in ",
						est.city
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-2",
					children: est.phases.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ink-soft",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: money(p.estimatedCost)
						})]
					}, p.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xs text-muted",
					children: est.notes[0]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Adjust the plot to see quantities."
			})]
		})]
	})] });
}
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read file"));
		reader.readAsDataURL(file);
	});
}
//#endregion
export { NewProject as component };
