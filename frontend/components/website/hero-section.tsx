"use client";

import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroSectionProps = {
  heroKicker: string;
  heroDescription: string;
  ctaOne: string;
  ctaOneLink: string;
  ctaOneStyle: string;
  whatsappHref: string;
  callHref: string;
  callDisplay: string;
  divisionsCount?: number;
};

const heroContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function HeroSection({
  heroKicker,
  heroDescription,
  ctaOne,
  ctaOneLink,
  ctaOneStyle,
  whatsappHref,
  callHref,
  callDisplay,
  divisionsCount = 5,
}: HeroSectionProps) {
  const ctaOneIsWhatsapp = ctaOneStyle === "whatsapp" && Boolean(whatsappHref);
  const ctaOneHref = ctaOneIsWhatsapp ? whatsappHref : ctaOneStyle === "whatsapp" ? "#contact" : ctaOneLink;

  return (
    <section id="home" className="relative overflow-hidden bg-[var(--brand-navy)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <motion.div
        className="relative mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={heroItemVariants}
          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent"
        >
          {heroKicker}
        </motion.p>

        <motion.p
          variants={heroItemVariants}
          className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/70"
        >
          Premium supply for <span className="text-white">fabrication.</span>
        </motion.p>

        <motion.h1
          variants={heroItemVariants}
          className="mt-4 font-display text-5xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Geared up.
          <br />
          Stocked up.
          <br />
          <span className="text-brand-ice">Iced down.</span>
        </motion.h1>

        <motion.p
          variants={heroItemVariants}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {heroDescription}
        </motion.p>

        <motion.div variants={heroItemVariants} className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={ctaOneHref}
            target={ctaOneIsWhatsapp ? "_blank" : undefined}
            rel={ctaOneIsWhatsapp ? "noopener noreferrer" : undefined}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-accent px-6 text-sm font-bold uppercase tracking-wide text-brand-accent-fg shadow-sm transition-colors hover:bg-brand-accent/90"
          >
            <span>{ctaOne}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          {callHref && (
            <a
              href={callHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <Phone className="h-4 w-4" strokeWidth={2.25} />
              {callDisplay}
            </a>
          )}
          <span className="inline-flex h-12 items-center justify-center rounded-full border border-dashed border-white/25 px-5 text-xs font-bold uppercase tracking-wider text-white/60">
            {divisionsCount} Divisions &middot; 1 Supplier
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
