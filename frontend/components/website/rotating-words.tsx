"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type RotatingWordsProps = {
  words: string[];
  interval?: number;
  className?: string;
};

export function RotatingWords({ words, interval = 2200, className }: RotatingWordsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  if (words.length === 0) return null;

  return (
    <span
      className={`relative inline-flex items-center overflow-hidden align-bottom ${className ?? ""}`}
      style={{ minWidth: "5.5em" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block bg-gradient-to-r from-brand-accent-fg to-brand-ice bg-clip-text text-transparent dark:from-brand-ice dark:to-white"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      <span
        className="typewriter-cursor bg-brand-accent-fg dark:bg-brand-ice"
        aria-hidden
      />
    </span>
  );
}
