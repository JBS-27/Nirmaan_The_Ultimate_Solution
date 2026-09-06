//#region node_modules/.nitro/vite/services/ssr/assets/constants-ReRsv3ys.js
var APP_NAME = "Nirmaan";
var ROLES = [
	{
		id: "owner",
		label: "Homeowner",
		blurb: "Build or renovate a home with full visibility."
	},
	{
		id: "architect",
		label: "Architect",
		blurb: "Design, drawings, and site coordination."
	},
	{
		id: "engineer",
		label: "Civil engineer",
		blurb: "Structure, soil, and quality checks."
	},
	{
		id: "contractor",
		label: "Contractor",
		blurb: "Run the site, crew, and subcontractors."
	},
	{
		id: "worker",
		label: "Skilled worker",
		blurb: "Mason, carpenter, electrician, and more."
	},
	{
		id: "supplier",
		label: "Material supplier",
		blurb: "Cement, steel, bricks, and finishes."
	},
	{
		id: "admin",
		label: "Platform admin",
		blurb: "Verification, marketplace, and site health."
	}
];
var PROJECT_TYPES = [
	{
		id: "new_build",
		label: "New build"
	},
	{
		id: "renovation",
		label: "Renovation"
	},
	{
		id: "extension",
		label: "Extension"
	}
];
var SKILLS = [
	"Mason",
	"Helper",
	"Carpenter",
	"Electrician",
	"Plumber",
	"Painter",
	"Tiler",
	"Welder",
	"Bar bender",
	"Supervisor"
];
var MATERIAL_CATEGORIES = [
	"Cement",
	"Steel",
	"Masonry",
	"Aggregates",
	"Wood",
	"Plumbing",
	"Electrical",
	"Finishing",
	"Roofing",
	"Other"
];
var BILL_CATEGORIES = [
	"materials",
	"labor",
	"professional",
	"equipment",
	"permits",
	"transport",
	"other"
];
var CITIES = [
	{
		name: "Bengaluru",
		state: "Karnataka",
		lat: 12.9716,
		lng: 77.5946,
		index: 1.08
	},
	{
		name: "Mumbai",
		state: "Maharashtra",
		lat: 19.076,
		lng: 72.8777,
		index: 1.22
	},
	{
		name: "Delhi NCR",
		state: "Delhi",
		lat: 28.6139,
		lng: 77.209,
		index: 1.14
	},
	{
		name: "Hyderabad",
		state: "Telangana",
		lat: 17.385,
		lng: 78.4867,
		index: 1.02
	},
	{
		name: "Pune",
		state: "Maharashtra",
		lat: 18.5204,
		lng: 73.8567,
		index: 1.06
	},
	{
		name: "Chennai",
		state: "Tamil Nadu",
		lat: 13.0827,
		lng: 80.2707,
		index: 1.04
	},
	{
		name: "Ahmedabad",
		state: "Gujarat",
		lat: 23.0225,
		lng: 72.5714,
		index: .96
	},
	{
		name: "Kolkata",
		state: "West Bengal",
		lat: 22.5726,
		lng: 88.3639,
		index: .94
	},
	{
		name: "Jaipur",
		state: "Rajasthan",
		lat: 26.9124,
		lng: 75.7873,
		index: .9
	},
	{
		name: "Kochi",
		state: "Kerala",
		lat: 9.9312,
		lng: 76.2673,
		index: 1
	}
];
function findCity(name) {
	return CITIES.find((c) => c.name === name) ?? CITIES[0];
}
var PHASE_TEMPLATES = [
	{
		key: "site",
		name: "Site prep & approvals",
		costShare: .06,
		timeShare: .08
	},
	{
		key: "foundation",
		name: "Foundation",
		costShare: .14,
		timeShare: .12
	},
	{
		key: "structure",
		name: "RCC structure",
		costShare: .22,
		timeShare: .18
	},
	{
		key: "masonry",
		name: "Brickwork & masonry",
		costShare: .12,
		timeShare: .14
	},
	{
		key: "roofing",
		name: "Roofing",
		costShare: .08,
		timeShare: .08
	},
	{
		key: "mep",
		name: "Plumbing & electrical",
		costShare: .1,
		timeShare: .12
	},
	{
		key: "finishing",
		name: "Finishing",
		costShare: .21,
		timeShare: .22
	},
	{
		key: "handover",
		name: "Snagging & handover",
		costShare: .07,
		timeShare: .06
	}
];
//#endregion
export { PHASE_TEMPLATES as a, SKILLS as c, MATERIAL_CATEGORIES as i, findCity as l, BILL_CATEGORIES as n, PROJECT_TYPES as o, CITIES as r, ROLES as s, APP_NAME as t };
