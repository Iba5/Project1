/**
 * Real-backend adapter — replaces static content/products.ts and content/site.ts
 * for anything the FastAPI backend now owns (catalogue items/categories, public
 * site settings). No hardcoded fallback: if the API is unreachable these throw,
 * and callers are expected to show a real loading/error state.
 *
 * These are called from Server Components (app/page.tsx, app/layout.tsx), so
 * they talk to the backend directly via apiProxy rather than a relative fetch
 * to a Next.js route handler — a relative URL has no meaning server-side.
 */

import { apiProxy } from "@/lib/api-proxy";
import type { Product, ProductCategory } from "@/content/products";
import type { GalleryItem } from "@/content/content";
import { navLinks } from "@/content/site";
import type { SiteSettings } from "./types";

type BackendCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

type BackendCatalogueItem = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category: BackendCategory | null;
  short_description: string | null;
  long_description: string | null;
  image_url: string | null;
  gallery_image_urls: string[] | null;
  is_featured: boolean;
  is_out_of_stock: boolean;
  features: string[] | null;
  specs: Array<{ key: string; value: string }> | null;
  min_order: string | null;
  lead_time: string | null;
  rating: number | null;
  review_count: number;
  status: string;
};

function mapItem(item: BackendCatalogueItem): Product {
  return {
    slug: item.slug,
    name: item.name,
    category: item.category?.name ?? "Uncategorized",
    shortDescription: item.short_description ?? "",
    longDescription: item.long_description ?? undefined,
    image: item.image_url ?? "/products/placeholder.svg",
    images: item.gallery_image_urls ?? undefined,
    placeholder: !item.image_url,
    featured: item.is_featured,
    features: item.features ?? undefined,
    specs: (item.specs ?? []).map((s) => ({ label: s.key, value: s.value })),
    minOrder: item.min_order ?? undefined,
    leadTime: item.lead_time ?? undefined,
    rating: item.rating ?? undefined,
    reviewCount: item.review_count,
  };
}

async function fetchCatalogueItems(params?: Record<string, string>): Promise<Product[]> {
  const { data, status } = await apiProxy<{ items: BackendCatalogueItem[] }>({
    method: "GET",
    path: "/catalogue/items",
    searchParams: params,
  });
  if (status < 200 || status >= 300) {
    throw new Error(`Catalogue request failed (${status})`);
  }
  return (data.items ?? []).map(mapItem);
}

export async function getProducts(): Promise<Product[]> {
  return fetchCatalogueItems({ status: "published" });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return fetchCatalogueItems({ status: "published", is_featured: "true" });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === "All") return getProducts();
  const items = await getProducts();
  return items.filter((p) => p.category === category);
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const { data, status } = await apiProxy<{ items: BackendCategory[] }>({
    method: "GET",
    path: "/catalogue/categories",
    searchParams: { limit: "200" },
  });
  if (status < 200 || status >= 300) {
    throw new Error(`Categories request failed (${status})`);
  }
  return (data.items ?? [])
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => c.name);
}

type BackendMediaItem = {
  id: string;
  title: string;
  alt_text: string | null;
  file_url: string;
  category: string | null;
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, status } = await apiProxy<{ items: BackendMediaItem[] }>({
    method: "GET",
    path: "/gallery/items",
    searchParams: { limit: "200" },
  });
  if (status < 200 || status >= 300) {
    throw new Error(`Gallery request failed (${status})`);
  }
  return (data.items ?? []).map((item) => ({
    slug: item.id,
    title: item.title,
    category: item.category ?? "Gallery",
    description: item.alt_text ?? item.title,
    image: item.file_url,
    placeholder: false,
  }));
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, status } = await apiProxy<Array<{ key: string; value: unknown }>>({
    method: "GET",
    path: "/settings",
  });
  if (status < 200 || status >= 300) {
    throw new Error(`Settings request failed (${status})`);
  }
  const list = Array.isArray(data) ? data : [];
  const map: Record<string, unknown> = {};
  for (const s of list) map[s.key] = s.value;

  const companyName = str(map.site_name);
  const whatsapp = str(map.site_whatsapp);
  const phone = str(map.site_phone);
  const deliveryAreas = Array.isArray(map.delivery_areas) ? (map.delivery_areas as string[]) : [];

  return {
    companyName,
    legalName: companyName,
    shortName: companyName,
    tagline: "",
    description: str(map.site_description),
    url: str(map.site_url),
    deliveryAreas,
    email: str(map.site_email),
    emailHref: str(map.site_email) ? `mailto:${str(map.site_email)}` : "",
    whatsappNumber: whatsapp,
    whatsappDisplay: whatsapp,
    callNumber: phone,
    callDisplay: phone,
    callHref: phone ? `tel:${phone}` : "",
    facebook: str(map.social_facebook),
    instagram: str(map.social_instagram),
    businessHours: str(map.business_hours),
    navLinks,
  };
}
