"use client";

import Link from "next/link";
import { ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/cms";
import { useProductStore, toStoredProduct } from "@/lib/stores/product-store";
import { trackEvent } from "@/lib/analytics";

type ProductListRowProps = {
  product: Product;
};

export function ProductListRow({ product }: ProductListRowProps) {
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
      className="group flex items-center gap-4 border-b border-border py-4 transition-colors hover:bg-secondary/40"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
          {product.category}
        </p>
        <p className="mt-0.5 truncate font-display text-base font-semibold text-brand-heading">
          {product.name}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-brand-accent px-3 text-xs font-semibold text-brand-accent-fg transition-colors hover:bg-brand-accent/90"
      >
        <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.25} />
        Add to Quote
        {cartQty > 0 && (
          <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent-fg px-1 text-[9px] font-bold text-brand-accent">
            {cartQty}
          </span>
        )}
        <Plus className="h-3 w-3" strokeWidth={2.75} aria-hidden />
      </button>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
    </Link>
  );
}
