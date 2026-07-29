"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompareArrows, X } from "lucide-react";
import { useProductStore } from "@/lib/stores/product-store";

/**
 * Floating tray that shows the compare count and opens the CompareDrawer.
 * Hidden when no products are selected or when the drawer is already open.
 */
export function CompareTray() {
  const compare = useProductStore((s) => s.compare);
  const setCompareOpen = useProductStore((s) => s.setCompareOpen);
  const compareOpen = useProductStore((s) => s.compareOpen);
  const clearCompare = useProductStore((s) => s.clearCompare);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const visible = mounted && compare.length > 0 && !compareOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-background/95 p-1.5 pl-3 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="flex items-center gap-2"
              aria-label={`Open compare drawer with ${compare.length} product${compare.length === 1 ? "" : "s"}`}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-brand-accent-fg">
                <GitCompareArrows className="h-4 w-4" strokeWidth={2.25} />
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-background">
                  {compare.length}
                </span>
              </span>
              <span className="text-xs font-semibold text-brand-heading">
                Compare ({compare.length}/3)
              </span>
            </button>
            <button
              type="button"
              onClick={clearCompare}
              aria-label="Clear compare list"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-heading"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
