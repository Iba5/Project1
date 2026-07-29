"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/lib/cms";

type GalleryBrowserProps = {
  items: GalleryItem[];
};

export function GalleryBrowser({ items }: GalleryBrowserProps) {
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered =
    active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter gallery by category">
        {categories.map((c) => (
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setLightbox(item)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary text-left"
            aria-label={`Open ${item.title}`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-ice">
                {item.category}
              </span>
              <span className="mt-0.5 block text-sm font-medium text-white">
                {item.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No photos in this category yet — check back soon.
        </p>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy-deep/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-full max-w-4xl overflow-hidden rounded-xl bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={lightbox.image}
                alt={lightbox.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-ice">
                {lightbox.category}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-brand-heading">
                {lightbox.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {lightbox.description}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-secondary px-4 text-sm font-medium text-brand-heading hover:bg-brand-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
