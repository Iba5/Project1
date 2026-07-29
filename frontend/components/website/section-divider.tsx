import { cn } from "@/lib/utils";

type SectionDividerProps = {
  /** Top section background color (the section above the divider) */
  from?: "background" | "secondary" | "navy" | "transparent";
  /** Bottom section background color (the section below the divider) */
  to?: "background" | "secondary" | "navy" | "transparent";
  /** Visual style */
  variant?: "wave" | "curve" | "slant" | "peaks";
  /** Flip the divider vertically */
  flip?: boolean;
  className?: string;
};

const COLORS: Record<NonNullable<SectionDividerProps["from"]>, string> = {
  background: "var(--background)",
  secondary: "var(--secondary)",
  navy: "var(--brand-navy)",
  transparent: "transparent",
};

/**
 * Decorative SVG divider that creates a smooth visual transition between sections.
 * Rendered as a thin SVG band with a colored shape that matches the next section.
 */
export function SectionDivider({
  from = "background",
  to = "secondary",
  variant = "wave",
  flip = false,
  className,
}: SectionDividerProps) {
  const fillColor = COLORS[to];
  const path = PATHS[variant];

  return (
    <div
      className={cn(
        "divider-curve",
        flip && "flip",
        className,
      )}
      aria-hidden
      style={{ background: COLORS[from] }}
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} fill={fillColor} />
      </svg>
    </div>
  );
}

const PATHS: Record<NonNullable<SectionDividerProps["variant"]>, string> = {
  wave:
    "M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,32 L1440,64 L0,64 Z",
  curve:
    "M0,32 C480,64 960,64 1440,32 L1440,64 L0,64 Z",
  slant:
    "M0,40 L1440,8 L1440,64 L0,64 Z",
  peaks:
    "M0,32 L180,8 L360,32 L540,8 L720,32 L900,8 L1080,32 L1260,8 L1440,32 L1440,64 L0,64 Z",
};
