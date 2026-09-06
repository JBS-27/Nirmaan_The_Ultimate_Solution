export type CatalogPro = {
  role: string;
  name: string;
  city: string;
  specializations: string;
  rateMin: number;
  rateMax: number;
  rateUnit: string;
  rating: number;
  reviews: number;
  bio: string;
  licenses: string;
  languages: string;
  responseHours: number;
  availability: string;
};

export type CatalogSupplier = {
  name: string;
  city: string;
  categories: string;
  rating: number;
  reviews: number;
  deliveryDays: number;
  phone: string;
  address: string;
  products: { name: string; category: string; unit: string; price: number; stock: string }[];
};

export const CATALOG_PROS: CatalogPro[] = [
  {
    role: "architect",
    name: "Meera Rao Studio",
    city: "Bengaluru",
    specializations: "Residential, climate-responsive, compact plots",
    rateMin: 180, rateMax: 320, rateUnit: "sqft",
    rating: 4.9, reviews: 48,
    bio: "Fourteen years designing courtyard homes that stay cool without glass boxes. Known for tight BOQs and contractor-ready drawings.",
    licenses: "COA CA/2012/21440",
    languages: "English, Kannada, Hindi",
    responseHours: 4, availability: "Available",
  },
  {
    role: "engineer",
    name: "Arjun Structural Lab",
    city: "Bengaluru",
    specializations: "RCC, soil reports, 2–4 storey homes",
    rateMin: 45000, rateMax: 120000, rateUnit: "project",
    rating: 4.8, reviews: 61,
    bio: "Ex-L&T engineer. Will not sign a slab without a mix design and cube tests. Popular with first-time builders.",
    licenses: "IEI M-154203",
    languages: "English, Kannada, Tamil",
    responseHours: 6, availability: "Available",
  },
  {
    role: "contractor",
    name: "Red Earth Builders",
    city: "Bengaluru",
    specializations: "Turnkey 2–3 BHK, villa, labour + material",
    rateMin: 1950, rateMax: 2800, rateUnit: "sqft",
    rating: 4.6, reviews: 112,
    bio: "Runs three crews. Weekly photo logs, material reconciliation, and no-cash-on-Sunday payroll.",
    licenses: "BBMP Class II 4412",
    languages: "Kannada, Hindi, English",
    responseHours: 3, availability: "Booking Q4",
  },
  {
    role: "worker",
    name: "Nagesh (head mason)",
    city: "Bengaluru",
    specializations: "Masonry, plaster, waterproofing",
    rateMin: 1100, rateMax: 1400, rateUnit: "day",
    rating: 4.7, reviews: 39,
    bio: "Leads a 6-person gang. Straight walls, honest measurements, shows up at 8.",
    licenses: "Skill India — Masonry",
    languages: "Kannada, Hindi",
    responseHours: 8, availability: "Available next week",
  },
  {
    role: "architect",
    name: "Harbour Line Atelier",
    city: "Mumbai",
    specializations: "Apartments, coastal, redevelopment",
    rateMin: 220, rateMax: 400, rateUnit: "sqft",
    rating: 4.8, reviews: 33,
    bio: "Specialists in 600–1200 sqft city homes. MHADA and society liaison included.",
    licenses: "COA CA/2009/11880",
    languages: "English, Marathi, Hindi",
    responseHours: 5, availability: "Available",
  },
  {
    role: "engineer",
    name: "Qureshi & Co. Consulting",
    city: "Mumbai",
    specializations: "High-rise, marine piles, rehab",
    rateMin: 80000, rateMax: 250000, rateUnit: "project",
    rating: 4.9, reviews: 27,
    bio: "Peer-review structural drawings before you pour. Known for catching under-designed transfer beams.",
    licenses: "PE Maharashtra",
    languages: "English, Hindi, Urdu",
    responseHours: 7, availability: "Limited",
  },
  {
    role: "contractor",
    name: "Konkan Contract Works",
    city: "Mumbai",
    specializations: "Interior gut-renovation, wet areas",
    rateMin: 1600, rateMax: 2400, rateUnit: "sqft",
    rating: 4.5, reviews: 86,
    bio: "Society-friendly crews that work 10–6. Waterproofing warranty of 7 years on baths.",
    licenses: "MCGM registered",
    languages: "Marathi, Hindi, English",
    responseHours: 4, availability: "Available",
  },
  {
    role: "architect",
    name: "Neem Courtyard",
    city: "Jaipur",
    specializations: "Lime plaster, jaali, courtyard houses",
    rateMin: 140, rateMax: 260, rateUnit: "sqft",
    rating: 4.9, reviews: 22,
    bio: "Builds with lime, sandstone, and shade. Lower operational cost than glass-and-AC villas.",
    licenses: "COA CA/2016/33102",
    languages: "Hindi, English",
    responseHours: 6, availability: "Available",
  },
  {
    role: "engineer",
    name: "Deccan Geotech",
    city: "Hyderabad",
    specializations: "Soil investigation, retaining, black cotton",
    rateMin: 35000, rateMax: 90000, rateUnit: "project",
    rating: 4.7, reviews: 44,
    bio: "Bore logs within 5 days. Will tell you honestly if a basement is a bad idea.",
    licenses: "NABL soil lab partner",
    languages: "Telugu, English, Hindi",
    responseHours: 5, availability: "Available",
  },
  {
    role: "contractor",
    name: "Cauvery Siteworks",
    city: "Chennai",
    specializations: "Independent houses, cyclone detailing",
    rateMin: 1850, rateMax: 2500, rateUnit: "sqft",
    rating: 4.6, reviews: 70,
    bio: "Coastal detailing done right — corrosion-resistant steel, proper cover, no shortcuts on curing.",
    licenses: "GCC registered",
    languages: "Tamil, English",
    responseHours: 5, availability: "Available",
  },
  {
    role: "worker",
    name: "Rafiq electrician crew",
    city: "Delhi NCR",
    specializations: "Concealed wiring, solar-ready DBs",
    rateMin: 1000, rateMax: 1350, rateUnit: "day",
    rating: 4.8, reviews: 51,
    bio: "Three-person crew. Labels every circuit. Brings their own Megger.",
    licenses: "ITI Electrician, CEA supervisor",
    languages: "Hindi, English",
    responseHours: 6, availability: "Available",
  },
  {
    role: "contractor",
    name: "Sahyadri Turnkey",
    city: "Pune",
    specializations: "Row houses, bungalows, PMC approvals",
    rateMin: 1900, rateMax: 2700, rateUnit: "sqft",
    rating: 4.7, reviews: 93,
    bio: "Fixed-price contracts with a 5% contingency cap. Material invoices shared weekly.",
    licenses: "PMC Class I",
    languages: "Marathi, English, Hindi",
    responseHours: 4, availability: "Available",
  },
];

export const CATALOG_SUPPLIERS: CatalogSupplier[] = [
  {
    name: "Annapurna Cement Depot",
    city: "Bengaluru",
    categories: "Cement, Waterproofing",
    rating: 4.7, reviews: 210, deliveryDays: 1,
    phone: "+91 80 4120 1188",
    address: "Mysore Road, Nayandahalli",
    products: [
      { name: "UltraTech OPC 53", category: "Cement", unit: "bag", price: 392, stock: "In stock" },
      { name: "Ramco Supergrade", category: "Cement", unit: "bag", price: 384, stock: "In stock" },
      { name: "Dr. Fixit Pidiproof LW+", category: "Waterproofing", unit: "L", price: 210, stock: "In stock" },
    ],
  },
  {
    name: "Steel Mart Jayanagar",
    city: "Bengaluru",
    categories: "Steel",
    rating: 4.6, reviews: 156, deliveryDays: 2,
    phone: "+91 80 2656 4401",
    address: "9th Block, Jayanagar",
    products: [
      { name: "JSW Neosteel Fe500D 12mm", category: "Steel", unit: "kg", price: 64, stock: "In stock" },
      { name: "JSW Neosteel Fe500D 8mm", category: "Steel", unit: "kg", price: 63, stock: "In stock" },
      { name: "Binding wire", category: "Steel", unit: "kg", price: 72, stock: "In stock" },
    ],
  },
  {
    name: "Red Block Bricks",
    city: "Bengaluru",
    categories: "Masonry",
    rating: 4.4, reviews: 88, deliveryDays: 2,
    phone: "+91 98450 22110",
    address: "Anekal Road, Jigani",
    products: [
      { name: "Table-moulded red bricks", category: "Masonry", unit: "pcs", price: 8.5, stock: "In stock" },
      { name: "Solid concrete blocks 6\"", category: "Masonry", unit: "pcs", price: 38, stock: "In stock" },
      { name: "AAC blocks 6\"", category: "Masonry", unit: "pcs", price: 72, stock: "Low stock" },
    ],
  },
  {
    name: "Konkan Sand & Aggregate",
    city: "Mumbai",
    categories: "Aggregates",
    rating: 4.5, reviews: 132, deliveryDays: 1,
    phone: "+91 22 2501 9000",
    address: "Panvel yard",
    products: [
      { name: "Washed river sand", category: "Aggregates", unit: "ton", price: 3200, stock: "In stock" },
      { name: "20mm blue metal", category: "Aggregates", unit: "ton", price: 1780, stock: "In stock" },
      { name: "M-sand", category: "Aggregates", unit: "ton", price: 2100, stock: "In stock" },
    ],
  },
  {
    name: "Lotus Tiles & Sanitary",
    city: "Delhi NCR",
    categories: "Finishing, Plumbing",
    rating: 4.8, reviews: 301, deliveryDays: 3,
    phone: "+91 11 4055 2211",
    address: "Kirti Nagar, New Delhi",
    products: [
      { name: "Kajaria 600×600 vitrified", category: "Finishing", unit: "sqft", price: 62, stock: "In stock" },
      { name: "Jaquar basin mixer", category: "Plumbing", unit: "pcs", price: 4200, stock: "In stock" },
      { name: "Cera wall-hung WC", category: "Plumbing", unit: "pcs", price: 7800, stock: "In stock" },
    ],
  },
  {
    name: "Deccan Electricals",
    city: "Hyderabad",
    categories: "Electrical",
    rating: 4.6, reviews: 97, deliveryDays: 2,
    phone: "+91 40 2784 1190",
    address: "Punjagutta",
    products: [
      { name: "Havells 1.5 sqmm wire (90m)", category: "Electrical", unit: "coil", price: 2450, stock: "In stock" },
      { name: "Legrand 8-way DB", category: "Electrical", unit: "pcs", price: 3200, stock: "In stock" },
      { name: "Syska LED downlight 12W", category: "Electrical", unit: "pcs", price: 280, stock: "In stock" },
    ],
  },
  {
    name: "Cauvery Woods",
    city: "Chennai",
    categories: "Wood",
    rating: 4.5, reviews: 64, deliveryDays: 4,
    phone: "+91 44 2498 3300",
    address: "Poonamallee High Road",
    products: [
      { name: "Teak door shutter 7×3", category: "Wood", unit: "pcs", price: 18500, stock: "Made to order" },
      { name: "Flush door 32mm", category: "Wood", unit: "pcs", price: 4200, stock: "In stock" },
      { name: "Sal wood frame cft", category: "Wood", unit: "cft", price: 1650, stock: "In stock" },
    ],
  },
  {
    name: "Sahyadri Paints",
    city: "Pune",
    categories: "Finishing",
    rating: 4.7, reviews: 140, deliveryDays: 1,
    phone: "+91 20 2567 4411",
    address: "FC Road",
    products: [
      { name: "Asian Royale Matt", category: "Finishing", unit: "L", price: 720, stock: "In stock" },
      { name: "Birla wall putty 40kg", category: "Finishing", unit: "bag", price: 580, stock: "In stock" },
      { name: "Primer interior 20L", category: "Finishing", unit: "drum", price: 2100, stock: "In stock" },
    ],
  },
  {
    name: "Pink City Stone",
    city: "Jaipur",
    categories: "Finishing, Masonry",
    rating: 4.8, reviews: 55, deliveryDays: 7,
    phone: "+91 141 256 0090",
    address: "Vidhyadhar Nagar",
    products: [
      { name: "Dholpur cladding", category: "Finishing", unit: "sqft", price: 95, stock: "In stock" },
      { name: "Kota stone 2ft", category: "Finishing", unit: "sqft", price: 38, stock: "In stock" },
      { name: "Sandstone copings", category: "Masonry", unit: "rft", price: 120, stock: "In stock" },
    ],
  },
  {
    name: "Backwater Plumbing Co.",
    city: "Kochi",
    categories: "Plumbing",
    rating: 4.6, reviews: 73, deliveryDays: 2,
    phone: "+91 484 238 1100",
    address: "MG Road",
    products: [
      { name: "Ashirvad 110mm PVC", category: "Plumbing", unit: "length", price: 640, stock: "In stock" },
      { name: "Astral CPVC 3/4\"", category: "Plumbing", unit: "length", price: 290, stock: "In stock" },
      { name: "Sintex 1000L loft tank", category: "Plumbing", unit: "pcs", price: 7200, stock: "In stock" },
    ],
  },
];
