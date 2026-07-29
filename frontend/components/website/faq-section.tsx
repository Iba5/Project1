"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type FaqCategory =
  | "Ordering"
  | "Delivery"
  | "Pricing"
  | "General"
  | "Events"
  | "Fabrication"
  | "Schools"
  | "PPE";

type FaqItem = {
  question: string;
  answer: string;
  category: FaqCategory;
};

const faqItems: FaqItem[] = [
  {
    question: "How do I request a quote?",
    category: "Ordering",
    answer:
      "The fastest way is WhatsApp — message us with what you need (product, quantity, delivery location) and we'll respond during business hours. You can also call us, email, or fill in the contact form on this page. We quote by request because pricing depends on quantity, location and whether it's a recurring order.",
  },
  {
    question: "Do you deliver across Harare and Murewa?",
    category: "Delivery",
    answer:
      "Yes. We run scheduled delivery routes across Harare and Murewa five days a week, with Saturday delivery available by arrangement. Cold-chain handling for ice products is built into our logistics. Bulk and recurring orders can be set up on standing delivery schedules.",
  },
  {
    question: "Can I order in bulk or on a recurring schedule?",
    category: "Ordering",
    answer:
      "Absolutely. Bulk orders and recurring supply are welcome across every division — tools and hardware, fabrication, PPE, stationery and ice blocks. Many of our business customers run weekly or monthly standing orders. Bulk pricing applies and we can accommodate seasonal or event-based spikes.",
  },
  {
    question: "What industries do you supply?",
    category: "General",
    answer:
      "We supply construction and contracting, restaurants and hotels, retail and supermarkets, manufacturing and fabrication, events and catering, fisheries and cold chain, schools and offices, and households. If your sector isn't listed, reach out — we're adding new customers all the time.",
  },
  {
    question: "Why don't you publish prices online?",
    category: "Pricing",
    answer:
      "Because pricing depends on quantity, delivery location, and whether it's a one-off or a recurring order. A single hammer costs differently from a case of hammers delivered to a site weekly. We prefer to quote accurately rather than publish ballpark figures that might mislead.",
  },
  {
    question: "What is your return or exchange policy?",
    category: "General",
    answer:
      "If a product is defective or doesn't match what was quoted, we'll exchange it or arrange a refund. Because we quote by request, the product you receive should match the specification we agreed on. Contact us on WhatsApp, phone or email and we'll sort it out promptly.",
  },
  {
    question: "Do you supply ice blocks for events?",
    category: "Events",
    answer:
      "Yes — we supply ice blocks in bulk for events, weddings, outdoor functions and catering. We can deliver directly to your venue on the day, and we handle cold-chain logistics so the ice arrives in top condition. For large events, we recommend ordering at least 48 hours in advance to guarantee availability.",
  },
  {
    question: "What fabrication services do you offer?",
    category: "Fabrication",
    answer:
      "Our fabrication workshop produces gates, window frames, door frames, brackets, and structural steelwork to your specifications. We work with mild steel, stainless steel and aluminium. Whether you need a one-off custom piece or a production run, we can fabricate, weld, and finish to your requirements.",
  },
  {
    question: "Can schools set up standing orders for stationery?",
    category: "Schools",
    answer:
      "Absolutely. Many schools and educational institutions run standing orders with us for stationery, cleaning supplies and PPE. We can deliver on a weekly, monthly or termly schedule, and we offer bulk pricing for schools. Contact us to set up a recurring order that matches your academic calendar.",
  },
  {
    question: "What PPE do you stock?",
    category: "PPE",
    answer:
      "We carry a full range of personal protective equipment: hard hats, safety goggles, face shields, ear protection, dust masks and respirators, safety gloves (cut-resistant, chemical-resistant, general-purpose), high-visibility vests, safety boots and shoes, and coveralls. We can supply individual items or full PPE kits for your team.",
  },
  {
    question: "How quickly can you deliver ice blocks?",
    category: "Delivery",
    answer:
      "For ice blocks, we offer same-day delivery within Harare when orders are placed before 10 AM, and next-day delivery for orders placed later in the day. For Murewa and surrounding areas, delivery is typically next business day. Urgent or large-volume orders can be accommodated — just give us a call and we'll do our best.",
  },
  {
    question: "Do you offer credit terms for businesses?",
    category: "Pricing",
    answer:
      "Yes, we offer credit terms for established business customers. Credit accounts are subject to approval and typically come with 30-day payment terms. We also support EFT, mobile money and cash payments. To apply for a credit account, contact our team and we'll set up an assessment promptly.",
  },
];

const allCategories: FaqCategory[] = [
  "Ordering",
  "Delivery",
  "Pricing",
  "General",
  "Events",
  "Fabrication",
  "Schools",
  "PPE",
];

const categoryColors: Record<FaqCategory, string> = {
  Ordering: "bg-brand-accent text-brand-accent-fg",
  Delivery: "bg-brand-accent text-brand-accent-fg",
  Pricing: "bg-brand-accent text-brand-accent-fg",
  General: "bg-brand-accent text-brand-accent-fg",
  Events: "bg-brand-accent text-brand-accent-fg",
  Fabrication: "bg-brand-accent text-brand-accent-fg",
  Schools: "bg-brand-accent text-brand-accent-fg",
  PPE: "bg-brand-accent text-brand-accent-fg",
};

export function FaqSection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "All">(
    "All"
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        q === "" ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="relative">
      {/* Subtle background decorative element */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-brand-accent/5 blur-3xl" />

      {/* Search input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative mb-6"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl border-border bg-card h-11 transition-all duration-300 focus-visible:border-brand-accent"
          aria-label="Search frequently asked questions"
        />
      </motion.div>

      {/* Category filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        <button
          onClick={() => setActiveCategory("All")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
            activeCategory === "All"
              ? "bg-brand-surface-strong text-brand-surface-strong-fg shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-brand-surface-strong text-brand-surface-strong-fg shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* FAQ items */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filtered.map((item, i) => (
              <motion.div
                key={`${item.question}-${item.category}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`faq-${i}-${item.category}`}
                  className="border-border rounded-xl mb-2 border bg-card px-4 transition-all duration-300 hover:shadow-sm"
                >
                  <AccordionTrigger className="text-sm font-medium text-brand-heading hover:text-brand-heading hover:no-underline py-4">
                    <span className="flex flex-col gap-2 text-left sm:flex-row sm:items-center sm:gap-3">
                      <Badge
                        className={`${categoryColors[item.category]} shrink-0 rounded-md text-[10px] font-semibold uppercase tracking-wide`}
                      >
                        {item.category}
                      </Badge>
                      <span>{item.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center"
          >
            <Search className="mb-4 size-10 text-muted-foreground/40" />
            <p className="font-display text-lg font-semibold text-brand-heading">
              No matching questions
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-4 rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-brand-accent-fg transition-all duration-300 hover:opacity-90"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
