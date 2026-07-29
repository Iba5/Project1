"use client";

import { Sparkles, Hammer, ShieldCheck, Snowflake, BookOpen, Factory } from "lucide-react";

const ITEMS = [
  { icon: Hammer, label: "Tools & Hardware" },
  { icon: Factory, label: "Fabrication" },
  { icon: ShieldCheck, label: "PPE & Safety" },
  { icon: BookOpen, label: "Stationery" },
  { icon: Snowflake, label: "Ice Blocks" },
  { icon: Sparkles, label: "Bulk Orders Welcome" },
  { icon: ShieldCheck, label: "Trusted Brands" },
  { icon: Factory, label: "Site Supply" },
];

export function MarqueeBar() {
  // Duplicate items for seamless infinite loop
  const items = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative overflow-hidden border-y border-border bg-brand-navy py-4"
      aria-hidden
    >
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-navy to-transparent" />

      <div className="marquee-track flex w-max items-center gap-10">
        {items.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2.5">
            <item.icon
              className="h-5 w-5 text-brand-ice/80"
              strokeWidth={1.75}
            />
            <span className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-brand-ice/90">
              {item.label}
            </span>
            <span className="ml-6 h-1 w-1 rounded-full bg-brand-accent/60" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
