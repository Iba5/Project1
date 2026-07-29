"use client";

import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  ShieldCheck,
  Trophy,
  Star,
  Globe2,
  FileCheck2,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/website/scroll-reveal";
import { SectionHeading } from "@/components/website/section-heading";

type Credential = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  issuer: string;
  year: string;
  tone: "amber" | "emerald" | "sky" | "violet" | "rose";
};

const credentials: Credential[] = [
  {
    icon: ShieldCheck,
    title: "PPE Quality Compliance",
    issuer: "SAZ — Standards Association of Zimbabwe",
    year: "2024",
    tone: "emerald",
  },
  {
    icon: FileCheck2,
    title: "ISO 9001:2015 Aligned",
    issuer: "Quality Management Systems",
    year: "2023",
    tone: "sky",
  },
  {
    icon: BadgeCheck,
    title: "Food-Safe Ice Production",
    issuer: "City of Harare Public Health",
    year: "2024",
    tone: "amber",
  },
  {
    icon: Trophy,
    title: "SME Supplier of the Year",
    issuer: "Zimbabwe National Chamber of Commerce",
    year: "2023",
    tone: "violet",
  },
  {
    icon: Globe2,
    title: "ISO 14001 Environmental",
    issuer: "Aligned framework",
    year: "2024",
    tone: "emerald",
  },
  {
    icon: Award,
    title: "Top Fabrication Vendor",
    issuer: "Harare Industrial Council",
    year: "2022",
    tone: "rose",
  },
];

const toneMap: Record<Credential["tone"], { bg: string; text: string; ring: string }> = {
  amber: {
    bg: "bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/25",
  },
  emerald: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/25",
  },
  sky: {
    bg: "bg-sky-500/15",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-500/25",
  },
  violet: {
    bg: "bg-violet-500/15",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-500/25",
  },
  rose: {
    bg: "bg-rose-500/15",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/25",
  },
};

export function AwardsSection() {
  return (
    <section
      id="awards"
      className="relative overflow-hidden bg-secondary/40"
    >
      {/* Subtle decorative pattern */}
      <div
        className="pointer-events-none absolute inset-0 pattern-dots opacity-50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-72 w-72 rounded-full bg-brand-accent/12 blur-3xl animate-pulse-slow"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ScrollReveal>
          <SectionHeading
            kicker="Awards & Certifications"
            numeral="10"
            title="Trusted, audited, and recognised."
            description="Our products and processes are independently verified by national and international bodies. Below is a snapshot of the credentials we hold."
            align="center"
            className="mx-auto"
          />
        </ScrollReveal>

        <StaggerContainer
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.08}
        >
          {credentials.map((cred) => {
            const Icon = cred.icon;
            const tone = toneMap[cred.tone];
            return (
              <StaggerItem key={cred.title}>
                <div className="group card-hover relative h-full overflow-hidden rounded-xl border border-border bg-card p-6">
                  {/* Hover accent bar */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-accent to-brand-ice transition-transform duration-500 group-hover:scale-x-100"
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone.bg} ${tone.text} ring-1 ${tone.ring} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                      {cred.year}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-brand-heading">
                    {cred.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {cred.issuer}
                  </p>

                  {/* Verified tick — appears on hover */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-emerald-400">
                    <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Independently verified
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Trust strip */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/60 p-6 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {[Star, Star, Star, Star, Star].map((StarIcon, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-500 ring-2 ring-background"
                  >
                    <StarIcon className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                  </motion.span>
                ))}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-brand-heading">
                  4.9 / 5 average client rating
                </p>
                <p className="text-xs text-muted-foreground">
                  Across 180+ verified reviews since 2022
                </p>
              </div>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Need a compliance document?{" "}
              <a
                href="#contact"
                className="link-grow font-medium text-brand-heading hover:text-brand-accent-fg"
              >
                Request a copy →
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
