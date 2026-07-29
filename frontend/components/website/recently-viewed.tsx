"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, ChevronRight, Sparkles, PackageSearch } from "lucide-react";
import { useProductStore, type StoredProduct } from "@/lib/stores/product-store";
import { ScrollReveal } from "@/components/website/scroll-reveal";
import { SmartImage } from "@/components/website/smart-image";
import { cn } from "@/lib/utils";

type RecentlyViewedProps = {
  /** Optional callback — defaults to dispatching canbri:open-quick-view event */
  onPick?: (product: StoredProduct) => void;
};

export function RecentlyViewed({ onPick }: RecentlyViewedProps) {
  const handlePick = (p: StoredProduct) => {
    if (onPick) {
      onPick(p);
    } else {
      // Scroll to products section + dispatch event to open quick view
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.dispatchEvent(
        new CustomEvent("canbri:open-quick-view", {
          detail: { slug: p.slug },
        }),
      );
    }
  };
  const recentlyViewed = useProductStore((s) => s.recentlyViewed);
  const clearRecentlyViewed = useProductStore((s) => s.clearRecentlyViewed);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Don't render anything on the server (avoids hydration mismatch)
  if (!mounted) return null;

  // Empty state: show a CTA to browse products
  if (recentlyViewed.length === 0) {
    return (
      <ScrollReveal>
        <section
          aria-label="Recently viewed products"
          className="border-t border-border bg-gradient-to-br from-secondary/40 via-background to-secondary/30"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/40 p-6 sm:p-8">
              {/* Decorative gradient */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-accent/10 blur-3xl"
                aria-hidden
              />
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/15 text-brand-accent-fg ring-1 ring-brand-accent/20">
                    <PackageSearch className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-brand-heading">
                      Recently viewed
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Products you explore will appear here so you can quickly return to them.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-brand-navy/20"
                >
                  <Sparkles className="h-4 w-4" strokeWidth={2.25} />
                  Browse products
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    );
  }

  // Don't show the grid if only 1 item (keep grid for 2+)
  if (recentlyViewed.length < 2) return null;

  return (
    <ScrollReveal>
      <section
        aria-label="Recently viewed products"
        className="border-t border-border bg-secondary/30"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent-fg">
                <Clock className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-brand-heading">
                  Recently viewed
                </h2>
                <p className="text-xs text-muted-foreground">
                  Pick up where you left off — saved on this device.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearRecentlyViewed}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-heading"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.25} />
              Clear
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <AnimatePresence mode="popLayout">
              {recentlyViewed.map((p, i) => (
                <motion.button
                  key={p.slug}
                  type="button"
                  onClick={() => handlePick(p)}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand-accent/30"
                  aria-label={`View ${p.name} again`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                    <SmartImage
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute right-2 top-2 rounded-full bg-background/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-heading shadow-sm backdrop-blur-sm">
                      {i === 0 ? "Latest" : `#${i + 1}`}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-brand-accent-fg dark:text-brand-ice">
                      {p.category}
                    </p>
                    <h3 className="mt-0.5 truncate font-display text-sm font-semibold text-brand-heading">
                      {p.name}
                    </h3>
                  </div>
                  <ChevronRight
                    className={cn(
                      "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5",
                    )}
                    strokeWidth={2.25}
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
