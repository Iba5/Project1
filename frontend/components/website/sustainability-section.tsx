"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Recycle,
  Droplets,
  Sun,
  TrendingDown,
  Award,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/website/scroll-reveal";
import { AnimatedCounter } from "@/components/website/animated-counter";
import { SectionHeading } from "@/components/website/section-heading";

const initiatives = [
  {
    icon: Recycle,
    title: "Reusable Cold-Chain Packaging",
    description:
      "Our ice blocks ship in insulated, returnable containers — cutting single-use plastic waste by 80% compared to disposable alternatives.",
    accent: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: Droplets,
    title: "Water Stewardship",
    description:
      "We harvest and filter rainwater at our Murewa plant for ice production, reducing municipal water draw by over 1.2 million litres a year.",
    accent: "from-sky-500/20 to-cyan-500/10",
  },
  {
    icon: Sun,
    title: "Solar-Powered Cold Storage",
    description:
      "Photovoltaic arrays on our Harare warehouse roof supply 65% of the energy used by our cold-room facility during daylight hours.",
    accent: "from-amber-500/20 to-orange-500/10",
  },
];

const impactStats = [
  { value: "80", suffix: "%", label: "Less Plastic Waste", desc: "vs. disposable packaging" },
  { value: "1.2", suffix: "M L", label: "Rainwater Harvested", desc: "annually at Murewa" },
  { value: "65", suffix: "%", label: "Solar Energy Share", desc: "of cold-room power" },
  { value: "40", suffix: "%", label: "Lower Food Spoilage", desc: "for hospitality clients" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function SustainabilitySection() {
  return (
    <section
      id="sustainability"
      className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-background to-background"
    >
      {/* Decorative organic blobs */}
      <div
        className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-emerald-400/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"
        aria-hidden
      />
      {/* Top hairline gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ScrollReveal>
          <SectionHeading
            kicker="Sustainability & Impact"
            numeral="09"
            title="Cold chain with a conscience."
            description="Canbri's ice and cold-chain operations are built to keep goods fresh without warming the planet. Here is how we are reducing our footprint across Harare and Murewa."
          />
        </ScrollReveal>

        {/* Initiatives grid */}
        <StaggerContainer
          className="mt-12 grid gap-6 md:grid-cols-3"
          staggerDelay={0.12}
        >
          {initiatives.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <div className="group card-hover relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6">
                  {/* Gradient wash on hover */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 dark:text-emerald-400">
                      <Icon className="h-6 w-6" strokeWidth={2} />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-brand-heading">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Impact stats band */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.25} />
              <h3 className="font-display text-base font-semibold text-brand-heading">
                Measured impact, year on year
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {impactStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
                  className="group/stat relative"
                >
                  <div className="flex items-baseline font-display text-3xl font-bold text-brand-heading sm:text-4xl">
                    <AnimatedCounter
                      value={stat.value}
                      numeric={Number.parseFloat(stat.value)}
                    />
                    <span className="ml-0.5 text-emerald-600 dark:text-emerald-400">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-brand-heading">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Pledge footer */}
        <ScrollReveal delay={0.15}>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                <Leaf className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-brand-heading">
                  Our 2026 pledge
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Carbon-neutral cold-chain deliveries across both branches, with a
                  full electric-vehicle pilot launching in Q3.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-brand-heading px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-heading/90 hover:gap-3"
            >
              Partner with us
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.25} />
            </a>
          </div>
        </ScrollReveal>

        {/* Tiny badge row */}
        <ScrollReveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              EMA Zimbabwe compliant
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ISO 14001 aligned
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Recycle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Circular packaging member
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
