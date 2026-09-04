"use client";

import { useState } from "react";
import { QuoteRequestCard } from "@/components/website/quote-request-card";
import { ScrollReveal } from "@/components/website/scroll-reveal";
import type { Product, ProductCategory } from "@/lib/cms";
import { cn } from "@/lib/utils";

type ProductFilterProps = {
  products: Product[];
  categories: ProductCategory[];
  whatsappNumber: string;
};

export function ProductFilter({ products, categories }: ProductFilterProps) {
  const [active, setActive] = useState<ProductCategory | "All">("All");

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Category filter tabs */}
      <ScrollReveal>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter:
          </span>
          {(["All", ...categories] as const).map((cat) => {
            const count = cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  active === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-secondary text-brand-heading hover:bg-brand-accent hover:text-brand-accent-fg",
                )}
              >
                {cat}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active === cat ? "bg-white/20 text-white" : "bg-background text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Product grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <QuoteRequestCard key={p.slug} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No products in this category yet.
        </div>
      )}
    </div>
  );
}
