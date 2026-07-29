import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CtaBandProps = {
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  external?: boolean;
  className?: string;
};

export function CtaBand({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  external,
  className,
}: CtaBandProps) {
  const primaryAttrs = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <section
      className={cn(
        "surface-navy band-top relative overflow-hidden rounded-2xl shadow-xl shadow-brand-navy/20",
        className,
      )}
    >
      {/* Decorative glows */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-ice/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-ice/5 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a
            href={primaryHref}
            {...primaryAttrs}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-brand-heading transition-all duration-200 hover:bg-brand-ice hover:shadow-lg hover:-translate-y-0.5"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
