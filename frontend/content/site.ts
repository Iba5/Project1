/**
 * Canbri site configuration, single source of truth.
 */

export type ContactMethod = {
  label: string;
  href: string;
  value: string;
};

export type Branch = {
  city: string;
  label: string;
  addressLines: string[];
  phone: string;
  phoneHref: string;
  hours: string;
  mapsEmbedUrl?: string;
};

export type NavLink = { label: string; href: string };

export const siteConfig = {
  name: "Canbri Private Limited",
  shortName: "Canbri",
  tagline: "Cool & Cold",
  legalName: "Canbri Private Limited",
  description:
    "Canbri Private Limited supplies tools and hardware, fabrication services, personal protective equipment, stationery and ice blocks. We serve businesses and households across Harare and Murewa with reliable delivery and bulk-order support.",
  deliveryAreas: ["Harare", "Murewa"],
  url: "https://canbri.co.zw",
  email: "info@canbri.co.zw",
  emailHref: "mailto:info@canbri.co.zw",
  whatsappNumber: "+263770000000",
  whatsappDisplay: "+263 77 000 0000",
  whatsappHref:
    "https://wa.me/263770000000?text=Hello%20Canbri%2C%20I%27d%20like%20to%20request%20a%20quote.",
  callNumber: "+263770000000",
  callDisplay: "+263 77 000 0000",
  callHref: "tel:+263770000000",
  social: {
    facebook: "https://www.facebook.com/canbri",
    instagram: "https://www.instagram.com/canbri",
  },
  businessHours: "Mon – Fri: 08:00 – 17:00 · Sat: 08:00 – 13:00 · Sun: Closed",
  foundingYear: 2024,
} as const;

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const branches: Branch[] = [
  {
    city: "Harare",
    label: "Harare Branch, Head Office",
    addressLines: [
      "Workington Industrial Area",
      "Harare, Zimbabwe",
    ],
    phone: siteConfig.callDisplay,
    phoneHref: siteConfig.callHref,
    hours: "Mon – Fri: 08:00 – 17:00 · Sat: 08:00 – 13:00",
    mapsEmbedUrl: undefined,
  },
  {
    city: "Murewa",
    label: "Murewa Branch",
    addressLines: [
      "Murewa Growth Point",
      "Mashonaland East, Zimbabwe",
    ],
    phone: siteConfig.callDisplay,
    phoneHref: siteConfig.callHref,
    hours: "Mon – Fri: 08:00 – 17:00 · Sat: 08:00 – 13:00",
    mapsEmbedUrl: undefined,
  },
];

export const quoteWhatsAppHref = (productName?: string) => {
  const text = productName
    ? `Hello Canbri, I'd like to request a quote for ${productName}.`
    : "Hello Canbri, I'd like to request a quote.";
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    text,
  )}`;
};
