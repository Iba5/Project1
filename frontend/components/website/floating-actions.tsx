"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

type FloatingActionsProps = {
  callHref: string;
  callDisplay: string;
  whatsappHref: string;
};

export function FloatingActions({ callHref, callDisplay, whatsappHref }: FloatingActionsProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hasCall = Boolean(callHref);
  const hasWhatsapp = Boolean(whatsappHref);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close expanded menu on Escape
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const trackCall = () => trackEvent("call_click", "fab_call", { number: callDisplay });
  const trackWhats = () => trackEvent("whatsapp_click", "fab_whatsapp", {});

  if (!hasCall && !hasWhatsapp) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5 transition-all duration-300 sm:bottom-6 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-hidden={!visible}
    >
      {/* Expanded contact options — slides up when toggled on mobile */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-2"
          >
            {hasCall && (
              <a
                href={callHref}
                onClick={trackCall}
                aria-label={`Call Canbri on ${callDisplay}`}
                className="flex h-11 items-center gap-2 rounded-full bg-primary pl-3.5 pr-4 text-sm font-medium text-white shadow-lg shadow-brand-navy/30 ring-1 ring-white/10 transition-transform hover:scale-[1.03]"
              >
                <Phone className="h-4 w-4" strokeWidth={2.25} />
                <span>Call Now</span>
              </a>
            )}
            {hasWhatsapp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhats}
                aria-label="Message Canbri on WhatsApp"
                className="flex h-11 items-center gap-2 rounded-full bg-[#25D366] pl-3.5 pr-4 text-sm font-semibold text-[#06351B] shadow-lg shadow-[#25D366]/30 ring-1 ring-white/10 transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                <span>WhatsApp Us</span>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: always show two pill buttons */}
      <div className="hidden sm:flex sm:flex-col sm:items-end sm:gap-2.5">
        {hasCall && (
          <a
            href={callHref}
            onClick={trackCall}
            aria-label={`Call Canbri on ${callDisplay}`}
            className="flex h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white shadow-lg shadow-brand-navy/30 transition-transform hover:scale-[1.03]"
          >
            <Phone className="h-4 w-4" strokeWidth={2.25} />
            <span>Call Now</span>
          </a>
        )}
        {hasWhatsapp && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhats}
            aria-label="Message Canbri on WhatsApp"
            className="flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-[#06351B] shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={2.5} fill="currentColor" />
            <span>WhatsApp Us</span>
          </a>
        )}
      </div>

      {/* Mobile: single toggle FAB that expands to show both options */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Close contact options" : "Open contact options"}
        aria-expanded={expanded}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#06351B] shadow-xl shadow-[#25D366]/40 ring-1 ring-white/10 transition-transform hover:scale-105 sm:hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {expanded ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="h-6 w-6" strokeWidth={2.5} fill="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
