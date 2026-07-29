"use client";

import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/cms";
import { SmartImage } from "@/components/website/smart-image";
import { cn } from "@/lib/utils";

type GalleryLightboxProps = {
  items: GalleryItem[];
  initialIndex?: number;
  onClose: () => void;
};

export function GalleryLightbox({ items, initialIndex = 0, onClose }: GalleryLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const goNext = () => setCurrent((c) => (c + 1) % items.length);
  const goPrev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  const item = items[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label="Image viewer"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <motion.div
        key={current}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-16 aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <SmartImage
          src={item.image}
          alt={item.title}
          fill
          sizes="90vw"
          className="object-contain"
        />
      </motion.div>

      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-ice">
          {item.category}
        </p>
        <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
        <p className="mt-1 text-xs text-white/60">{current + 1} / {items.length}</p>
      </div>
    </motion.div>
  );
}

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["All", ...Array.from(set)];
  }, [items]);

  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  return (
    <>
      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-200",
              activeCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-secondary text-brand-heading hover:bg-brand-accent hover:text-brand-accent-fg",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <motion.figure
            key={item.slug}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border bg-secondary"
            onClick={() => {
              const realIndex = items.findIndex((it) => it.slug === item.slug);
              setLightboxIndex(realIndex);
            }}
          >
            <SmartImage
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-navy/0 transition-colors duration-300 group-hover:bg-brand-navy/30" />
            {/* Zoom icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-heading shadow-lg">
                <ZoomIn className="h-5 w-5" strokeWidth={2.25} />
              </span>
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-ice">
                {item.category}
              </p>
              <p className="mt-0.5 text-sm font-medium text-white">{item.title}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            items={items}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
