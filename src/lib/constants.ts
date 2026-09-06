export const APP_NAME = "Nirmaan";
export const APP_TAGLINE = "The digital twin of your construction site.";

export const ROLES = [
  { id: "owner", label: "Homeowner", blurb: "Build or renovate a home with full visibility." },
  { id: "architect", label: "Architect", blurb: "Design, drawings, and site coordination." },
  { id: "engineer", label: "Civil engineer", blurb: "Structure, soil, and quality checks." },
  { id: "contractor", label: "Contractor", blurb: "Run the site, crew, and subcontractors." },
  { id: "worker", label: "Skilled worker", blurb: "Mason, carpenter, electrician, and more." },
  { id: "supplier", label: "Material supplier", blurb: "Cement, steel, bricks, and finishes." },
  { id: "admin", label: "Platform admin", blurb: "Verification, marketplace, and site health." },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export const PROJECT_TYPES = [
  { id: "new_build", label: "New build" },
  { id: "renovation", label: "Renovation" },
  { id: "extension", label: "Extension" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["id"];

export const SKILLS = [
  "Mason",
  "Helper",
  "Carpenter",
  "Electrician",
  "Plumber",
  "Painter",
  "Tiler",
  "Welder",
  "Bar bender",
  "Supervisor",
] as const;

export const MATERIAL_CATEGORIES = [
  "Cement",
  "Steel",
  "Masonry",
  "Aggregates",
  "Wood",
  "Plumbing",
  "Electrical",
  "Finishing",
  "Roofing",
  "Other",
] as const;

export const BILL_CATEGORIES = [
  "materials",
  "labor",
  "professional",
  "equipment",
  "permits",
  "transport",
  "other",
] as const;

export const CITIES = [
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, index: 1.08 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777, index: 1.22 },
  { name: "Delhi NCR", state: "Delhi", lat: 28.6139, lng: 77.209, index: 1.14 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, index: 1.02 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, index: 1.06 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, index: 1.04 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, index: 0.96 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, index: 0.94 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, index: 0.9 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673, index: 1.0 },
] as const;

export function findCity(name: string) {
  return CITIES.find((c) => c.name === name) ?? CITIES[0];
}

export const PHASE_TEMPLATES = [
  { key: "site", name: "Site prep & approvals", costShare: 0.06, timeShare: 0.08 },
  { key: "foundation", name: "Foundation", costShare: 0.14, timeShare: 0.12 },
  { key: "structure", name: "RCC structure", costShare: 0.22, timeShare: 0.18 },
  { key: "masonry", name: "Brickwork & masonry", costShare: 0.12, timeShare: 0.14 },
  { key: "roofing", name: "Roofing", costShare: 0.08, timeShare: 0.08 },
  { key: "mep", name: "Plumbing & electrical", costShare: 0.1, timeShare: 0.12 },
  { key: "finishing", name: "Finishing", costShare: 0.21, timeShare: 0.22 },
  { key: "handover", name: "Snagging & handover", costShare: 0.07, timeShare: 0.06 },
] as const;
