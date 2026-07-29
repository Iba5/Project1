"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps children with a scroll-based parallax effect.
 * The content moves at a fraction of the scroll speed (default 0.2 = 20% slower).
 */
type ParallaxProps = {
  children: ReactNode;
  /** Speed factor — 0 = static, 0.5 = half speed, 1 = same speed (no parallax). Default 0.2 */
  speed?: number;
  /** Axis to translate on. Default "y" */
  axis?: "x" | "y";
  /** Optional className for the wrapper */
  className?: string;
  /** Max displacement in px. Default 80 */
  max?: number;
};

export function Parallax({
  children,
  speed = 0.2,
  axis = "y",
  className,
  max = 80,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on reduced-motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip on touch / mobile devices (parallax can cause jank)
    if (window.matchMedia("(hover: none)").matches) return;

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let lastTs = 0;

    const update = (ts: number) => {
      if (ts - lastTs < 16) {
        rafId = requestAnimationFrame(update);
        return;
      }
      lastTs = ts;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Center of element relative to viewport center
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const delta = elementCenter - viewportCenter;
      const displacement = Math.max(-max, Math.min(max, delta * speed));

      if (axis === "y") {
        el.style.transform = `translate3d(0, ${displacement}px, 0)`;
      } else {
        el.style.transform = `translate3d(${displacement}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [speed, axis, max]);

  return (
    <div ref={ref} className={`parallax-layer ${className ?? ""}`}>
      {children}
    </div>
  );
}
