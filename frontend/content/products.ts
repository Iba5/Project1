/**
 * Product catalogue data, static seed.
 */

/** Category names now come from the backend's admin-managed catalogue categories. */
export type ProductCategory = string;

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductReview = {
  author: string;
  role: string;
  rating: number;
  date: string;
  body: string;
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription?: string;
  image: string;
  /** Up to 5 additional photos shown alongside the display image in quick view. */
  images?: string[];
  placeholder?: boolean;
  featured?: boolean;
  /** Bullet-point key features shown in quick view */
  features?: string[];
  /** Structured spec table shown in quick view */
  specs?: ProductSpec[];
  /** Minimum order quantity hint */
  minOrder?: string;
  /** Delivery lead-time hint */
  leadTime?: string;
  /** Average customer rating, 0–5 (one decimal) */
  rating?: number;
  /** Number of customer reviews */
  reviewCount?: number;
  /** Long-form customer reviews shown in quick view */
  reviews?: ProductReview[];
};

/**
 * Helper to render star rating markup consistently.
 * Returns an array of 5 booleans: true = full star.
 */
export function starSlots(rating: number): boolean[] {
  const r = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => i < r);
}

export const productCategories: ProductCategory[] = [
  "Tools & Hardware",
  "Fabrication",
  "PPE",
  "Stationery",
  "Ice Blocks",
];

export const seedProducts: Product[] = [
  {
    slug: "tools-and-hardware",
    name: "Tools & Hardware",
    category: "Tools & Hardware",
    shortDescription:
      "Hand tools, power tools, fasteners and builders' hardware for tradespeople, contractors and home users.",
    longDescription:
      "A dependable range of hand tools, power tools, fasteners and builders' hardware, sourced from trusted manufacturers. Stocked for tradespeople, contractors, retail hardware stores and household projects. Bulk orders and recurring supply for sites are welcome.",
    image: "/products/tools-and-hardware.png",
    placeholder: false,
    featured: true,
    features: [
      "Hand tools: hammers, screwdrivers, spanners, pliers, saws",
      "Power tools: drills, grinders, circular saws, rotary hammers",
      "Fasteners: nails, screws, bolts, anchors, rivets",
      "Builders' hardware: hinges, locks, handles, brackets",
      "Bulk site supply & recurring orders welcome",
    ],
    specs: [
      { label: "Categories", value: "Hand tools, Power tools, Fasteners, Hardware" },
      { label: "Brands", value: "Mixed trusted regional brands" },
      { label: "Min order", value: "Single item to full site kit" },
      { label: "Lead time", value: "In-stock items same day, indent 3–7 days" },
    ],
    minOrder: "Single item",
    leadTime: "Same day for stock items",
    rating: 4.7,
    reviewCount: 38,
    reviews: [
      {
        author: "Tendai M.",
        role: "Site Foreman, Marlborough",
        rating: 5,
        date: "2025-08-14",
        body: "Bulk site kit landed same day. Drills and fasteners all good quality, no complaints from the crew.",
      },
      {
        author: "Rumbi K.",
        role: "Hardware store owner, Chitungwiza",
        rating: 4,
        date: "2025-07-02",
        body: "Standing monthly order for nails and screws. Reliable, fair pricing, delivered on time.",
      },
      {
        author: "James P.",
        role: "Home renovator, Borrowdale",
        rating: 5,
        date: "2025-06-18",
        body: "Picked up a circular saw and blades. Staff knew their stuff and helped me pick the right kit.",
      },
    ],
  },
  {
    slug: "fabrication",
    name: "Fabrication",
    category: "Fabrication",
    shortDescription:
      "Mild-steel and stainless fabrication, gates, frames, brackets and custom structural work.",
    longDescription:
      "Custom metal fabrication in mild and stainless steel: gates, window frames, brackets, stairs, railings and structural components. Built to spec from drawings or site measurements, with finishing and delivery available across Harare and Murewa.",
    image: "/products/fabrication.png",
    placeholder: false,
    featured: true,
    features: [
      "Mild steel & stainless steel fabrication",
      "Gates, window frames, burglar bars, brackets",
      "Stairs, railings & structural components",
      "Built to spec from drawings or site measurements",
      "Finishing, treatment & delivery available",
    ],
    specs: [
      { label: "Materials", value: "Mild steel, stainless steel" },
      { label: "Process", value: "Cut, weld, grind, finish, paint" },
      { label: "Min order", value: "Single custom item" },
      { label: "Lead time", value: "3–10 working days by complexity" },
    ],
    minOrder: "Single item",
    leadTime: "3–10 working days",
    rating: 4.8,
    reviewCount: 27,
    reviews: [
      {
        author: "Innocent S.",
        role: "Workshop manager, Msasa",
        rating: 5,
        date: "2025-08-22",
        body: "Custom gate and burglar bars fabricated to spec. Welds were clean, finish was on point.",
      },
      {
        author: "Farai D.",
        role: "Builder, Mt Pleasant",
        rating: 5,
        date: "2025-07-10",
        body: "Staircase railing came out exactly as drawn. Will use them again for the next project.",
      },
      {
        author: "Memory T.",
        role: "Homeowner, Glen Lorne",
        rating: 4,
        date: "2025-05-29",
        body: "Window frames built and installed. Took a few days longer than quoted but quality is solid.",
      },
    ],
  },
  {
    slug: "ppe",
    name: "PPE",
    category: "PPE",
    shortDescription:
      "Personal protective equipment, safety wear, gloves, eyewear, footwear and respiratory protection.",
    longDescription:
      "Personal protective equipment for industrial, construction, food-handling and healthcare settings. Coveralls, high-visibility wear, safety gloves, protective eyewear, safety footwear and respiratory protection. Supplied in case and bulk quantities with ongoing contracts available.",
    image: "/products/ppe.png",
    placeholder: false,
    featured: true,
    features: [
      "Coveralls & high-visibility wear",
      "Safety gloves: cut-resistant, chemical, general purpose",
      "Protective eyewear & face shields",
      "Safety footwear with steel toe caps",
      "Respiratory protection: masks & cartridges",
    ],
    specs: [
      { label: "Standards", value: "Regional safety standards aligned" },
      { label: "Pack sizes", value: "Single, case, bulk pallet" },
      { label: "Contracts", value: "Standing supply orders available" },
      { label: "Lead time", value: "Stock items same day" },
    ],
    minOrder: "Single item",
    leadTime: "Same day for stock items",
    rating: 4.6,
    reviewCount: 41,
    reviews: [
      {
        author: "Chipo N.",
        role: "Safety Officer, Beitbridge",
        rating: 5,
        date: "2025-08-30",
        body: "Case order of coveralls and gloves arrived on time. Quality is consistent across batches.",
      },
      {
        author: "Blessing R.",
        role: "Construction firm buyer, Harare",
        rating: 4,
        date: "2025-07-19",
        body: "Standing supply contract for safety footwear. Solid value, occasional size swap handled quickly.",
      },
      {
        author: "Patricia M.",
        role: "Clinic administrator, Murewa",
        rating: 5,
        date: "2025-06-05",
        body: "Respiratory protection and eyewear for the team. Right specs, right price.",
      },
    ],
  },
  {
    slug: "stationery",
    name: "Stationery",
    category: "Stationery",
    shortDescription:
      "Office and school stationery, printer consumables and writing supplies in bulk.",
    longDescription:
      "General office and school stationery, printer consumables, writing instruments, paper products and filing supplies. Ideal for offices, schools, retailers and procurement teams. Bulk pricing and standing orders are supported.",
    image: "/products/stationery.png",
    placeholder: false,
    featured: true,
    features: [
      "Office & school stationery supplies",
      "Printer consumables: toner, ink, drums",
      "Writing instruments & paper products",
      "Filing, binding & archival supplies",
      "Bulk pricing & standing orders supported",
    ],
    specs: [
      { label: "Categories", value: "Office, School, Printer consumables" },
      { label: "Pack sizes", value: "Single to carton quantities" },
      { label: "Contracts", value: "School & office termly supply" },
      { label: "Lead time", value: "1–3 working days" },
    ],
    minOrder: "Single item",
    leadTime: "1–3 working days",
    rating: 4.5,
    reviewCount: 33,
    reviews: [
      {
        author: "School bursar, Harare",
        role: "Procurement, Avondale",
        rating: 5,
        date: "2025-08-25",
        body: "Termly stationery supply for the whole school. Always arrives on time, invoices are clean.",
      },
      {
        author: "Tinashe G.",
        role: "Office manager, CBD",
        rating: 4,
        date: "2025-07-15",
        body: "Printer toner and paper in bulk. Pricing fair, never had a stock-out since we switched.",
      },
      {
        author: "Linda B.",
        role: "Retailer, Highfield",
        rating: 5,
        date: "2025-05-22",
        body: "Resell exercise books and pens from Canbri. Good margins, fast restocks.",
      },
    ],
  },
  {
    slug: "ice-blocks",
    name: "Ice Blocks",
    category: "Ice Blocks",
    shortDescription:
      "Manufactured ice blocks for commercial, retail and events use, delivered cold across Harare and Murewa.",
    longDescription:
      "Manufactured ice blocks produced under hygienic conditions and supplied to restaurants, hotels, bars, supermarkets, fisheries, caterers, event organisers and households. Delivered cold across Harare and Murewa. Bulk orders and recurring deliveries are welcome.",
    image: "/products/ice-blocks.png",
    placeholder: false,
    featured: true,
    features: [
      "Manufactured ice blocks under hygienic conditions",
      "Restaurants, hotels, bars & supermarkets",
      "Fisheries, caterers & event organisers",
      "Bulk orders & recurring deliveries welcome",
      "Cold-chain delivery across Harare & Murewa",
    ],
    specs: [
      { label: "Format", value: "Block ice, crushed ice on request" },
      { label: "Min order", value: "Single block to bulk pallet" },
      { label: "Delivery", value: "Cold-chain, Harare & Murewa" },
      { label: "Lead time", value: "Same day for orders before 12:00" },
    ],
    minOrder: "Single block",
    leadTime: "Same day (orders before 12:00)",
    rating: 4.9,
    reviewCount: 56,
    reviews: [
      {
        author: "Chef Thomas H.",
        role: "Restaurant owner, Borrowdale",
        rating: 5,
        date: "2025-09-02",
        body: "Daily ice block delivery for the kitchen. Cold-chain is rock solid, never had a melt.",
      },
      {
        author: "Sekai M.",
        role: "Events caterer, Harare",
        rating: 5,
        date: "2025-08-12",
        body: "Bulk crushed ice for a 400-pax event arrived on time and stayed frozen. Lifesaver.",
      },
      {
        author: "Tafadzwa W.",
        role: "Supermarket buyer, Murewa",
        rating: 5,
        date: "2025-06-28",
        body: "Recurring weekly order for the supermarket chiller cabinet. Customers are happy.",
      },
    ],
  },
];
