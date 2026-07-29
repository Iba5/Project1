/**
 * Sanity adapter.
 *
 * Fetches content from Sanity, reshaped to match the same types the static
 * adapter returns (see ./types.ts), so components never need to know which
 * one is active.
 *
 * A brand-new Sanity dataset has no documents yet, so every singleton
 * fetch below falls back to a sensible default if the query returns null.
 * This means the site renders correctly the moment Sanity is connected,
 * even before an editor has filled in Homepage / About / Contact / Site
 * Settings in the Studio.
 */

import { sanityClient } from "@/lib/sanity/client";
import {
  productsQuery,
  featuredProductsQuery,
  productsByCategoryQuery,
  industriesQuery,
  galleryItemsQuery,
  companyValuesQuery,
  homepageQuery,
  aboutQuery,
  contactQuery,
  siteSettingsQuery,
  CACHE_TAGS,
} from "@/lib/sanity/queries";
import type { Product, ProductCategory } from "@content/products";
import type { Industry, CompanyValue, GalleryItem } from "@content/content";
import type { Homepage, About, Contact, SiteSettings, Branch } from "./types";

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Tools & Hardware",
  "Fabrication",
  "PPE",
  "Stationery",
  "Ice Blocks",
];

export async function getProducts(): Promise<Product[]> {
  return sanityClient.fetch(productsQuery, {}, {
    next: { tags: [CACHE_TAGS.product] },
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return sanityClient.fetch(featuredProductsQuery, {}, {
    next: { tags: [CACHE_TAGS.product] },
  });
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  if (category === "All") return getProducts();
  return sanityClient.fetch(productsByCategoryQuery, { category }, {
    next: { tags: [CACHE_TAGS.product] },
  });
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  // Categories are a fixed enum in the schema (see sanity/schemaTypes/product.ts),
  // not their own document type, so this is returned directly rather than queried.
  return PRODUCT_CATEGORIES;
}

export async function getIndustries(): Promise<Industry[]> {
  return sanityClient.fetch(industriesQuery, {}, {
    next: { tags: [CACHE_TAGS.industry] },
  });
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return sanityClient.fetch(galleryItemsQuery, {}, {
    next: { tags: [CACHE_TAGS.galleryItem] },
  });
}

export async function getCompanyValues(): Promise<CompanyValue[]> {
  return sanityClient.fetch(companyValuesQuery, {}, {
    next: { tags: [CACHE_TAGS.companyValue] },
  });
}

const FALLBACK_HOMEPAGE: Homepage = {
  heroKicker: "",
  heroTitle: "Premium supply solutions for homes, businesses & events.",
  heroDescription: "",
  heroImage: "/products/ice-blocks.svg",
  heroBadgeText: "",
  ctaOne: "Request a Quote",
  ctaOneLink: "/contact#quote",
  ctaOneStyle: "internal",
  ctaTwo: "WhatsApp Us",
  ctaTwoLink: "",
  ctaTwoStyle: "whatsapp",
  stats: [],
  aboutPreviewTitle: "",
  aboutPreviewDescription: "",
  aboutPreviewCards: [],
  ctaBandTitle: "Ready to place an order or request a quote?",
  ctaBandDescription: "",
};

export async function getHomepage(): Promise<Homepage> {
  const doc = await sanityClient.fetch(homepageQuery, {}, {
    next: { tags: [CACHE_TAGS.homepage] },
  });
  if (!doc) return FALLBACK_HOMEPAGE;
  return {
    heroKicker: doc.heroKicker ?? FALLBACK_HOMEPAGE.heroKicker,
    heroTitle: doc.heroTitle ?? FALLBACK_HOMEPAGE.heroTitle,
    heroDescription: doc.heroDescription ?? FALLBACK_HOMEPAGE.heroDescription,
    heroImage: doc.heroImage ?? FALLBACK_HOMEPAGE.heroImage,
    heroBadgeText: doc.heroBadgeText ?? FALLBACK_HOMEPAGE.heroBadgeText,
    ctaOne: doc.ctaOne ?? FALLBACK_HOMEPAGE.ctaOne,
    ctaOneLink: doc.ctaOneLink ?? FALLBACK_HOMEPAGE.ctaOneLink,
    ctaOneStyle: doc.ctaOneStyle ?? FALLBACK_HOMEPAGE.ctaOneStyle,
    ctaTwo: doc.ctaTwo ?? FALLBACK_HOMEPAGE.ctaTwo,
    ctaTwoLink: doc.ctaTwoLink ?? FALLBACK_HOMEPAGE.ctaTwoLink,
    ctaTwoStyle: doc.ctaTwoStyle ?? FALLBACK_HOMEPAGE.ctaTwoStyle,
    stats: doc.stats ?? FALLBACK_HOMEPAGE.stats,
    aboutPreviewTitle: doc.aboutPreviewTitle ?? FALLBACK_HOMEPAGE.aboutPreviewTitle,
    aboutPreviewDescription:
      doc.aboutPreviewDescription ?? FALLBACK_HOMEPAGE.aboutPreviewDescription,
    aboutPreviewCards: doc.aboutPreviewCards ?? FALLBACK_HOMEPAGE.aboutPreviewCards,
    ctaBandTitle: doc.ctaBandTitle ?? FALLBACK_HOMEPAGE.ctaBandTitle,
    ctaBandDescription: doc.ctaBandDescription ?? FALLBACK_HOMEPAGE.ctaBandDescription,
  };
}

const FALLBACK_ABOUT: About = {
  heroTitle: "A diversified Zimbabwean supplier built on reliability.",
  heroDescription: "",
  whoWeAreTitle: "",
  whoWeAre: "",
  missionTitle: "",
  mission: "",
  visionTitle: "",
  vision: "",
  ctaTitle: "Want to know if we supply what you need?",
  ctaDescription: "",
};

export async function getAbout(): Promise<About> {
  const doc = await sanityClient.fetch(aboutQuery, {}, {
    next: { tags: [CACHE_TAGS.about] },
  });
  if (!doc) return FALLBACK_ABOUT;
  return {
    heroTitle: doc.heroTitle ?? FALLBACK_ABOUT.heroTitle,
    heroDescription: doc.heroDescription ?? FALLBACK_ABOUT.heroDescription,
    whoWeAreTitle: doc.whoWeAreTitle ?? FALLBACK_ABOUT.whoWeAreTitle,
    whoWeAre: doc.whoWeAre ?? FALLBACK_ABOUT.whoWeAre,
    missionTitle: doc.missionTitle ?? FALLBACK_ABOUT.missionTitle,
    mission: doc.mission ?? FALLBACK_ABOUT.mission,
    visionTitle: doc.visionTitle ?? FALLBACK_ABOUT.visionTitle,
    vision: doc.vision ?? FALLBACK_ABOUT.vision,
    ctaTitle: doc.ctaTitle ?? FALLBACK_ABOUT.ctaTitle,
    ctaDescription: doc.ctaDescription ?? FALLBACK_ABOUT.ctaDescription,
  };
}

export async function getContact(): Promise<Contact> {
  const doc = await sanityClient.fetch(contactQuery, {}, {
    next: { tags: [CACHE_TAGS.contact] },
  });
  const branches: Branch[] = (doc?.branches ?? []).map((b: any) => ({
    city: b.city,
    label: b.label,
    addressLines: b.addressLines ?? [],
    phone: b.phone,
    phoneHref: b.phoneHref,
    hours: b.hours,
    mapsEmbedUrl: b.mapsEmbedUrl,
  }));
  return {
    intro: doc?.intro ?? "",
    branches,
    googleMaps: doc?.googleMaps,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await sanityClient.fetch(siteSettingsQuery, {}, {
    next: { tags: [CACHE_TAGS.siteSettings] },
  });
  const whatsappNumber = doc?.whatsappNumber ?? "";
  const callNumber = doc?.callNumber ?? "";
  const email = doc?.email ?? "";
  return {
    companyName: doc?.companyName ?? "",
    legalName: doc?.legalName ?? doc?.companyName ?? "",
    shortName: doc?.shortName ?? "",
    tagline: doc?.tagline ?? "",
    description: doc?.description ?? "",
    url: doc?.url ?? "https://canbri.co.zw",
    deliveryAreas: doc?.deliveryAreas ?? [],
    email,
    emailHref: email ? `mailto:${email}` : "",
    whatsappNumber,
    whatsappDisplay: doc?.whatsappDisplay ?? whatsappNumber,
    callNumber,
    callDisplay: doc?.callDisplay ?? callNumber,
    callHref: callNumber ? `tel:${callNumber}` : "",
    facebook: doc?.facebook ?? "",
    instagram: doc?.instagram ?? "",
    businessHours: doc?.businessHours ?? "",
    navLinks: doc?.navLinks ?? [],
  };
}
