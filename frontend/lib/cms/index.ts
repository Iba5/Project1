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

export const getProducts = staticAdapter.getProducts;
export const getFeaturedProducts = staticAdapter.getFeaturedProducts;
export const getProductsByCategory = staticAdapter.getProductsByCategory;
export const getProductCategories = staticAdapter.getProductCategories;

export const getHomepage = staticAdapter.getHomepage;
export const getAbout = staticAdapter.getAbout;
export const getContact = staticAdapter.getContact;
export const getSiteSettings = staticAdapter.getSiteSettings;

export const getIndustries = staticAdapter.getIndustries;
export const getGalleryItems = staticAdapter.getGalleryItems;
export const getCompanyValues = staticAdapter.getCompanyValues;

/**
 * Builds a wa.me link for a WhatsApp quote request.
 */
export function quoteWhatsAppHref(whatsappNumber: string, productName?: string) {
  const text = productName
    ? `Hello Canbri, I'd like to request a quote for ${productName}.`
    : "Hello Canbri, I'd like to request a quote.";
  return `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
    text,
  )}`;
}
