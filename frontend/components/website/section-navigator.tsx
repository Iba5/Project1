"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Section = {
  id: string;
  label: string;
};

const SECTIONS: Section[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "industries", label: "Industries" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export function SectionNavigator() {
  const [active, setActive] = useState<string>("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);

      // Find the section currently in view
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let current = "home";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollPos) {
          current = s.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Section navigator"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2.5 lg:flex"
        >
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleClick(s.id)}
                aria-label={`Go to ${s.label} section`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-2"
              >
                <span
                  className={`rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-heading shadow-sm ring-1 ring-border opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 ${
                    isActive ? "opacity-100" : ""
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`block h-2.5 w-2.5 rounded-full ring-1 ring-border transition-all duration-200 ${
                    isActive
                      ? "scale-125 bg-brand-accent ring-brand-accent"
                      : "bg-muted-foreground/30 group-hover:bg-brand-accent/60"
                  }`}
                />
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
