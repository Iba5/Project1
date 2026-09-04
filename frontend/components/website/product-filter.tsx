"use client";

import { ProductListRow } from "@/components/website/product-list-row";
import type { Product, ProductCategory } from "@/lib/cms";

type ProductFilterProps = {
  products: Product[];
  categories: ProductCategory[];
  whatsappNumber: string;
};

/**
 * Products section — a simple name list, no category filter bar (dropped
 * per the small real product count). Clicking a row opens the product's
 * own detail page; "Add to Quote" stays available as a quick action.
 */
export function ProductFilter({ products }: ProductFilterProps) {
  return (
    <div className="mt-8">
      {products.map((p) => (
        <ProductListRow key={p.slug} product={p} />
      ))}

      {products.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No products in the catalogue yet.
        </div>
      )}
    </div>
  );
}
