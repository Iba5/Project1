"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  /** 0–5, supports one decimal (rounded for display) */
  rating: number;
  /** Number of reviews to show alongside, e.g. "(38)" */
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { star: 12, text: "text-[11px]" },
  md: { star: 14, text: "text-xs" },
  lg: { star: 18, text: "text-sm" },
};

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showValue = true,
  className,
}: StarRatingProps) {
  const { star, text } = sizeMap[size];
  const rounded = Math.round(rating);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        className,
      )}
      role="img"
      aria-label={`Rated ${rating} out of 5${reviewCount ? ` from ${reviewCount} reviews` : ""}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < rounded;
          return (
            <Star
              key={i}
              className={cn(
                "transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/30",
              )}
              style={{ width: star, height: star }}
              strokeWidth={2}
              aria-hidden
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-brand-heading", text)}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", text)}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
