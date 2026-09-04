"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  GitCompareArrows,
  MessageCircle,
  Check,
  Minus,
} from "lucide-react";
import { useProductStore } from "@/lib/stores/product-store";
import { quoteWhatsAppHref } from "@/lib/cms";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type FullProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
  longDescription?: string;
  features?: string[];
  specs?: Array<{ label: string; value: string }>;
  minOrder?: string;
  leadTime?: string;
};

type CompareDrawerProps = {
  whatsappNumber: string;
  /** Optional: products array to pull full specs/features from when comparing */
  fullProducts?: FullProduct[];
};

export function CompareDrawer({ whatsappNumber, fullProducts = [] }: CompareDrawerProps) {
  const compare = useProductStore((s) => s.compare);
  const compareOpen = useProductStore((s) => s.compareOpen);
  const setCompareOpen = useProductStore((s) => s.setCompareOpen);
  const removeFromCompare = useProductStore((s) => s.removeFromCompare);
  const clearCompare = useProductStore((s) => s.clearCompare);

  // Lock body scroll while open
  useEffect(() => {
    if (!compareOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCompareOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [compareOpen, setCompareOpen]);

  // Build enriched compare list (with full specs/features when available)
  const enriched: FullProduct[] = compare.map((c) => {
    const full = fullProducts.find((p) => p.slug === c.slug);
    return full
      ? { ...c, ...full }
      : {
          slug: c.slug,
          name: c.name,
          category: c.category,
          image: c.image,
          shortDescription: c.shortDescription,
          minOrder: c.minOrder,
          leadTime: c.leadTime,
        };
  });

  // Collect all unique spec labels
  const allSpecLabels: string[] = [];
  enriched.forEach((p) => {
    p.specs?.forEach((s) => {
      if (!allSpecLabels.includes(s.label)) allSpecLabels.push(s.label);
    });
  });

  const handleQuoteAll = () => {
    const names = compare.map((p) => p.name).join(", ");
    trackEvent("whatsapp_click", "compare_all_quote", { products: names });
    const href = quoteWhatsAppHref(whatsappNumber, `the following: ${names}`);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  // Grid template: 1 label column + N product columns
  const colCount = Math.max(enriched.length, 1);
  const gridTemplate = `140px repeat(${colCount}, minmax(0, 1fr))`;

  return (
    <AnimatePresence>
      {compareOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCompareOpen(false)}
            className="fixed inset-0 z-[90] bg-brand-navy/60 backdrop-blur-sm"
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[100] flex h-full w-full max-w-4xl flex-col bg-background shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Compare products"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-fg">
                  <GitCompareArrows className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-brand-heading">
                    Compare Products
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {compare.length} of 3 selected — side-by-side specs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {compare.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCompare}
                    className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-heading sm:inline-flex"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close compare drawer"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-brand-heading transition-colors hover:bg-secondary"
                >
                  <X className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto">
              {compare.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <GitCompareArrows className="h-8 w-8" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-brand-heading">
                    No products to compare yet
                  </h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Click the compare icon on any product card to add it here.
                    You can compare up to 3 products side-by-side.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCompareOpen(false)}
                    className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                <div className="px-3 py-4 sm:px-5">
                  {/* Product header cards row */}
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${compare.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {enriched.map((p) => (
                      <div
                        key={p.slug}
                        className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => removeFromCompare(p.slug)}
                          aria-label={`Remove ${p.name} from compare`}
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-brand-heading shadow-sm ring-1 ring-border transition-colors hover:bg-red-500 hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="300px"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                            {p.category}
                          </p>
                          <h3 className="mt-1 font-display text-sm font-semibold leading-tight text-brand-heading">
                            {p.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comparison spec table — true grid */}
                  <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
                    <SpecRow
                      label="Min Order"
                      gridTemplate={gridTemplate}
                      values={enriched.map((p) => ({
                        slug: p.slug,
                        content: p.minOrder ?? "Single item",
                        hasCheck: true,
                      }))}
                    />
                    <SpecRow
                      label="Lead Time"
                      gridTemplate={gridTemplate}
                      values={enriched.map((p) => ({
                        slug: p.slug,
                        content: p.leadTime ?? "1–3 days",
                        hasCheck: true,
                      }))}
                    />
                    <SpecRow
                      label="Category"
                      gridTemplate={gridTemplate}
                      values={enriched.map((p) => ({
                        slug: p.slug,
                        content: p.category,
                        hasCheck: true,
                      }))}
                    />
                    {allSpecLabels.map((label) => (
                      <SpecRow
                        key={label}
                        label={label}
                        gridTemplate={gridTemplate}
                        values={enriched.map((p) => {
                          const spec = p.specs?.find((s) => s.label === label);
                          return {
                            slug: p.slug,
                            content: spec?.value ?? "N/A",
                            hasCheck: !!spec,
                          };
                        })}
                      />
                    ))}
                  </div>

                  {/* Features side-by-side */}
                  {enriched.some((p) => p.features && p.features.length > 0) && (
                    <div className="mt-5">
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Key Features
                      </h3>
                      <div
                        className="grid gap-3"
                        style={{
                          gridTemplateColumns: `repeat(${compare.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {enriched.map((p) => (
                          <div
                            key={p.slug}
                            className="rounded-xl border border-border bg-card p-3"
                          >
                            <ul className="space-y-1.5">
                              {(p.features ?? []).map((f, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                                >
                                  <Check
                                    className="mt-0.5 h-3 w-3 shrink-0 text-brand-accent-fg"
                                    strokeWidth={2.5}
                                  />
                                  <span>{f}</span>
                                </li>
                              ))}
                              {(!p.features || p.features.length === 0) && (
                                <li className="text-xs text-muted-foreground/60">
                                  No features listed
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-6 mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Ready to decide? Get a combined quote on WhatsApp.
                    </p>
                    <button
                      type="button"
                      onClick={handleQuoteAll}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-semibold text-[#06351B] shadow-md shadow-[#25D366]/30 transition-transform hover:scale-[1.02]"
                    >
                      <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                      Get a combined quote
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SpecRow({
  label,
  values,
  gridTemplate,
}: {
  label: string;
  values: Array<{ slug: string; content: string; hasCheck?: boolean }>;
  gridTemplate: string;
}) {
  return (
    <div
      className="grid border-t border-border first:border-t-0"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <div className="bg-secondary/60 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-brand-heading">
        {label}
      </div>
      {values.map((v) => (
        <div
          key={v.slug}
          className="border-l border-border px-3 py-2.5 text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            {v.hasCheck ? (
              <Check className="h-3 w-3 shrink-0 text-brand-accent-fg" strokeWidth={2.5} />
            ) : (
              <Minus className="h-3 w-3 shrink-0 text-muted-foreground/60" strokeWidth={2} />
            )}
            <span className={cn(!v.hasCheck && "text-muted-foreground/60")}>
              {v.content}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
