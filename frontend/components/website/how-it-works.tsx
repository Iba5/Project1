"use client";

import { motion } from "framer-motion";
import { Search, MessageCircle, ClipboardCheck, Truck } from "lucide-react";
import { ScrollReveal } from "@/components/website/scroll-reveal";
import { SectionHeading } from "@/components/website/section-heading";

const steps = [
  {
    number: 1,
    title: "Browse Our Catalogue",
    description:
      "Explore our five divisions: tools, hardware, fabrication, PPE, stationery and ice.",
    icon: Search,
  },
  {
    number: 2,
    title: "Request a Quote",
    description:
      "Message us on WhatsApp, call, or fill in the form. We respond during business hours.",
    icon: MessageCircle,
  },
  {
    number: 3,
    title: "Confirm Your Order",
    description:
      "Review the quote, confirm quantities and delivery details, and we'll prepare your order.",
    icon: ClipboardCheck,
  },
  {
    number: 4,
    title: "Receive Your Delivery",
    description:
      "Scheduled delivery across Harare and Murewa, with cold-chain handling for ice.",
    icon: Truck,
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <ScrollReveal>
          <SectionHeading
            kicker="How It Works"
            numeral="04.5"
            title="From browsing to delivery — four simple steps."
            description="No complicated portals. Just a straightforward process designed for busy teams and households."
          />
        </ScrollReveal>

        <motion.div
          className="relative mt-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
        >
          {/* ── Desktop: horizontal timeline ── */}
          <div className="hidden md:grid md:grid-cols-4 md:gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  variants={itemVariants}
                >
                  {/* Connecting dotted line (between circles) */}
                  {!isLast && (
                    <div
                      className="absolute left-[calc(50%+28px)] top-[22px] z-0 h-0 w-[calc(100%-56px)] border-t-2 border-dashed border-brand-accent/30"
                      aria-hidden
                    />
                  )}

                  {/* Numbered circle */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-brand-accent-fg shadow-md transition-transform duration-300 group-hover:scale-110">
                    <span className="font-display text-lg font-bold">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent-fg transition-colors duration-300">
                    <Icon className="h-5 w-5" strokeWidth={2.25} />
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-base font-semibold text-brand-heading">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* ── Mobile: vertical timeline ── */}
          <div className="flex flex-col gap-0 md:hidden">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;

              return (
                <motion.div
                  key={step.number}
                  className="relative flex gap-5"
                  variants={itemVariants}
                >
                  {/* Left rail: circle + connecting line */}
                  <div className="flex flex-col items-center">
                    {/* Numbered circle */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-accent-fg shadow-md">
                      <span className="font-display text-base font-bold">
                        {step.number}
                      </span>
                    </div>

                    {/* Vertical dotted connector */}
                    {!isLast && (
                      <div className="h-full w-0 border-l-2 border-dashed border-brand-accent/30" />
                    )}
                  </div>

                  {/* Right content */}
                  <div className="group rounded-xl border border-border bg-card p-5 pb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-accent/40 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent-fg transition-colors duration-300">
                        <Icon className="h-4 w-4" strokeWidth={2.25} />
                      </div>
                      <h3 className="font-display text-base font-semibold text-brand-heading">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
