"use client";

import {
  MessageCircle,
  Eye,
  GitCompareArrows,
  Check,
  Heart,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/cms";
import { quoteWhatsAppHref } from "@/lib/cms";
import { useProductStore, toStoredProduct } from "@/lib/stores/product-store";
import { trackEvent } from "@/lib/analytics";
import { SmartImage } from "@/components/website/smart-image";
import { StarRating } from "@/components/website/star-rating";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  whatsappNumber: string;
  variant?: "default" | "wide";
  onQuickView?: (product: Product) => void;
};

export function ProductCard({ product, whatsappNumber, variant = "default", onQuickView }: ProductCardProps) {
  const quoteHref = quoteWhatsAppHref(whatsappNumber, product.name);
  const [imgLoaded, setImgLoaded] = useState(false);

  const toggleCompare = useProductStore((s) => s.toggleCompare);
  const compareList = useProductStore((s) => s.compare);
  const isInCompare = compareList.some((p) => p.slug === product.slug);

  const addToCart = useProductStore((s) => s.addToCart);
  const setCartOpen = useProductStore((s) => s.setCartOpen);
  const cart = useProductStore((s) => s.cart);
  const cartQty = cart.find((i) => i.slug === product.slug)?.quantity ?? 0;

  const toggleWishlist = useProductStore((s) => s.toggleWishlist);
  const wishlist = useProductStore((s) => s.wishlist);
  const isInWishlist = wishlist.some((p) => p.slug === product.slug);

  const handleQuickView = () => {
    trackEvent("product_quick_view", product.name, { slug: product.slug });
    onQuickView?.(product);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const willAdd = !isInCompare;
    const atMax = compareList.length >= 3;
    if (willAdd && atMax) {
      toast.warning("Compare list is full", {
        description: "Remove a product to add another. Max 3 at a time.",
        duration: 3000,
      });
      return;
    }
    toggleCompare(toStoredProduct(product));
    trackEvent(
      willAdd ? "product_compare_add" : "product_compare_remove",
      product.name,
      { slug: product.slug },
    );
    if (willAdd) {
      toast.success(`Added ${product.name} to compare`, {
        description: `${compareList.length + 1}/3 selected — click the tray to view.`,
        duration: 2500,
      });
    } else {
      toast.info(`Removed ${product.name} from compare`, {
        duration: 2000,
      });
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(toStoredProduct(product));
    trackEvent(
      !isInWishlist ? "wishlist_add" : "wishlist_remove",
      product.name,
      { slug: product.slug },
    );
    if (!isInWishlist) {
      toast.success(`Saved ${product.name} to wishlist`, { duration: 1800 });
    } else {
      toast.info(`Removed ${product.name} from wishlist`, { duration: 1500 });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(toStoredProduct(product), 1);
    trackEvent("cart_add", product.name, { slug: product.slug, qty: 1 });
    toast.success(`Added ${product.name} to quote cart`, {
      description: "Click the cart icon in the header to review your quote.",
      duration: 2500,
      action: {
        label: "View cart",
        onClick: () => setCartOpen(true),
      },
    });
  };

  const handleQuoteClick = () => {
    trackEvent("whatsapp_click", "product_quote", { product: product.name });
  };

  return (
    <article
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="card-glow card-border-gradient group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-accent/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
        <SmartImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            "object-cover group-hover:scale-105",
          )}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Spotlight overlay that follows mouse on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.18), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-brand-navy/0 transition-colors duration-300 group-hover:bg-brand-navy/20" />

        {/* Quick View button — appears on hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="absolute inset-0 flex items-center justify-center bg-brand-navy/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 hover:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-heading shadow-lg ring-1 ring-brand-navy/10 transition-transform duration-300 hover:scale-110">
              <Eye className="h-5 w-5" strokeWidth={2.25} />
            </span>
          </button>
        )}

        {product.placeholder && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-heading">
            Sample
          </span>
        )}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-heading shadow-sm backdrop-blur-sm">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          In Stock
        </span>

        {/* Top-right action cluster: wishlist + compare */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-pressed={isInWishlist}
            aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
              isInWishlist
                ? "bg-rose-500 text-white shadow-md ring-1 ring-rose-500"
                : "bg-background/90 text-brand-heading opacity-0 shadow-sm ring-1 ring-border group-hover:opacity-100 hover:bg-rose-500 hover:text-white",
            )}
          >
            <Heart
              className={cn("h-4 w-4", isInWishlist && "fill-current")}
              strokeWidth={2.25}
            />
          </button>
          <button
            type="button"
            onClick={handleCompareToggle}
            aria-pressed={isInCompare}
            aria-label={isInCompare ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200",
              isInCompare
                ? "bg-brand-accent text-brand-accent-fg shadow-md ring-1 ring-brand-accent"
                : "bg-background/90 text-brand-heading opacity-0 shadow-sm ring-1 ring-border group-hover:opacity-100 hover:bg-brand-accent hover:text-brand-accent-fg",
            )}
          >
            {isInCompare ? (
              <Check className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <GitCompareArrows className="h-4 w-4" strokeWidth={2.25} />
            )}
          </button>
        </div>

        {/* "In cart" indicator badge (only shows if already in cart) */}
        {cartQty > 0 && (
          <span className="animate-badge-bounce absolute left-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-brand-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-accent-fg shadow-md">
            <ShoppingCart className="h-3 w-3" strokeWidth={2.5} />
            {cartQty} in cart
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent-fg dark:text-brand-ice">
          <span className="h-px w-4 bg-brand-accent-fg/40 dark:bg-brand-ice/40" aria-hidden />
          {product.category}
        </p>
        <h3
          className={
            variant === "wide"
              ? "mt-2 font-display text-xl font-semibold text-brand-heading"
              : "mt-2 font-display text-lg font-semibold text-brand-heading"
          }
        >
          {product.name}
        </h3>

        {/* Star rating */}
        {product.rating !== undefined && (
          <div className="mt-1.5">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="sm"
            />
          </div>
        )}

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>

        {/* Quick facts row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {product.minOrder && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-brand-accent" aria-hidden />
              Min: {product.minOrder}
            </span>
          )}
          {product.leadTime && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-brand-accent" aria-hidden />
              {product.leadTime}
            </span>
          )}
        </div>

        {/* Action buttons: Add to cart + Details + Quote */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-shine inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-accent/40 bg-brand-accent/10 px-3 text-sm font-semibold text-brand-accent-fg transition-all duration-200 hover:bg-brand-accent hover:text-brand-accent-fg hover:border-brand-accent hover:shadow-md hover:shadow-brand-accent/20"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
            Add to Quote Cart
            {cartQty > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent-fg px-1.5 text-[10px] font-bold text-brand-accent">
                {cartQty}
              </span>
            )}
            <Plus className="h-3 w-3" strokeWidth={2.75} aria-hidden />
          </button>
          <div className="flex gap-2">
            {onQuickView && (
              <button
                type="button"
                onClick={handleQuickView}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-brand-heading transition-all duration-200 hover:bg-secondary hover:border-brand-accent/30"
              >
                <Eye className="h-4 w-4" strokeWidth={2.25} />
                Details
              </button>
            )}
            <a
              href={quoteHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleQuoteClick}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-brand-navy/20"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
              Quote
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
