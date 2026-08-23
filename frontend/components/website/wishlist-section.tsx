"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingCart, X, Eye } from "lucide-react";
import { useProductStore } from "@/lib/stores/product-store";
import { SmartImage } from "@/components/website/smart-image";
import { trackEvent } from "@/lib/analytics";

/**
 * Wishlist section — appears below Recently Viewed when the user has saved
 * any products to their wishlist. Hidden when empty.
 */
export function WishlistSection() {
  const wishlist = useProductStore((s) => s.wishlist);
  const removeFromWishlist = useProductStore((s) => s.removeFromWishlist);
  const addToCart = useProductStore((s) => s.addToCart);
  const setCartOpen = useProductStore((s) => s.setCartOpen);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted || wishlist.length === 0) return null;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent-fg dark:text-brand-ice">
              <span className="h-px w-6 bg-brand-accent-fg/40 dark:bg-brand-ice/40" aria-hidden />
              Saved for later
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-brand-heading sm:text-3xl">
              Your wishlist
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {wishlist.length} product{wishlist.length === 1 ? "" : "s"} you have saved.
            </p>
          </div>
          <span className="hidden h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 sm:flex">
            <Heart className="h-6 w-6 fill-current" strokeWidth={2.25} />
          </span>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {wishlist.map((item) => (
              <motion.li
                key={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeFromWishlist(item.slug);
                      trackEvent("wishlist_remove", item.name, { slug: item.slug });
                    }}
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-rose-500 shadow-sm ring-1 ring-border backdrop-blur-sm transition-all hover:bg-rose-500 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent-fg dark:text-brand-ice">
                    {item.category}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-brand-heading">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.shortDescription}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item, 1);
                        trackEvent("cart_add", item.name, { slug: item.slug, qty: 1, source: "wishlist" });
                        setCartOpen(true);
                      }}
                      className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-brand-accent px-3 text-xs font-semibold text-brand-accent-fg transition-all hover:bg-brand-accent/90"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Add to cart
                    </button>
                    <a
                      href={`#products`}
                      aria-label={`View ${item.name} in products`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-brand-heading transition-colors hover:bg-secondary"
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={2.25} />
                    </a>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              wishlist.forEach((i) => trackEvent("wishlist_remove", i.name, { slug: i.slug }));
              useProductStore.getState().clearWishlist();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-rose-500 hover:underline"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
            Clear wishlist
          </button>
        </div>
      </div>
    </section>
  );
}
