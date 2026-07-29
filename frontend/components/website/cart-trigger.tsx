"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "@/lib/stores/product-store";
import { cn } from "@/lib/utils";

/**
 * Cart trigger button — shown in the header.
 * Renders a shopping-cart icon with a live count badge.
 */
export function CartTrigger({ className }: { className?: string }) {
  const setCartOpen = useProductStore((s) => s.setCartOpen);
  const cart = useProductStore((s) => s.cart);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const [mounted, setMounted] = useState(false);
  const [bumped, setBumped] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);

  // Bump the badge whenever total increases
  const [prev, setPrev] = useState(totalItems);
  useEffect(() => {
    if (!mounted) return;
    if (totalItems > prev) {
      setBumped(true);
      const t = setTimeout(() => setBumped(false), 450);
      setPrev(totalItems);
      return () => clearTimeout(t);
    }
    setPrev(totalItems);
  }, [totalItems, mounted, prev]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={`Open quote cart${mounted && totalItems > 0 ? `, ${totalItems} item${totalItems === 1 ? "" : "s"}` : ""}`}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-heading transition-colors hover:bg-secondary",
        className,
      )}
    >
      <ShoppingCart className="h-5 w-5" strokeWidth={2.25} />
      <AnimatePresence>
        {mounted && totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-brand-accent-fg ring-2 ring-background",
              bumped && "animate-badge-bounce",
            )}
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
