import Image from "next/image";
import { MessageCircle, ArrowRight, Check, ImageOff } from "lucide-react";
import type { Product } from "@/lib/cms";
import { quoteWhatsAppHref } from "@/lib/cms";

type FeaturedSpotlightProps = {
  products: Product[];
  whatsappNumber: string;
};

/** Shows every featured division's spotlight card at once — no carousel, no rotation. */
export function FeaturedSpotlight({ products, whatsappNumber }: FeaturedSpotlightProps) {
  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-brand-ice/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {products.map((product) => {
            const quoteHref = quoteWhatsAppHref(whatsappNumber, product.name);
            return (
              <div
                key={product.slug}
                className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 shadow-xl"
              >
                <div className="grid sm:grid-cols-12">
                  {/* Image */}
                  <div className="relative sm:col-span-5">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-navy sm:aspect-auto sm:h-full">
                      {product.placeholder ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
                          <ImageOff className="h-8 w-8 text-brand-ice/70" strokeWidth={1.75} />
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                            Photo not available yet
                          </p>
                        </div>
                      ) : (
                        <>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(min-width: 640px) 40vw, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent sm:bg-gradient-to-r" />
                        </>
                      )}
                    </div>

                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/95 px-3 py-1.5 shadow-lg ring-1 ring-border backdrop-blur-sm">
                      <span className="flex h-2 w-2">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand-accent opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-heading">
                        Featured Division
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-6 sm:col-span-7 sm:p-8">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent">
                      <span className="h-px w-6 bg-brand-accent/50" aria-hidden />
                      Spotlight
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-brand-heading">
                      {product.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {product.longDescription ?? product.shortDescription}
                    </p>

                    {product.features && product.features.length > 0 && (
                      <ul className="mt-4 grid gap-2">
                        {product.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-fg">
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            </span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <a
                        href={quoteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-accent px-5 text-sm font-semibold text-brand-accent-fg transition-colors hover:bg-brand-accent/90"
                      >
                        <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                        Get a Quote
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </a>
                      <a
                        href="#products"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-semibold text-brand-heading transition-colors hover:bg-secondary"
                      >
                        All Products
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
