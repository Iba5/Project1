"use client";

import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { RotatingWords } from "@/components/website/rotating-words";
import { AnimatedCounter } from "@/components/website/animated-counter";
import { Parallax } from "@/components/website/parallax";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type HeroStat = {
  label: string;
  value: string;
  numeric?: number;
};

type HeroSectionProps = {
  heroKicker: string;
  heroDescription: string;
  rotatingWords: string[];
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  stats: HeroStat[];
  ctaOne: string;
  ctaOneLink: string;
  ctaOneStyle: string;
  ctaTwo: string;
  ctaTwoLink: string;
  ctaTwoStyle: string;
  whatsappHref: string;
  heroImage: string;
  heroBadgeText?: string;
  heroBadgeLabel?: string;
  divisionsCount?: number;
  companyName: string;
  shortName: string;
};

/* ── Stagger variants ── */
const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

const heroImageVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASE,
      delay: 0.3,
    },
  },
};

export function HeroSection({
  heroKicker,
  heroDescription,
  rotatingWords,
  heroTitlePrefix,
  heroTitleSuffix,
  stats,
  ctaOne,
  ctaOneLink,
  ctaOneStyle,
  ctaTwo,
  ctaTwoLink,
  ctaTwoStyle,
  whatsappHref,
  heroImage,
  heroBadgeText,
  heroBadgeLabel,
  divisionsCount = 5,
  companyName,
  shortName,
}: HeroSectionProps) {
  const ctaOneIsWhatsapp = ctaOneStyle === "whatsapp" && Boolean(whatsappHref);
  const ctaOneHref = ctaOneIsWhatsapp ? whatsappHref : ctaOneStyle === "whatsapp" ? "#contact" : ctaOneLink;
  const ctaOneTarget = ctaOneIsWhatsapp ? "_blank" : undefined;
  const ctaOneRel = ctaOneIsWhatsapp ? "noopener noreferrer" : undefined;
  const ctaTwoIsWhatsapp = ctaTwoStyle === "whatsapp" && Boolean(whatsappHref);
  const ctaTwoHref = ctaTwoIsWhatsapp ? whatsappHref : ctaTwoStyle === "whatsapp" ? "#contact" : ctaTwoLink;
  const ctaTwoTarget = ctaTwoIsWhatsapp ? "_blank" : undefined;
  const ctaTwoRel = ctaTwoIsWhatsapp ? "noopener noreferrer" : undefined;

  return (
    <section id="home" className="relative overflow-hidden bg-background aurora-bg">
      {/* Decorative animated gradient blobs */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-ice/30 blur-3xl animate-pulse-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-brand-accent/20 blur-3xl animate-pulse-slow-delayed"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl animate-float"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 pattern-grid opacity-40"
        aria-hidden
      />
      {/* Animated gradient mesh overlay */}
      <div
        className="pointer-events-none absolute inset-0 gradient-mesh-animated opacity-30"
        aria-hidden
      />
      {/* Top gradient hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-24">
        {/* ── Hero text column with stagger ── */}
        <motion.div
          className="lg:col-span-7"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {/* Kicker */}
          <motion.p
            variants={heroItemVariants}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-accent-fg dark:text-brand-ice"
          >
            <span className="h-px w-6 bg-brand-accent-fg/40 dark:bg-brand-ice/40" aria-hidden />
            {heroKicker}
          </motion.p>

          {/* Title */}
          <motion.h1
            variants={heroItemVariants}
            className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-heading sm:text-5xl lg:text-6xl"
          >
            {heroTitlePrefix}{" "}
            <RotatingWords
              words={rotatingWords}
              className="font-display font-bold"
            />
            <br className="hidden sm:block" />
            {heroTitleSuffix}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={heroItemVariants}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {heroDescription}
          </motion.p>

          {/* CTA buttons with shimmer + pulse */}
          <motion.div
            variants={heroItemVariants}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href={ctaOneHref}
              target={ctaOneTarget}
              rel={ctaOneRel}
              className="cta-shimmer-sweep btn-ripple glow-ring cta-pulse-ring group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-brand-navy/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-brand-navy/30 hover:-translate-y-0.5"
            >
              <span>{ctaOne}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href={ctaTwoHref}
              target={ctaTwoTarget}
              rel={ctaTwoRel}
              className="btn-ripple btn-hover inline-flex h-12 items-center justify-center gap-2 rounded-md border border-primary/30 bg-secondary px-6 text-sm font-semibold text-brand-heading transition-all duration-300 hover:bg-brand-accent hover:text-brand-accent-fg hover:border-brand-accent hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
              {ctaTwo}
            </a>
          </motion.div>

          {/* Stats with AnimatedCounter */}
          {stats.length > 0 && (
            <motion.dl
              variants={heroItemVariants}
              className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6"
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="group/stat transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 font-display text-lg font-semibold text-brand-heading transition-colors duration-300",
                      i === 0 && "text-shimmer-sparkle",
                    )}
                  >
                    {stat.numeric ? (
                      <div className="flex items-baseline">
                        <AnimatedCounter value={stat.value} numeric={stat.numeric} />
                        {stat.value.replace(/[0-9]/g, "") && (
                          <span className="ml-0.5">
                            {stat.value.replace(/[0-9]/g, "")}
                          </span>
                        )}
                      </div>
                    ) : (
                      stat.value
                    )}
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </motion.div>

        {/* ── Hero image column with parallax ── */}
        <motion.div
          className="lg:col-span-5"
          variants={heroImageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <Parallax speed={0.12} max={40} className="relative">
            {/* Animated conic gradient ring — premium decorative accent */}
            <div
              className="conic-ring pointer-events-none absolute -inset-2 rounded-3xl opacity-20 blur-md"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-surface-strong shadow-2xl shadow-brand-navy/30 ring-1 ring-brand-navy/10">
              <Image
                src={heroImage}
                alt={`${companyName}: tools, hardware, fabrication, PPE, stationery and ice blocks`}
                fill
                priority
                loading="eager"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 via-transparent to-brand-navy/50" />
              {/* Decorative corner accent — division count */}
              <div className="animate-float glass-card-enhanced absolute right-4 top-4 flex flex-col items-center justify-center rounded-2xl px-3 py-2 shadow-soft" aria-hidden>
                <span className="font-display text-2xl font-bold leading-none text-white">{divisionsCount}</span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80">Divisions</span>
              </div>
              {heroBadgeText && (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="animate-badge-pulse glass-card-enhanced rounded-xl p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-ice">
                      {heroBadgeLabel ?? `Latest from ${shortName}`}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-white">
                      {heroBadgeText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Parallax>
        </motion.div>
      </div>
    </section>
  );
}
