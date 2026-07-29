"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/website/section-heading";
import { ScrollReveal } from "@/components/website/scroll-reveal";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const partners = [
  {
    name: "Bosch",
    description: "Power tools & accessories",
    initial: "B",
    color: "from-red-500/20 to-red-600/10",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Makita",
    description: "Professional power tools",
    initial: "M",
    color: "from-teal-500/20 to-teal-600/10",
    textColor: "text-teal-600 dark:text-teal-400",
  },
  {
    name: "3M",
    description: "Safety & PPE solutions",
    initial: "3",
    color: "from-red-500/20 to-red-600/10",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Stanley",
    description: "Hand tools & storage",
    initial: "S",
    color: "from-yellow-500/20 to-yellow-600/10",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    name: "Bostik",
    description: "Adhesives & sealants",
    initial: "B",
    color: "from-blue-500/20 to-blue-600/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "PPE Africa",
    description: "Protective equipment",
    initial: "P",
    color: "from-orange-500/20 to-orange-600/10",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Lyreco",
    description: "Office & stationery supplies",
    initial: "L",
    color: "from-emerald-500/20 to-emerald-600/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "DeWalt",
    description: "Power tools & outdoor equipment",
    initial: "D",
    color: "from-yellow-500/20 to-yellow-600/10",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PartnersSection() {
  return (
    <section
      id="partners"
      className="relative overflow-hidden bg-secondary/40"
    >
      {/* Subtle dot-grid background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      {/* Decorative gradient blobs */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl animate-pulse-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-brand-navy/10 blur-3xl animate-pulse-slow-delayed"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Section heading */}
        <ScrollReveal>
          <SectionHeading
            kicker="Our Partners & Brands"
            numeral="03.5"
            title="Trusted brands. Proven quality."
            description="We partner with world-leading suppliers so every product we deliver meets the highest standards of reliability and performance."
            align="center"
            className="mx-auto"
          />
        </ScrollReveal>

        {/* Partner cards grid */}
        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {partners.map((partner) => (
            <motion.article
              key={partner.name}
              variants={cardVariants}
              className="group relative flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-accent/40"
            >
              {/* Stylized initial letter in a circle */}
              <span
                className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${partner.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <span
                  className={`font-display text-xl font-bold ${partner.textColor}`}
                >
                  {partner.initial}
                </span>
              </span>

              {/* Brand name */}
              <h3 className="mt-4 font-display text-base font-semibold text-brand-heading">
                {partner.name}
              </h3>

              {/* Brief description */}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {partner.description}
              </p>

              {/* Hover accent bar at bottom */}
              <span
                className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-brand-accent transition-all duration-300 group-hover:w-12"
                aria-hidden
              />
            </motion.article>
          ))}
        </motion.div>

        {/* Subtle footer note */}
        <ScrollReveal delay={0.3}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            …and many more trusted suppliers across Zimbabwe and Southern Africa.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
