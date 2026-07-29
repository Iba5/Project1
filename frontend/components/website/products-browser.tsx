"use client";

import { useState } from "react";
import { ProductCard } from "@/components/website/product-card";
import type { Product, ProductCategory } from "@/lib/cms";
import { cn } from "@/lib/utils";

type ProductsBrowserProps = {
  products: Product[];
  categories: ProductCategory[];
  whatsappNumber: string;
};

export function ProductsBrowser({ products, categories, whatsappNumber }: ProductsBrowserProps) {
  const [active, setActive] = useState<"All" | ProductCategory>("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter products by category">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === c
                ? "bg-brand-surface-strong text-white"
                : "bg-secondary text-brand-heading hover:bg-brand-accent",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.slug} product={p} whatsappNumber={whatsappNumber} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No products in this category yet — check back soon.
        </p>
      )}
    </>
  );
}
