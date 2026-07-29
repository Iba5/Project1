"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * A slim progress bar fixed to the top of the viewport that fills
 * as the user scrolls down the page. Sits above the sticky header.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(Math.max(pct, 0), 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[55] h-0.5 bg-transparent" aria-hidden>
      <motion.div
        className="h-full bg-gradient-to-r from-brand-ice via-brand-accent to-brand-ice"
        style={{ width: `${progress}%` }}
        transition={{ ease: "linear", duration: 0.1 }}
      />
    </div>
  );
}
