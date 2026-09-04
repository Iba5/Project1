"use client";

import { useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/cms";
import { iconForDivision } from "@/lib/division-icon";

type Division = {
  code: string;
  name: string;
  description: string;
  icon: LucideIcon;
  details: string[];
};

const CODE_PREFIX_BY_KEYWORD: Array<{ match: RegExp; prefix: string }> = [
  { match: /ppe|safety|protect/i, prefix: "PPE" },
  { match: /station/i, prefix: "STA" },
  { match: /tool|hardware/i, prefix: "TLS" },
  { match: /fabricat/i, prefix: "FAB" },
  { match: /ice/i, prefix: "ICE" },
];

const iconFor = iconForDivision;

function codeFor(name: string, index: number): string {
  const prefix = CODE_PREFIX_BY_KEYWORD.find((e) => e.match.test(name))?.prefix ?? name.slice(0, 3).toUpperCase();
  return `${prefix}-0${index + 1}`;
}

type DivisionsGridProps = {
  categories: string[];
  products: Product[];
};

export function DivisionsGrid({ categories, products }: DivisionsGridProps) {
  const [expanded, setExpanded] = useState<string | null>(categories[categories.length - 1] ?? null);

  const divisions: Division[] = categories.map((name, i) => {
    const catProducts = products.filter((p) => p.category === name);
    const description = catProducts[0]?.shortDescription ?? "";
    const details =
      catProducts.length > 0
        ? catProducts.flatMap((p) => p.features?.slice(0, 2) ?? [p.shortDescription]).slice(0, 5)
        : [];
    return {
      code: codeFor(name, i),
      name,
      description,
      icon: iconFor(name),
      details,
    };
  });

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {divisions.map((division) => {
        const isOpen = expanded === division.name;
        const Icon = division.icon;
        return (
          <div
            key={division.name}
            className={cn(
              "flex flex-col rounded-xl border bg-card p-5 transition-colors",
              isOpen ? "border-brand-accent/60 ring-1 ring-brand-accent/30" : "border-border",
            )}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-accent">
                {division.code}
              </span>
              <span className="h-1.5 w-1.5 rounded-full border border-border" aria-hidden />
            </div>
            <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy text-brand-ice">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-brand-heading">
              {division.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {division.description}
            </p>
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : division.name)}
              className="mt-4 inline-flex items-center gap-1 self-start text-xs font-bold uppercase tracking-wider text-brand-heading"
              aria-expanded={isOpen}
            >
              {isOpen ? "Hide Details" : "View Details"}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && division.details.length > 0 && (
              <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                {division.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-accent" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
