import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "default" | "white";
  /** Optional faded numeral watermark shown behind the title (e.g. "01") */
  numeral?: string;
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  tone = "default",
  numeral,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "relative",
        align === "center" && "text-center",
        className,
      )}
    >
      {numeral && (
        <span
          className={cn(
            "section-numeral",
            align === "center" && "left-1/2 -translate-x-1/2",
            tone === "white" && "text-white/[0.06]",
          )}
          aria-hidden
        >
          {numeral}
        </span>
      )}
      {kicker && (
        <p
          className={cn(
            "relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em]",
            tone === "white" ? "text-brand-ice" : "text-brand-accent",
          )}
        >
          <span
            className={cn(
              "h-px w-6 transition-all duration-300",
              tone === "white" ? "bg-brand-ice/60" : "bg-brand-accent/50",
            )}
            aria-hidden
          />
          {kicker}
          <span
            className={cn(
              "h-px w-6 transition-all duration-300",
              tone === "white" ? "bg-brand-ice/60" : "bg-brand-accent/50",
            )}
            aria-hidden
          />
        </p>
      )}
      <h2
        className={cn(
          "relative mt-3 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl",
          tone === "white" ? "text-white" : "text-brand-heading",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "relative mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            tone === "white" ? "text-white/75" : "text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
