"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X, Search, BarChart3, HelpCircle, Moon, Sun, ArrowUp, ArrowDown, Home, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Shortcut = {
  keys: string[];
  label: string;
  description: string;
  icon: typeof Search;
  category: "Navigation" | "Actions" | "Modals";
};

const SHORTCUTS: Shortcut[] = [
  {
    keys: ["⌘", "K"],
    label: "Open search",
    description: "Search products, industries, and sections",
    icon: Search,
    category: "Modals",
  },
  {
    keys: ["⌘", "⇧", "A"],
    label: "Open admin dashboard",
    description: "View enquiries, newsletter, and analytics",
    icon: BarChart3,
    category: "Modals",
  },
  {
    keys: ["?"],
    label: "Show keyboard shortcuts",
    description: "Open this help dialog",
    icon: HelpCircle,
    category: "Modals",
  },
  {
    keys: ["Esc"],
    label: "Close active modal",
    description: "Dismiss any open dialog or overlay",
    icon: X,
    category: "Modals",
  },
  {
    keys: ["G", "H"],
    label: "Go to home",
    description: "Scroll to the hero section",
    icon: Home,
    category: "Navigation",
  },
  {
    keys: ["G", "P"],
    label: "Go to products",
    description: "Jump to the products catalogue",
    icon: Search,
    category: "Navigation",
  },
  {
    keys: ["G", "C"],
    label: "Go to contact",
    description: "Jump to the contact form",
    icon: Mail,
    category: "Navigation",
  },
  {
    keys: ["J"],
    label: "Next section",
    description: "Scroll down to the next major section",
    icon: ArrowDown,
    category: "Navigation",
  },
  {
    keys: ["K"],
    label: "Previous section",
    description: "Scroll up to the previous major section",
    icon: ArrowUp,
    category: "Navigation",
  },
  {
    keys: ["T"],
    label: "Toggle theme",
    description: "Switch between light and dark mode",
    icon: Sun,
    category: "Actions",
  },
];

const CATEGORY_ORDER: Shortcut["category"][] = ["Modals", "Navigation", "Actions"];

const SECTION_IDS = ["home", "about", "products", "industries", "gallery", "faq", "contact"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState<string>("");
  const [lastKeyTime, setLastKeyTime] = useState<number>(0);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    // Listen for the custom open event (from footer link / header)
    const onOpen = () => openModal();
    window.addEventListener("canbri:open-shortcuts", onOpen);

    const onKey = (e: KeyboardEvent) => {
      // Skip when typing in inputs / textarea / contenteditable
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;

      // Escape always closes
      if (e.key === "Escape" && open) {
        closeModal();
        return;
      }

      // ⌘K / Ctrl+K opens search (let SearchBar handle it via its own listener)
      // ⌘⇧A / Ctrl+Shift+A opens admin (handled by useAdminDashboard hook)
      // ? opens this modal (only when not typing)
      if (e.key === "?" && !isTyping && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openModal();
        return;
      }

      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

      // Sequential key chords (e.g., "g" then "h")
      const now = Date.now();
      const buffer = now - lastKeyTime > 800 ? "" : keyBuffer;
      const nextBuffer = buffer + e.key.toLowerCase();
      setKeyBuffer(nextBuffer);
      setLastKeyTime(now);

      // Match chords
      if (nextBuffer === "gh") {
        scrollToSection("home");
        setKeyBuffer("");
        return;
      }
      if (nextBuffer === "gp") {
        scrollToSection("products");
        setKeyBuffer("");
        return;
      }
      if (nextBuffer === "gc") {
        scrollToSection("contact");
        setKeyBuffer("");
        return;
      }

      // Single-key actions
      if (nextBuffer.length === 1) {
        if (e.key.toLowerCase() === "j") {
          // Scroll to next section
          const scrollPos = window.scrollY + window.innerHeight / 3;
          let next = SECTION_IDS[0];
          for (const id of SECTION_IDS) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollPos) next = id;
          }
          const idx = SECTION_IDS.indexOf(next);
          if (idx < SECTION_IDS.length - 1) {
            scrollToSection(SECTION_IDS[idx + 1]);
          }
          setKeyBuffer("");
          return;
        }
        if (e.key.toLowerCase() === "k" && buffer === "") {
          // Only treat as "prev section" if not part of a chord
          const scrollPos = window.scrollY + window.innerHeight / 3;
          let current = SECTION_IDS[0];
          for (const id of SECTION_IDS) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollPos) current = id;
          }
          const idx = SECTION_IDS.indexOf(current);
          if (idx > 0) {
            scrollToSection(SECTION_IDS[idx - 1]);
          }
          setKeyBuffer("");
          return;
        }
        if (e.key.toLowerCase() === "t") {
          // Toggle theme
          document.documentElement.classList.toggle("dark");
          setKeyBuffer("");
          return;
        }
      }

      // Reset buffer if it gets too long
      if (nextBuffer.length > 2) setKeyBuffer("");
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("canbri:open-shortcuts", onOpen);
    };
  }, [open, keyBuffer, lastKeyTime, openModal, closeModal]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-[110] bg-brand-navy/70 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-[120] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts help"
          >
            <div className="overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-gradient-to-br from-brand-navy to-brand-surface-strong px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">
                    <Keyboard className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-white">
                      Keyboard Shortcuts
                    </h2>
                    <p className="text-xs text-white/70">
                      Navigate Canbri without leaving your keyboard
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close shortcuts help"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>

              {/* Body */}
              <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
                {CATEGORY_ORDER.map((category) => {
                  const shortcuts = SHORTCUTS.filter((s) => s.category === category);
                  return (
                    <div key={category} className="mb-6 last:mb-0">
                      <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <span className="h-px flex-1 bg-border" />
                        {category}
                        <span className="h-px flex-1 bg-border" />
                      </h3>
                      <div className="space-y-2">
                        {shortcuts.map((s) => {
                          const Icon = s.icon;
                          return (
                            <div
                              key={s.label}
                              className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card/50 px-3.5 py-2.5 transition-colors hover:border-brand-accent/30 hover:bg-card"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-accent/15 text-brand-accent-fg">
                                  <Icon className="h-4 w-4" strokeWidth={2.25} />
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-brand-heading">
                                    {s.label}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {s.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                {s.keys.map((k, i) => (
                                  <kbd
                                    key={i}
                                    className={cn(
                                      "inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-secondary px-2 font-mono text-xs font-semibold text-brand-heading shadow-sm",
                                      i > 0 && "ml-0.5",
                                    )}
                                  >
                                    {k}
                                  </kbd>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-center text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Press <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-semibold">?</kbd> anywhere to open this dialog
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
