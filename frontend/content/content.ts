/**
 * Static seed data for industries, gallery and company values.
 */

export type Industry = {
  slug: string;
  name: string;
  description: string;
};

export const industries: Industry[] = [
  {
    slug: "construction",
    name: "Construction & Contracting",
    description:
      "Tools, hardware, fabrication and PPE for builders, site contractors and subcontractors across Harare and Murewa.",
  },
  {
    slug: "hospitality",
    name: "Restaurants & Hotels",
    description:
      "Ice blocks, kitchen equipment and PPE supplied to restaurants, hotels and catering operations, with reliable cold-chain delivery.",
  },
  {
    slug: "retail",
    name: "Retail & Supermarkets",
    description:
      "Wholesale tools, stationery, PPE and packaged ice for retail hardware stores, supermarkets and tuck-shops.",
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Fabrication",
    description:
      "Steel fabrication, hardware, PPE and stationery supplied to workshops, fabricators and light industrial operations.",
  },
  {
    slug: "events",
    name: "Events & Catering",
    description:
      "Bulk ice blocks and on-site equipment supply for event organisers, caterers and outdoor functions.",
  },
  {
    slug: "fisheries",
    name: "Fisheries & Cold Chain",
    description:
      "Ice blocks for fisheries, fishmongers and cold-chain handling, delivered on schedule to preserve freshness.",
  },
  {
    slug: "schools",
    name: "Schools & Offices",
    description:
      "Stationery, hardware and PPE supplied to schools, colleges, churches and offices in bulk and on standing order.",
  },
  {
    slug: "households",
    name: "Households",
    description:
      "Tools, hardware, stationery and ice for everyday household needs, small orders welcome, delivery available.",
  },
];

export type CompanyValue = {
  title: string;
  description: string;
};

export const companyValues: CompanyValue[] = [
  {
    title: "Premium Quality",
    description:
      "Tools, hardware, PPE and ice that meet a real standard, sourced from trusted manufacturers and produced under controlled conditions.",
  },
  {
    title: "Reliable Delivery",
    description:
      "Scheduled deliveries across Harare and Murewa, with cold-chain handling for ice and site-ready supply for hardware and fabrication.",
  },
  {
    title: "Bulk Orders Welcome",
    description:
      "Case, pallet and recurring supply for businesses, sites, schools and events, with standing-order support and bulk pricing.",
  },
  {
    title: "Excellent Customer Service",
    description:
      "Quote-driven pricing, real people on WhatsApp and phone, and a record of getting the right product to the right place on time.",
  },
];

export type GalleryItem = {
  slug: string;
  title: string;
  category: "Factory" | "Production" | "Packaging" | "Deliveries" | "Products" | "Team";
  description: string;
  image: string;
  placeholder?: boolean;
};

export const galleryItems: GalleryItem[] = [
  {
    slug: "factory-exterior",
    title: "Canbri Facility",
    category: "Factory",
    description: "Our production and dispatch facility, full photos to follow.",
    image: "/gallery/factory.png",
    placeholder: false,
  },
  {
    slug: "ice-production",
    title: "Ice Production",
    category: "Production",
    description: "Ice block manufacturing under hygienic conditions.",
    image: "/gallery/production.png",
    placeholder: false,
  },
  {
    slug: "packaging",
    title: "Packaging",
    category: "Packaging",
    description: "Sealed, labelled and ready for cold-chain dispatch.",
    image: "/gallery/packaging.png",
    placeholder: false,
  },
  {
    slug: "deliveries",
    title: "Deliveries",
    category: "Deliveries",
    description: "Daily delivery routes across Harare and Murewa.",
    image: "/gallery/deliveries.png",
    placeholder: false,
  },
  {
    slug: "tools-hardware",
    title: "Tools & Hardware",
    category: "Products",
    description: "Hand tools, power tools and builders' hardware range.",
    image: "/gallery/tools.png",
    placeholder: false,
  },
  {
    slug: "ppe-range",
    title: "PPE Range",
    category: "Products",
    description: "Protective wear, gloves, eyewear and footwear.",
    image: "/gallery/ppe.png",
    placeholder: false,
  },
  {
    slug: "fabrication-work",
    title: "Fabrication Work",
    category: "Products",
    description: "Gates, frames, brackets and structural fabrication.",
    image: "/gallery/fabrication.png",
    placeholder: false,
  },
  {
    slug: "stationery",
    title: "Stationery",
    category: "Products",
    description: "Office and school stationery supplies.",
    image: "/gallery/stationery.png",
    placeholder: false,
  },
];
