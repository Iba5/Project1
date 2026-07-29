"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";

const STORAGE_KEY = "canbri-promo-dismissed-v1";

type PromoBannerProps = {
  message?: string;
  href?: string;
  ctaLabel?: string;
};

/**
 * Dismissible top promo banner — pushes content down (not overlay).
 * Visibility is tracked in localStorage so dismissed state survives reloads.
 */
export function PromoBanner({
  message = "Free cold-chain delivery on bulk ice block orders over 50 units — Harare & Murewa.",
  href = "#contact",
  ctaLabel = "Request a quote",
}: PromoBannerProps) {
  const [visible, setVisible] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 overflow-hidden bg-gradient-to-r from-brand-navy via-brand-navy to-brand-navy-deep text-white"
        >
          {/* Aurora overlay for premium feel */}
          <div className="aurora-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
          <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 text-center sm:px-4">
            <Sparkles
              className="hidden h-4 w-4 shrink-0 text-brand-ice sm:block"
              strokeWidth={2.25}
              aria-hidden
            />
            <p className="flex-1 text-xs font-medium leading-relaxed sm:text-[13px]">
              {message}{" "}
              <a
                href={href}
                className="link-grow ml-1 inline-flex items-center gap-1 font-semibold text-brand-ice hover:text-white"
              >
                {ctaLabel}
                <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
              </a>
            </p>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss promo banner"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
