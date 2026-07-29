"use client";

import { motion } from "framer-motion";
import { Truck, MapPin, Clock, Snowflake, Thermometer, CalendarCheck } from "lucide-react";
import { SectionHeading } from "@/components/website/section-heading";
import { AnimatedCounter } from "@/components/website/animated-counter";
import { ScrollReveal } from "@/components/website/scroll-reveal";

/* ── Data ─────────────────────────────────────────────────────────── */

const stats = [
  {
    icon: CalendarCheck,
    value: "5 Days/Week",
    label: "Scheduled delivery routes",
    numeric: 5,
  },
  {
    icon: MapPin,
    value: "2 Cities",
    label: "Harare & Murewa",
    numeric: 2,
  },
  {
    icon: Clock,
    value: "Same Day",
    label: "Available for ice products",
  },
  {
    icon: Snowflake,
    value: "Cold Chain",
    label: "For ice & perishable goods",
  },
];

const features = [
  {
    icon: Truck,
    text: "Scheduled delivery routes across Harare and Murewa",
  },
  {
    icon: Thermometer,
    text: "Cold-chain handling for ice products",
  },
  {
    icon: CalendarCheck,
    text: "Saturday delivery available by arrangement",
  },
  {
    icon: Clock,
    text: "Bulk and recurring orders on standing delivery schedules",
  },
];

/* Stylized map area nodes */
const mapAreas = [
  { name: "Harare", x: "38%", y: "42%", size: "lg", label: "Main Hub" },
  { name: "Murewa", x: "72%", y: "34%", size: "md", label: "Branch" },
  { name: "Domboshawa", x: "48%", y: "22%", size: "sm", label: "Route Stop" },
  { name: "Goromonzi", x: "62%", y: "50%", size: "sm", label: "Route Stop" },
  { name: "Ruwa", x: "52%", y: "58%", size: "sm", label: "Route Stop" },
  { name: "Chitungwiza", x: "32%", y: "62%", size: "sm", label: "Route Stop" },
];

/* ── Animation Variants ───────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const mapNodeVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

/* ── Component ────────────────────────────────────────────────────── */

export function DeliveryAreas() {
  return (
    <section className="relative overflow-hidden bg-secondary/40 py-20 lg:py-24">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 pattern-grid opacity-[0.04]" />
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-brand-navy/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <ScrollReveal>
          <SectionHeading
            kicker="Delivery Coverage"
            title="Reliable Delivery Across Zimbabwe"
            description="From our main hub in Harare to our Murewa branch, we ensure your products arrive on time and in perfect condition — especially for temperature-sensitive goods."
            numeral="07.5"
          />
        </ScrollReveal>

        {/* Main grid: Map + Stats */}
        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ── Visual Map ─────────────────────────────────────────── */}
          <ScrollReveal direction="left" className="lg:col-span-5">
            <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-display text-lg font-semibold text-brand-heading">
                Delivery Network
              </h3>

              {/* Stylized map container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-brand-navy/5 to-brand-accent/5">
                {/* Decorative grid lines */}
                <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                  {/* Horizontal guide lines */}
                  {[20, 40, 60, 80].map((pct) => (
                    <line
                      key={`h-${pct}`}
                      x1="0"
                      y1={`${pct}%`}
                      x2="100%"
                      y2={`${pct}%`}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-brand-navy/10"
                    />
                  ))}
                  {/* Vertical guide lines */}
                  {[25, 50, 75].map((pct) => (
                    <line
                      key={`v-${pct}`}
                      x1={`${pct}%`}
                      y1="0"
                      x2={`${pct}%`}
                      y2="100%"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-brand-navy/10"
                    />
                  ))}
                  {/* Route lines connecting Harare to other points */}
                  <line x1="38%" y1="42%" x2="72%" y2="34%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 4" className="text-brand-accent/40" />
                  <line x1="38%" y1="42%" x2="48%" y2="22%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-brand-accent/25" />
                  <line x1="38%" y1="42%" x2="62%" y2="50%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-brand-accent/25" />
                  <line x1="38%" y1="42%" x2="52%" y2="58%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-brand-accent/25" />
                  <line x1="38%" y1="42%" x2="32%" y2="62%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-brand-accent/25" />
                </svg>

                {/* Map nodes */}
                {mapAreas.map((area, i) => (
                  <motion.div
                    key={area.name}
                    className="absolute flex flex-col items-center"
                    style={{ left: area.x, top: area.y, transform: "translate(-50%, -50%)" }}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={mapNodeVariants}
                  >
                    {/* Pulse ring for main hubs */}
                    {area.size !== "sm" && (
                      <span
                        className={`absolute rounded-full ${
                          area.size === "lg"
                            ? "h-12 w-12 animate-ping bg-brand-accent/20"
                            : "h-9 w-9 animate-ping bg-brand-accent/15"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {/* Dot */}
                    <span
                      className={`relative z-10 rounded-full border-2 border-white shadow-md ${
                        area.size === "lg"
                          ? "h-5 w-5 bg-brand-accent"
                          : area.size === "md"
                            ? "h-4 w-4 bg-brand-accent/80"
                            : "h-2.5 w-2.5 bg-brand-navy/60"
                      }`}
                    />
                    {/* Label */}
                    <span
                      className={`mt-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold leading-tight shadow-sm ${
                        area.size === "lg"
                          ? "bg-brand-accent text-brand-accent-fg"
                          : area.size === "md"
                            ? "bg-brand-accent/90 text-brand-accent-fg"
                            : "bg-white/90 text-brand-navy/70 dark:bg-brand-navy/80 dark:text-white/70"
                      }`}
                    >
                      {area.name}
                    </span>
                    {area.size !== "sm" && (
                      <span className="mt-0.5 text-[8px] text-muted-foreground">{area.label}</span>
                    )}
                  </motion.div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-2 left-2 flex items-center gap-3 rounded bg-white/80 px-2 py-1 text-[9px] text-brand-navy/60 dark:bg-brand-navy/80 dark:text-white/50">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full bg-brand-accent" />
                    Hub
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-navy/60" />
                    Stop
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-0 w-3 border-t border-dashed border-brand-accent/40" />
                    Route
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Stats + Features ───────────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* Stat cards */}
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={cardVariants}
                    className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-accent/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent-fg transition-colors group-hover:bg-brand-accent group-hover:text-brand-accent-fg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-xl font-bold text-brand-heading">
                          {stat.numeric ? (
                            <AnimatedCounter value={stat.value} numeric={stat.numeric} />
                          ) : (
                            <AnimatedCounter value={stat.value} />
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Feature list */}
            <motion.div
              className="mt-8 space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <h3 className="font-display text-lg font-semibold text-brand-heading">
                Delivery Features
              </h3>
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.text}
                    variants={featureVariants}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/50 p-3 transition-all duration-300 hover:border-brand-accent/30 hover:bg-card"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-accent/10 text-brand-accent-fg">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-muted-foreground">
                      {feat.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
