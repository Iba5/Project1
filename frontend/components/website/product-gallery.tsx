"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  productName: string;
  images: string[];
};

/**
 * Per-product gallery grid. Visually matches the site's existing dark-navy
 * placeholder-card treatment (icon + "Photo coming soon") for empty slots,
 * with no category filter row since it's already scoped to one product.
 */
export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-brand-navy p-6 text-center">
          <ImageOff className="h-7 w-7 text-brand-ice/70" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-semibold text-white">{productName}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">
              Photo coming soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-brand-navy"
          >
            <Image
              src={src}
              alt={`${productName} — photo ${i + 1}`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navy/90 p-4 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
                  }}
                  className="absolute left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
                  }}
                  className="absolute right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div
              className={cn("relative h-[80vh] w-full max-w-3xl")}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex]}
                alt={`${productName} — photo ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
