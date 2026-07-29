"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "canbri-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-md rounded-2xl border border-border bg-card/95 p-5 shadow-2xl shadow-brand-navy/20 backdrop-blur-md sm:bottom-6 sm:left-1/2 sm:right-auto sm:mx-0 sm:-translate-x-1/2"
          role="dialog"
          aria-label="Cookie consent"
        >
          <button
            onClick={decline}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-heading"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 pr-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-fg">
              <Cookie className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-heading">
                We value your privacy
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                We use cookies to improve your experience and analyse site traffic.{" "}
                <a href="#" className="font-medium text-brand-accent-fg underline hover:no-underline">
                  Learn more
                </a>
                .
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={decline} className="flex-1">
              Decline
            </Button>
            <Button size="sm" onClick={accept} className="flex-1">
              Accept
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
