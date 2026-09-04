"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Package,
  ArrowRight,
} from "lucide-react";
import { useProductStore } from "@/lib/stores/product-store";
import { trackEvent } from "@/lib/analytics";
import { SmartImage } from "@/components/website/smart-image";
import { cn } from "@/lib/utils";

type QuoteCartDrawerProps = {
  whatsappNumber: string;
};

export function QuoteCartDrawer({ whatsappNumber }: QuoteCartDrawerProps) {
  const cart = useProductStore((s) => s.cart);
  const cartOpen = useProductStore((s) => s.cartOpen);
  const setCartOpen = useProductStore((s) => s.setCartOpen);
  const incrementCart = useProductStore((s) => s.incrementCart);
  const decrementCart = useProductStore((s) => s.decrementCart);
  const removeFromCart = useProductStore((s) => s.removeFromCart);
  const clearCart = useProductStore((s) => s.clearCart);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Body scroll lock when open
  useEffect(() => {
    if (cartOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setCartOpen(false);
      };
      window.addEventListener("keydown", onEsc);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onEsc);
      };
    }
  }, [cartOpen, setCartOpen]);

  // Build the combined WhatsApp message
  const buildWhatsAppHref = () => {
    const lines = cart.map(
      (i) => `• ${i.name} — ${i.quantity} unit${i.quantity > 1 ? "s" : ""} (${i.category})`,
    );
    const msg = [
      "Hello Canbri, I'd like to request a combined quote for the following items:",
      "",
      ...lines,
      "",
      "Please confirm pricing, availability and earliest delivery. Thank you!",
    ].join("\n");
    return `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  const handleSendQuote = () => {
    trackEvent("cart_submit", "combined_quote", {
      items: totalItems,
      products: cart.map((i) => i.slug).join(","),
    });
    window.open(buildWhatsAppHref(), "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-brand-navy/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
            role="dialog"
            aria-label="Quote cart"
          >
            {/* Header */}
            <div className="surface-navy band-top flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                  <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">
                    Quote Cart
                  </h2>
                  <p className="text-xs text-brand-ice/80">
                    {totalItems} item{totalItems === 1 ? "" : "s"} ready for combined quote
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-md text-brand-ice transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>

            {/* Body */}
            <div className="scrollbar-premium flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Package className="h-8 w-8" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-brand-heading">
                    Your quote cart is empty
                  </h3>
                  <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                    Browse the catalogue and tap <span className="font-semibold text-brand-accent-fg">Add to Quote Cart</span> on any product to build a combined quote request.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-5 inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary/90"
                  >
                    Browse products
                    <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item.slug}
                      className="relative flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-brand-accent/30"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-accent">
                              {item.category}
                            </p>
                            <h4 className="font-display text-sm font-semibold text-brand-heading">
                              {item.name}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              removeFromCart(item.slug);
                              trackEvent("cart_remove", item.name, { slug: item.slug });
                            }}
                            aria-label={`Remove ${item.name} from cart`}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          {/* Quantity stepper */}
                          <div className="inline-flex items-center rounded-md border border-border bg-background">
                            <button
                              type="button"
                              onClick={() => decrementCart(item.slug)}
                              aria-label={`Decrease ${item.name} quantity`}
                              className="flex h-8 w-8 items-center justify-center text-brand-heading transition-colors hover:bg-secondary"
                            >
                              <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              min={1}
                              onChange={(e) => {
                                const v = parseInt(e.target.value || "1", 10);
                                if (!isNaN(v)) {
                                  useProductStore.getState().updateCartQuantity(item.slug, v);
                                }
                              }}
                              aria-label={`${item.name} quantity`}
                              className="qty-input h-8 w-10 border-x border-border bg-transparent text-center text-sm font-semibold text-brand-heading focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => incrementCart(item.slug)}
                              aria-label={`Increase ${item.name} quantity`}
                              className="flex h-8 w-8 items-center justify-center text-brand-heading transition-colors hover:bg-secondary"
                            >
                              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </button>
                          </div>
                          {item.minOrder && (
                            <span className="text-[10px] text-muted-foreground">
                              Min: {item.minOrder}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border bg-secondary/40 px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {cart.length} product{cart.length === 1 ? "" : "s"} · {totalItems} unit{totalItems === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      cart.forEach((i) => trackEvent("cart_remove", i.name, { slug: i.slug }));
                      clearCart();
                    }}
                    className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-rose-500 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                {whatsappNumber ? (
                  <>
                    <a
                      href={buildWhatsAppHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleSendQuote}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#1ebe5b] hover:shadow-xl hover:shadow-[#25D366]/30 hover:-translate-y-0.5"
                    >
                      <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
                      Send combined quote via WhatsApp
                    </a>
                    <p className="mt-2 text-center text-[11px] text-muted-foreground">
                      Opens WhatsApp with all items pre-filled — just hit send.
                    </p>
                  </>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    WhatsApp quotes aren&apos;t available right now — please use the contact form instead.
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
