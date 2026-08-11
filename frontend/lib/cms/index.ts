export type { Product, ProductCategory, ProductReview, ProductSpec } from "@/content/products";
export { starSlots } from "@/content/products";
export type { Industry, CompanyValue, GalleryItem } from "@/content/content";
export type {
  NavLink,
  Branch,
  Stat,
  AboutCard,
  SiteSettings,
  Homepage,
  About,
  Contact,
  RichText,
} from "./types";

import * as staticAdapter from "./static-adapter";
import * as apiAdapter from "./api-adapter";

// Catalogue and site settings are now backend-owned — no static fallback.
export const getProducts = apiAdapter.getProducts;
export const getFeaturedProducts = apiAdapter.getFeaturedProducts;
export const getProductsByCategory = apiAdapter.getProductsByCategory;
export const getProductCategories = apiAdapter.getProductCategories;
export const getSiteSettings = apiAdapter.getSiteSettings;

export const getHomepage = staticAdapter.getHomepage;
export const getAbout = staticAdapter.getAbout;
export const getContact = staticAdapter.getContact;

export const getIndustries = staticAdapter.getIndustries;
export const getGalleryItems = staticAdapter.getGalleryItems;
export const getCompanyValues = staticAdapter.getCompanyValues;

/**
 * Builds a wa.me link for a WhatsApp quote request.
 */
export function quoteWhatsAppHref(whatsappNumber: string, productName?: string) {
  if (!whatsappNumber) return "";
  const text = productName
    ? `Hello Canbri, I'd like to request a quote for ${productName}.`
    : "Hello Canbri, I'd like to request a quote.";
  return `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    text,
  )}`;
}
