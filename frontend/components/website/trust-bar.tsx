"use client";

import { Users, Truck, Award, Eye } from "lucide-react";
import { AnimatedCounter } from "@/components/website/animated-counter";
import { ScrollReveal } from "@/components/website/scroll-reveal";

type Stat = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  numeric: number;
  suffix: string;
  label: string;
  desc: string;
};

const stats: Stat[] = [
  { icon: Users, numeric: 500, suffix: "+", label: "Customers", desc: "Businesses & households" },
  { icon: Truck, numeric: 2, suffix: "", label: "Branches", desc: "Harare & Murewa" },
  { icon: Award, numeric: 5, suffix: "", label: "Divisions", desc: "Under one roof" },
  { icon: Eye, numeric: 100, suffix: "%", label: "Quote-Driven", desc: "Accurate pricing" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-border bg-gradient-to-r from-secondary/60 via-secondary/40 to-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ScrollReveal direction="none">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent text-brand-accent-fg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 sm:h-12 sm:w-12">
                  <stat.icon className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <div className="mt-2 sm:mt-0 sm:ml-3">
                  <div className="flex items-baseline justify-center font-display text-2xl font-bold text-brand-heading sm:text-3xl">
                    <AnimatedCounter numeric={stat.numeric} />
                    <span className="text-brand-accent-fg">{stat.suffix}</span>
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-brand-heading">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
