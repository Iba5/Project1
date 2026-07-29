"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/website/product-card";
import { ProductQuickView } from "@/components/website/product-quick-view";
import { ScrollReveal } from "@/components/website/scroll-reveal";
import type { Product, ProductCategory } from "@/lib/cms";
import { useProductStore, toStoredProduct } from "@/lib/stores/product-store";
import { cn } from "@/lib/utils";
import { GitCompareArrows } from "lucide-react";

type ProductFilterProps = {
  products: Product[];
  categories: ProductCategory[];
  whatsappNumber: string;
};

export function ProductFilter({ products, categories, whatsappNumber }: ProductFilterProps) {
  const [active, setActive] = useState<ProductCategory | "All">("All");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addRecentlyViewed = useProductStore((s) => s.addRecentlyViewed);
  const compareList = useProductStore((s) => s.compare);
  const setCompareOpen = useProductStore((s) => s.setCompareOpen);

  // Sync quick-view product into Recently Viewed store whenever it changes
  useEffect(() => {
    if (quickViewProduct) {
      addRecentlyViewed(toStoredProduct(quickViewProduct));
    }
  }, [quickViewProduct, addRecentlyViewed]);

  // Listen for search bar events to auto-open a specific product's quick view
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ slug: string }>).detail;
      if (!detail?.slug) return;
      const match = products.find((p) => p.slug === detail.slug);
      if (match) setQuickViewProduct(match);
    };
    window.addEventListener("canbri:open-quick-view", handler as EventListener);
    return () =>
      window.removeEventListener(
        "canbri:open-quick-view",
        handler as EventListener,
      );
  }, [products]);

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  const openCompareDrawer = () => {
    setCompareOpen(true);
  };

  return (
    <div>
      {/* Category filter tabs + Compare All button */}
      <ScrollReveal>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
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

          {/* Compare All button — shows when 2+ items are in compare list */}
          {compareList.length >= 2 && (
            <button
              type="button"
              onClick={openCompareDrawer}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-brand-accent/30 transition-all hover:bg-brand-navy/90 hover:shadow-md hover:shadow-brand-navy/20"
              aria-label={`Compare ${compareList.length} selected products`}
            >
              <GitCompareArrows className="h-4 w-4 transition-transform group-hover:scale-110" strokeWidth={2.25} />
              Compare All
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1.5 text-[10px] font-bold text-brand-accent-fg">
                {compareList.length}
              </span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Product grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard
            key={p.slug}
            product={p}
            whatsappNumber={whatsappNumber}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground">
          No products in this category yet.
        </div>
      )}

      {/* Quick view modal */}
      <ProductQuickView
        product={quickViewProduct}
        whatsappNumber={whatsappNumber}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
