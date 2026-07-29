"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/website/section-heading";
import { cn } from "@/lib/utils";

/* ─── Data ─────────────────────────────────────────────────────────── */

type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Tendai M.",
    role: "Construction Contractor",
    text: "Canbri delivers our hardware and PPE on time, every week. The quote-driven pricing is fair and transparent.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "Restaurant Owner",
    text: "Their ice blocks keep our kitchen running through the busiest weekends. Reliable cold-chain delivery.",
    rating: 5,
  },
  {
    name: "Michael R.",
    role: "School Administrator",
    text: "Standing orders for stationery and PPE mean we never run out. Canbri makes procurement simple.",
    rating: 4,
  },
  {
    name: "Grace D.",
    role: "Event Caterer",
    text: "Bulk ice for events, delivered on schedule. Canbri has never let us down, even on short notice.",
    rating: 5,
  },
  {
    name: "James P.",
    role: "Fabrication Workshop",
    text: "Quality steel and hardware, plus fabrication services when we need an extra pair of hands. Great partner.",
    rating: 4,
  },
  {
    name: "Esther N.",
    role: "Retail Store Owner",
    text: "Wholesale tools and stationery at competitive rates. Canbri is our go-to supplier.",
    rating: 5,
  },
];

/* ─── Star Rating ──────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5 transition-colors duration-300",
            i < rating ? "fill-amber-400 text-amber-400" : "text-border"
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ─── Testimonial Card ─────────────────────────────────────────────── */

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-brand-accent/40"
    >
      {/* Decorative quote icon */}
      <Quote
        className="absolute -top-2 -right-1 h-20 w-20 text-brand-accent/[0.07] rotate-6 transition-colors duration-500 group-hover:text-brand-accent/15"
        strokeWidth={0.8}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <StarRating rating={t.rating} />
        <Quote
          className="h-7 w-7 text-brand-accent/40 transition-colors duration-300 group-hover:text-brand-accent"
          strokeWidth={1.5}
        />
      </div>

      <p className="relative mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{t.text}&rdquo;
      </p>

      <div className="relative mt-6 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-accent font-display text-sm font-bold text-brand-accent-fg transition-transform duration-300 group-hover:scale-110">
          {t.name.charAt(0)}
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-brand-heading">
            {t.name}
          </p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Animation Variants ───────────────────────────────────────────── */

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* ─── Carousel Helpers ──────────────────────────────────────────────── */

const CARDS_PER_VIEW = 3;
const AUTO_ROTATE_MS = 5000;

function getPages(items: Testimonial[], perView: number): Testimonial[][] {
  const pages: Testimonial[][] = [];
  for (let i = 0; i < items.length; i += perView) {
    pages.push(items.slice(i, i + perView));
  }
  return pages;
}

/* ─── Main Section ─────────────────────────────────────────────────── */

export function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const pages = getPages(testimonials, CARDS_PER_VIEW);
  const totalPages = pages.length;

  /* Auto-rotate */
  const nextSlide = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (showAll || isPaused) return;
    const timer = setInterval(nextSlide, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [showAll, isPaused, nextSlide]);

  const prevSlide = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <section
      className="relative overflow-hidden bg-secondary/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-accent/[0.03] via-transparent to-brand-accent/[0.02]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Heading */}
        <ScrollRevealWrapper>
          <SectionHeading
            kicker="What Our Customers Say"
            title="Trusted by businesses across Zimbabwe."
            description="From construction sites to hotels, schools to fisheries — hear what our customers say about working with Canbri."
            align="center"
          />
        </ScrollRevealWrapper>

        {/* ── Carousel View (Desktop) ── */}
        <div className="mt-12 hidden lg:block">
          {!showAll ? (
            <div className="relative">
              {/* Cards */}
              <div className="relative min-h-[260px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid grid-cols-3 gap-6"
                  >
                    {pages[currentPage].map((t, i) => (
                      <TestimonialCard
                        key={t.name}
                        t={t}
                        index={i}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={prevSlide}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-300 hover:border-brand-accent/40 hover:text-brand-accent-fg hover:shadow-sm"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      aria-label={`Go to page ${i + 1}`}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        i === currentPage
                          ? "w-6 bg-brand-accent"
                          : "w-2 bg-border hover:bg-muted-foreground/40"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-300 hover:border-brand-accent/40 hover:text-brand-accent-fg hover:shadow-sm"
                  aria-label="Next testimonials"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Full Grid View */
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-3 gap-6"
            >
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.name} t={t} index={i} />
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Mobile / Tablet Grid ── */}
        <div className="mt-12 lg:hidden">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
            className={cn(
              "grid gap-6 sm:grid-cols-2",
              !showAll && "max-h-[680px] overflow-hidden"
            )}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </motion.div>

          {/* Fade overlay when collapsed */}
          {!showAll && (
            <div className="relative mt-0 h-24 bg-gradient-to-t from-secondary/40 to-transparent lg:hidden" />
          )}
        </div>

        {/* View All / Show Less Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-brand-heading transition-all duration-300 hover:border-brand-accent/40 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <LayoutGrid className="h-4 w-4" />
            {showAll ? "Show Less" : "View All Testimonials"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Simple Scroll Reveal Wrapper ─────────────────────────────────── */

function ScrollRevealWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
}
