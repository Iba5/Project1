"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type SearchableProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
};

type SearchableIndustry = {
  slug: string;
  name: string;
  description: string;
};

type SearchableItem =
  | { kind: "product"; data: SearchableProduct }
  | { kind: "industry"; data: SearchableIndustry }
  | { kind: "section"; data: { slug: string; name: string; description: string } };

type SearchBarProps = {
  products: SearchableProduct[];
  industries: SearchableIndustry[];
  sections?: Array<{ slug: string; name: string; description: string }>;
  className?: string;
  /** When true, renders as a wider input with placeholder */
  variant?: "icon" | "expanded";
};

export function SearchBar({
  products,
  industries,
  sections = [],
  className,
  variant = "icon",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Index of searchable items
  const index: SearchableItem[] = useMemo(() => {
    const items: SearchableItem[] = [];
    products.forEach((p) => items.push({ kind: "product", data: p }));
    industries.forEach((i) => items.push({ kind: "industry", data: i }));
    sections.forEach((s) => items.push({ kind: "section", data: s }));
    return items;
  }, [products, industries, sections]);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((item) => {
        if (item.kind === "product") {
          return (
            item.data.name.toLowerCase().includes(q) ||
            item.data.category.toLowerCase().includes(q) ||
            item.data.shortDescription.toLowerCase().includes(q)
          );
        }
        return (
          item.data.name.toLowerCase().includes(q) ||
          item.data.description.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [query, index]);

  // Reset active index when results change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setActiveIndex(0), [query]);

  // Click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelect = (item: SearchableItem) => {
    trackEvent("search", query, {
      kind: item.kind,
      target: item.data.name,
    });

    if (item.kind === "product") {
      // Scroll to products section + open quick view via custom event
      const productsEl = document.getElementById("products");
      productsEl?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Dispatch a custom event that ProductFilter listens for
      window.dispatchEvent(
        new CustomEvent("canbri:open-quick-view", {
          detail: { slug: item.data.slug },
        }),
      );
    } else if (item.kind === "industry") {
      const el = document.getElementById("industries");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const el = document.getElementById(item.data.slug);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-border bg-background transition-all duration-200",
          open ? "ring-2 ring-brand-accent/40 border-brand-accent/40" : "hover:border-brand-accent/30",
          variant === "icon" ? "px-3 py-1.5" : "px-4 py-2.5",
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-muted-foreground",
            variant === "icon" ? "h-4 w-4" : "h-5 w-5",
          )}
          strokeWidth={2.25}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, industries…"
          aria-label="Search products and industries"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none",
            variant === "icon" ? "w-32 sm:w-40" : "w-full",
          )}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-heading"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        ) : (
          <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 w-[min(28rem,80vw)] max-h-[420px] overflow-y-auto rounded-xl border border-border bg-background p-1.5 shadow-2xl"
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm font-medium text-brand-heading">
                  No matches for &ldquo;{query}&rdquo;
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try searching for tools, PPE, ice, fabrication…
                </p>
              </div>
            ) : (
              <ul className="space-y-0.5" role="listbox">
                {results.map((item, idx) => (
                  <li key={`${item.kind}-${item.data.slug}`} role="option" aria-selected={idx === activeIndex}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                        idx === activeIndex ? "bg-secondary" : "hover:bg-secondary/60",
                      )}
                    >
                      {item.kind === "product" && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                          <Image
                            src={item.data.image}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      {item.kind === "industry" && (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-accent/20 text-brand-accent-fg">
                          <Search className="h-4 w-4" strokeWidth={2.25} />
                        </span>
                      )}
                      {item.kind === "section" && (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-brand-heading">
                          <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-brand-heading">
                            {item.data.name}
                          </p>
                          <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {item.kind}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {"shortDescription" in item.data ? item.data.shortDescription : item.data.description}
                        </p>
                      </div>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-1"
                        strokeWidth={2}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-1 border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
              <kbd className="rounded border border-border bg-secondary px-1 py-0.5">↑↓</kbd>{" "}
              navigate ·{" "}
              <kbd className="rounded border border-border bg-secondary px-1 py-0.5">↵</kbd>{" "}
              select ·{" "}
              <kbd className="rounded border border-border bg-secondary px-1 py-0.5">esc</kbd>{" "}
              close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
