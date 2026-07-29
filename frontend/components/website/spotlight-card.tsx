"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

/**
 * Wraps children in a card that renders a soft radial spotlight
 * following the mouse cursor. The spotlight is purely decorative
 * and does not interfere with pointer events.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(255,255,255,0.10)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn("group/spotlight relative overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          background: pos
            ? `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`
            : "transparent",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
