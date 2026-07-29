"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Check } from "lucide-react";
import type { Product } from "@/lib/cms";
import { quoteWhatsAppHref } from "@/lib/cms";

type FeaturedSpotlightProps = {
  product: Product;
  whatsappNumber: string;
};

export function FeaturedSpotlight({ product, whatsappNumber }: FeaturedSpotlightProps) {
  const quoteHref = quoteWhatsAppHref(whatsappNumber, product.name);

  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-20">
      {/* Decorative gradient backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-brand-ice/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 shadow-xl"
        >
          <div className="grid lg:grid-cols-12">
            {/* Left — image with floating accents */}
            <div className="relative lg:col-span-7">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary lg:aspect-[16/12]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent lg:bg-gradient-to-r" />
              </div>

              {/* Floating badge — Featured */}
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 shadow-lg ring-1 ring-border backdrop-blur-sm">
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-heading">
                  Featured Division
                </span>
              </div>

              {/* Floating stat card */}
              <div className="absolute bottom-5 right-5 rounded-xl bg-background/95 p-4 shadow-xl ring-1 ring-border backdrop-blur-sm">
                <p className="font-display text-2xl font-bold text-brand-heading">
                  {product.minOrder ?? "Single"}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Min Order
                </p>
              </div>
            </div>

            {/* Right — content */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent-fg dark:text-brand-ice">
                <span className="h-px w-6 bg-brand-accent-fg/40 dark:bg-brand-ice/40" aria-hidden />
                Spotlight
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-heading sm:text-4xl">
                {product.name}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {product.longDescription ?? product.shortDescription}
              </p>

              {product.features && product.features.length > 0 && (
                <ul className="mt-6 grid gap-2.5">
                  {product.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-fg">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <a
                  href={quoteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-brand-navy/30 hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                  Get a Quote
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="#products"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-semibold text-brand-heading transition-colors hover:bg-secondary"
                >
                  All Products
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
