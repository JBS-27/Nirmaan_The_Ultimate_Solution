import { a as PHASE_TEMPLATES, l as findCity } from "./constants-ReRsv3ys.mjs";
import { a as daysBetween, t as addDays } from "./utils-Dhq_xXK2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/estimator-DvUi7E1M.js
var COST_PSF = {
	new_build: 2200,
	renovation: 1450,
	extension: 1850
};
var RATES = {
	cementBag: 390,
	steelKg: 64,
	brick: 9,
	sandTon: 2800,
	aggregateTon: 1650,
	waterproofSqft: 28,
	electricalSqft: 95,
	plumbingSqft: 80,
	tileSqft: 85,
	paintSqft: 22,
	door: 14500,
	windowSqft: 420,
	roofSheetSqft: 55
};
function builtUp(input) {
	const coverage = input.type === "renovation" ? .85 : .7;
	const area = Math.round(input.plotSqft * coverage * Math.max(1, input.floors));
	return Math.max(400, area);
}
function estimateProject(input) {
	const city = findCity(input.city);
	const bu = builtUp(input);
	const typeMul = input.type === "renovation" ? .72 : input.type === "extension" ? .88 : 1;
	const costPsf = Math.round(COST_PSF[input.type] * city.index);
	const estimatedCost = Math.round(bu * costPsf);
	const budget = input.budget && input.budget > 0 ? input.budget : estimatedCost;
	const waste = .07;
	const start = input.startDate;
	const end = input.targetDate;
	const span = Math.max(90, daysBetween(start, end));
	let cursor = 0;
	const phases = PHASE_TEMPLATES.map((p) => {
		const dur = Math.max(7, Math.round(span * p.timeShare));
		const s = addDays(start, cursor);
		const e = addDays(s, dur);
		cursor += dur;
		return {
			key: p.key,
			name: p.name,
			startDate: s,
			endDate: e,
			estimatedCost: Math.round(budget * p.costShare)
		};
	});
	const bags = Math.ceil(bu * .4 * 1.07 * typeMul);
	const steel = Math.ceil(bu * 4.2 * 1.07 * typeMul);
	const bricks = Math.ceil(bu * 8.5 * 1.07 * typeMul);
	const sand = Number((bu * .045 * 1.07 * typeMul).toFixed(1));
	const agg = Number((bu * .07 * 1.07 * typeMul).toFixed(1));
	const doors = Math.max(6, Math.round(bu / 220));
	const windowArea = Math.round(bu * .12);
	const materials = [
		{
			name: "OPC 53 cement",
			category: "Cement",
			unit: "bags",
			qtyNeeded: bags,
			unitPrice: RATES.cementBag * city.index,
			phaseKey: "structure"
		},
		{
			name: "TMT Fe500D bars",
			category: "Steel",
			unit: "kg",
			qtyNeeded: steel,
			unitPrice: RATES.steelKg * city.index,
			phaseKey: "structure"
		},
		{
			name: "Red clay bricks",
			category: "Masonry",
			unit: "pcs",
			qtyNeeded: bricks,
			unitPrice: RATES.brick * city.index,
			phaseKey: "masonry"
		},
		{
			name: "River sand",
			category: "Aggregates",
			unit: "ton",
			qtyNeeded: sand,
			unitPrice: RATES.sandTon * city.index,
			phaseKey: "foundation"
		},
		{
			name: "20mm aggregate",
			category: "Aggregates",
			unit: "ton",
			qtyNeeded: agg,
			unitPrice: RATES.aggregateTon * city.index,
			phaseKey: "foundation"
		},
		{
			name: "Waterproofing compound",
			category: "Roofing",
			unit: "sqft",
			qtyNeeded: Math.round(bu / Math.max(1, input.floors)),
			unitPrice: RATES.waterproofSqft * city.index,
			phaseKey: "roofing"
		},
		{
			name: "Electrical package",
			category: "Electrical",
			unit: "sqft",
			qtyNeeded: bu,
			unitPrice: RATES.electricalSqft * city.index,
			phaseKey: "mep"
		},
		{
			name: "Plumbing package",
			category: "Plumbing",
			unit: "sqft",
			qtyNeeded: bu,
			unitPrice: RATES.plumbingSqft * city.index,
			phaseKey: "mep"
		},
		{
			name: "Vitrified floor tiles",
			category: "Finishing",
			unit: "sqft",
			qtyNeeded: Math.round(bu * .85),
			unitPrice: RATES.tileSqft * city.index,
			phaseKey: "finishing"
		},
		{
			name: "Interior emulsion paint",
			category: "Finishing",
			unit: "sqft",
			qtyNeeded: Math.round(bu * 2.6),
			unitPrice: RATES.paintSqft * city.index,
			phaseKey: "finishing"
		},
		{
			name: "Flush / teak doors",
			category: "Wood",
			unit: "pcs",
			qtyNeeded: doors,
			unitPrice: RATES.door * city.index,
			phaseKey: "finishing"
		},
		{
			name: "UPVC windows",
			category: "Finishing",
			unit: "sqft",
			qtyNeeded: windowArea,
			unitPrice: RATES.windowSqft * city.index,
			phaseKey: "finishing"
		}
	].map((m) => ({
		...m,
		unitPrice: Math.round(m.unitPrice * 100) / 100
	}));
	if (input.type !== "renovation") materials.push({
		name: "Roof weathering course",
		category: "Roofing",
		unit: "sqft",
		qtyNeeded: Math.round(input.plotSqft * .7),
		unitPrice: Math.round(RATES.roofSheetSqft * city.index),
		phaseKey: "roofing"
	});
	const notes = [
		`Built-up used for quantities: ${bu.toLocaleString("en-IN")} sqft (${input.floors} floor${input.floors > 1 ? "s" : ""}, ${city.name} index ${city.index}).`,
		`Waste factor ${Math.round(waste * 100)}% applied on bulk materials.`,
		`Local rates are 2026 metro averages — lock quotes from verified suppliers before pouring.`,
		budget < estimatedCost * .85 ? "Entered budget is lean versus local cost — finishing specs will need to be value-engineered." : "Budget is in a workable band for a standard residential spec."
	];
	return {
		city: city.name,
		builtUpSqft: bu,
		costPerSqft: costPsf,
		estimatedCost,
		suggestedBudget: estimatedCost,
		wasteFactor: waste,
		phases,
		materials,
		laborDailyBurn: Math.round(7600 * city.index),
		notes
	};
}
function estimateRooms(rooms, city) {
	const loc = findCity(city);
	const usable = rooms.filter((r) => r.lengthFt > 0 && r.widthFt > 0);
	const floor = usable.reduce((s, r) => s + r.lengthFt * r.widthFt, 0);
	const wall = usable.reduce((s, r) => {
		const h = r.heightFt && r.heightFt > 0 ? r.heightFt : 10;
		return s + 2 * (r.lengthFt + r.widthFt) * h;
	}, 0);
	const waste = 1.08;
	return {
		floorSqft: Math.round(floor),
		wallSqft: Math.round(wall),
		extras: [{
			name: "Room tiles (from dimensions)",
			category: "Finishing",
			unit: "sqft",
			qtyNeeded: Math.round(floor * waste),
			unitPrice: Math.round(RATES.tileSqft * loc.index),
			phaseKey: "finishing"
		}, {
			name: "Room emulsion (from dimensions)",
			category: "Finishing",
			unit: "sqft",
			qtyNeeded: Math.round(wall * waste),
			unitPrice: Math.round(RATES.paintSqft * loc.index),
			phaseKey: "finishing"
		}]
	};
}
//#endregion
export { estimateRooms as n, estimateProject as t };
