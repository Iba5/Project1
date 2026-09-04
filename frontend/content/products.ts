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
