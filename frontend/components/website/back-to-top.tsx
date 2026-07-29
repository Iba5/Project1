"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Back-to-top button with circular scroll progress ring.
 * Replaces the basic version. The conic gradient ring fills as the user scrolls.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
      setScrollPct(pct);
      setVisible(y > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group fixed bottom-6 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-background text-brand-heading shadow-lg ring-1 ring-border transition-all hover:bg-brand-accent hover:text-brand-accent-fg hover:shadow-xl sm:left-6"
        >
          {/* Conic gradient scroll ring */}
          <span
            className="scroll-ring pointer-events-none absolute inset-0 rounded-full opacity-60"
            style={{ ["--scroll-pct" as string]: scrollPct }}
            aria-hidden
          />
          {/* Inner cutout to make the ring look like a ring, not a disc */}
          <span
            className="pointer-events-none absolute inset-[3px] rounded-full bg-background transition-colors group-hover:bg-brand-accent"
            aria-hidden
          />
          {/* Progress percentage label — visible on hover */}
          <span
            className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-[9px] font-bold text-brand-accent-fg opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            aria-hidden
          >
            {Math.round(scrollPct)}%
          </span>
          <ArrowUp
            className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
            strokeWidth={2.25}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
