"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  Check,
  PackageCheck,
  Truck,
  ShoppingCart,
} from "lucide-react";
import type { Product } from "@/lib/cms";
import { quoteWhatsAppHref } from "@/lib/cms";
import { ShareButtons } from "@/components/website/share-buttons";

type ProductQuickViewProps = {
  product: Product | null;
  whatsappNumber: string;
  onClose: () => void;
};

/** Image with a built-in skeleton shimmer that resets when src changes. */
function QuickViewImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-secondary" aria-hidden />
      )}
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700"
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

export function ProductQuickView({ product, whatsappNumber, onClose }: ProductQuickViewProps) {
  // Lock body scroll while modal is open + close on Escape
  useEffect(() => {
    if (!product) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-navy/70 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quickview-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-background shadow-2xl ring-1 ring-border sm:rounded-2xl"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-brand-heading shadow-md ring-1 ring-border backdrop-blur-sm transition-colors hover:bg-brand-accent hover:text-brand-accent-fg"
            >
              <X className="h-4 w-4" strokeWidth={2.25} />
            </button>

            <div className="grid overflow-y-auto md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary md:aspect-auto md:min-h-[420px]">
                <QuickViewImage src={product.image} alt={product.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent md:bg-gradient-to-r" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-heading shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" aria-hidden />
                  {product.category}
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-col p-6 sm:p-8">
                <h3
                  id="quickview-title"
                  className="font-display text-2xl font-bold text-brand-heading"
                >
                  {product.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {product.longDescription ?? product.shortDescription}
                </p>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                      Key Features
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent-fg"
                            strokeWidth={2.5}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specs */}
                {product.specs && product.specs.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                      Specifications
                    </h4>
                    <dl className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border">
                      {product.specs.map((s) => (
                        <div key={s.label} className="grid grid-cols-3 gap-2 bg-card/50 px-3 py-2">
                          <dt className="text-xs font-medium text-muted-foreground">{s.label}</dt>
                          <dd className="col-span-2 text-xs font-medium text-brand-heading">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Quick facts */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5">
                    <ShoppingCart className="h-4 w-4 text-brand-accent-fg" strokeWidth={2} />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Min Order
                      </p>
                      <p className="text-xs font-medium text-brand-heading">{product.minOrder ?? "Single item"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2.5">
                    <Truck className="h-4 w-4 text-brand-accent-fg" strokeWidth={2} />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Lead Time
                      </p>
                      <p className="text-xs font-medium text-brand-heading">{product.leadTime ?? "1–3 days"}</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={quoteWhatsAppHref(whatsappNumber, product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 text-sm font-semibold text-[#06351B] shadow-md shadow-[#25D366]/30 transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                    Get a Quote
                  </a>
                  <a
                    href="#contact"
                    onClick={onClose}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 text-sm font-semibold text-brand-heading transition-colors hover:bg-brand-accent hover:text-brand-accent-fg hover:border-brand-accent"
                  >
                    <PackageCheck className="h-4 w-4" strokeWidth={2.25} />
                    Full Enquiry
                  </a>
                </div>

                {/* Share buttons */}
                <div className="mt-4 border-t border-border pt-4">
                  <ShareButtons productName={product.name} productSlug={product.slug} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

