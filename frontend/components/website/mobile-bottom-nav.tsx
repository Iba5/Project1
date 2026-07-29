"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Package,
  Images,
  HelpCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "products", label: "Products", icon: Package },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

type MobileBottomNavProps = {
  callHref: string;
};

/**
 * Sticky bottom navigation bar for mobile only.
 * Shows 4 section quick-jumps + a prominent Call button.
 * Only appears after the user has scrolled past the hero.
 */
export function MobileBottomNav({ callHref }: MobileBottomNavProps) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past 1 viewport height
      setVisible(window.scrollY > window.innerHeight * 0.6);

      // Find active section
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let current = "home";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Quick section navigation"
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-lg md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <ul className="grid grid-cols-5">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    aria-label={`Go to ${item.label} section`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                      isActive
                        ? "text-brand-accent-fg"
                        : "text-muted-foreground hover:text-brand-heading",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
                        isActive && "bg-brand-accent/15 scale-110",
                      )}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </span>
                    <span className={cn(isActive && "font-semibold")}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
            <li>
              <a
                href={callHref}
                aria-label="Call Canbri"
                className="flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-white"
                style={{ background: "var(--primary)" }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                  <Phone className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <span className="font-semibold">Call</span>
              </a>
            </li>
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
