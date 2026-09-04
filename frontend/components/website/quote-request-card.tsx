"use client";

import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/cms";
import { useProductStore, toStoredProduct } from "@/lib/stores/product-store";
import { trackEvent } from "@/lib/analytics";
import { iconForDivision } from "@/lib/division-icon";
import { cn } from "@/lib/utils";

type QuoteRequestCardProps = {
  product: Product;
};

export function QuoteRequestCard({ product }: QuoteRequestCardProps) {
  const Icon = iconForDivision(product.category);

  const addToCart = useProductStore((s) => s.addToCart);
  const setCartOpen = useProductStore((s) => s.setCartOpen);
  const cart = useProductStore((s) => s.cart);
  const cartQty = cart.find((i) => i.slug === product.slug)?.quantity ?? 0;

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

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-hover flex flex-col rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy text-white">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          Available
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
        {product.category}
      </p>
      <h3 className="mt-1 font-display text-base font-semibold text-brand-heading">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>

      <button
        type="button"
        onClick={handleAddToCart}
        className={cn(
          "mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-accent px-3 text-sm font-semibold text-brand-accent-fg transition-colors hover:bg-brand-accent/90",
        )}
      >
        <ShoppingCart className="h-4 w-4" strokeWidth={2.25} />
        Add to Quote
        {cartQty > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent-fg px-1.5 text-[10px] font-bold text-brand-accent">
            {cartQty}
          </span>
        )}
        <Plus className="h-3 w-3" strokeWidth={2.75} aria-hidden />
      </button>
    </Link>
  );
}
