"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  Bookmark,
  TrendingUp,
  Wrench,
  Snowflake,
  HardHat,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/website/scroll-reveal";
import { SectionHeading } from "@/components/website/section-heading";

type Resource = {
  category: string;
  categoryIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  featured?: boolean;
  accent: string;
};

const resources: Resource[] = [
  {
    category: "Fabrication",
    categoryIcon: Wrench,
    title: "Choosing the right steel grade for outdoor fabrication in Zimbabwe",
    excerpt:
      "A practical guide to selecting between mild steel, galvanised and stainless for gates, burglar bars and structural work — with notes on corrosion resistance and cost trade-offs.",
    readTime: "6 min read",
    date: "Mar 14, 2026",
    featured: true,
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    category: "Cold Chain",
    categoryIcon: Snowflake,
    title: "How long do ice blocks last? A field guide for vendors",
    excerpt:
      "Storage times, insulation tips and melt rates for 5kg and 10kg blocks in Harare summer conditions.",
    readTime: "4 min read",
    date: "Mar 02, 2026",
    accent: "from-sky-500/20 to-cyan-500/10",
  },
  {
    category: "Site Safety",
    categoryIcon: HardHat,
    title: "PPE checklist for construction sites in 2026",
    excerpt:
      "The minimum safety kit every crew should carry, with notes on local compliance and common gaps.",
    readTime: "5 min read",
    date: "Feb 21, 2026",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    category: "Business",
    categoryIcon: TrendingUp,
    title: "Bulk ordering: how to plan a 30-day supply run",
    excerpt:
      "A simple framework for estimating quantities across five divisions — with a downloadable checklist.",
    readTime: "7 min read",
    date: "Feb 09, 2026",
    accent: "from-violet-500/20 to-purple-500/10",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function BlogSection() {
  const [featured, ...rest] = resources;

  return (
    <section
      id="resources"
      className="relative overflow-hidden bg-secondary/40"
    >
      <div
        className="pointer-events-none absolute inset-0 pattern-dots opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl animate-pulse-slow"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              kicker="Resources & Insights"
              numeral="12"
              title="Practical guides from the field."
              description="Short, useful reads from our team — covering fabrication, cold chain, safety and supply planning."
              className="max-w-2xl"
            />
            <a
              href="#resources"
              className="group inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-brand-heading transition-all hover:border-brand-accent hover:bg-brand-accent hover:text-brand-accent-fg hover:gap-3"
            >
              View all articles
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.25} />
            </a>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Featured article */}
          <ScrollReveal direction="left" className="lg:col-span-7">
            <motion.a
              href="#resources"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Visual header */}
              <div className="relative h-56 overflow-hidden sm:h-64">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${featured.accent}`}
                  aria-hidden
                />
                {/* Grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(15,31,51,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,31,51,0.4) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                  aria-hidden
                />
                {/* Large faded icon */}
                <featured.categoryIcon
                  className="absolute -right-6 -top-6 h-40 w-40 text-brand-heading/10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
                  strokeWidth={1}
                />
                {/* Featured badge */}
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand-heading/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <Bookmark className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                  Featured
                </div>
                {/* Category pill */}
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-heading backdrop-blur-sm">
                  <featured.categoryIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {featured.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{featured.date}</span>
                  <span className="h-3 w-px bg-border" aria-hidden />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={2.25} />
                    {featured.readTime}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold leading-tight text-brand-heading transition-colors group-hover:text-brand-accent-fg sm:text-2xl">
                  {featured.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {featured.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-heading transition-all group-hover:gap-2.5">
                  Read article
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
                </div>
              </div>
            </motion.a>
          </ScrollReveal>

          {/* Smaller articles list */}
          <StaggerContainer
            className="flex flex-col gap-4 lg:col-span-5"
            staggerDelay={0.1}
          >
            {rest.map((item) => {
              const Icon = item.categoryIcon;
              return (
                <StaggerItem key={item.title} className="flex-1">
                  <motion.a
                    href="#resources"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="group flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-accent/40"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent} text-brand-heading ring-1 ring-border transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-brand-accent-fg dark:text-brand-ice">
                          {item.category}
                        </span>
                        <span className="h-3 w-px bg-border" aria-hidden />
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" strokeWidth={2.25} />
                          {item.readTime}
                        </span>
                      </div>
                      <h4 className="mt-1.5 font-display text-sm font-semibold leading-snug text-brand-heading transition-colors group-hover:text-brand-accent-fg">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {item.excerpt}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-heading"
                      strokeWidth={2.25}
                    />
                  </motion.a>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Topic tags */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Browse by topic:
            </span>
            {[
              "Fabrication",
              "Cold Chain",
              "PPE & Safety",
              "Tools",
              "Stationery",
              "Bulk Orders",
              "Delivery",
            ].map((tag) => (
              <a
                key={tag}
                href="#resources"
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-brand-accent hover:bg-brand-accent hover:text-brand-accent-fg"
              >
                {tag}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
