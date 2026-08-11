"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  PackageCheck,
  User,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/cms";
import { quoteWhatsAppHref } from "@/lib/cms";

type QuoteWizardProps = {
  categories: ProductCategory[];
  whatsappNumber: string;
};

const STEPS = [
  { id: 1, label: "Category", icon: PackageCheck },
  { id: 2, label: "Details", icon: ClipboardList },
  { id: 3, label: "Contact", icon: User },
];

export function QuoteWizard({ categories, whatsappNumber }: QuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    category: "" as string,
    quantity: "",
    delivery: "",
    details: "",
    name: "",
    phone: "",
    company: "",
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (step === 1) return form.category !== "";
    if (step === 2) return form.quantity !== "" && form.delivery !== "";
    if (step === 3) return form.name !== "" && form.phone !== "";
    return false;
  };

  const handleSubmit = () => {
    // Compose WhatsApp message and open it
    const msg = `Hello Canbri, I'd like to request a quote:

• Category: ${form.category}
• Quantity: ${form.quantity}
• Delivery location: ${form.delivery}
• Details: ${form.details || "—"}

• Name: ${form.name}
• Phone: ${form.phone}
• Company: ${form.company || "—"}`;
    const href = quoteWhatsAppHref(whatsappNumber, msg);
    window.open(href, "_blank", "noopener,noreferrer");
    setDone(true);
  };

  const reset = () => {
    setForm({
      category: "",
      quantity: "",
      delivery: "",
      details: "",
      name: "",
      phone: "",
      company: "",
    });
    setStep(1);
    setDone(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      {/* Stepper header */}
      <div className="border-b border-border bg-secondary/50 px-6 py-4 sm:px-8">
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const isComplete = step > s.id || done;
            const isCurrent = step === s.id && !done;
            return (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                      isComplete && "bg-emerald-500 text-white",
                      isCurrent && "bg-brand-accent text-brand-accent-fg ring-4 ring-brand-accent/20",
                      !isComplete && !isCurrent && "bg-background text-muted-foreground ring-1 ring-border",
                    )}
                  >
                    {isComplete ? <Check className="h-4 w-4" strokeWidth={3} /> : s.id}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs font-semibold uppercase tracking-wider sm:inline",
                      isCurrent ? "text-brand-heading" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1 transition-colors duration-300",
                      isComplete ? "bg-emerald-500/60" : "bg-border",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Body */}
      <div className="relative min-h-[260px] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Check className="h-7 w-7" strokeWidth={3} />
              </span>
              <h4 className="mt-4 font-display text-lg font-bold text-brand-heading">
                WhatsApp opened
              </h4>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Your quote request has been prepared in WhatsApp. Press send there and we will respond during business hours.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-brand-heading transition-colors hover:bg-secondary"
              >
                Start a new quote
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div>
                  <h4 className="font-display text-lg font-bold text-brand-heading">
                    What do you need?
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick the category that best matches your enquiry.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update("category", c)}
                        className={cn(
                          "flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                          form.category === c
                            ? "border-brand-accent bg-brand-accent/10 text-brand-heading"
                            : "border-border bg-background text-muted-foreground hover:border-brand-accent/40 hover:bg-secondary",
                        )}
                      >
                        {c}
                        {form.category === c && (
                          <Check className="h-4 w-4 text-brand-accent-fg" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h4 className="font-display text-lg font-bold text-brand-heading">
                    Order details
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A rough idea is enough — we will confirm everything in WhatsApp.
                  </p>
                  <div className="mt-4 grid gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Quantity *
                      </span>
                      <input
                        type="text"
                        value={form.quantity}
                        onChange={(e) => update("quantity", e.target.value)}
                        placeholder="e.g. 50 ice blocks, 20 PPE kits, 1 gate"
                        className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-brand-heading outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Delivery location *
                      </span>
                      <input
                        type="text"
                        value={form.delivery}
                        onChange={(e) => update("delivery", e.target.value)}
                        placeholder="e.g. Harare CBD, Murewa, Borrowdale"
                        className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-brand-heading outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Anything else?
                      </span>
                      <textarea
                        value={form.details}
                        onChange={(e) => update("details", e.target.value)}
                        rows={3}
                        placeholder="Specifications, recurring order, timeline…"
                        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-brand-heading outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h4 className="font-display text-lg font-bold text-brand-heading">
                    Your contact details
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll prepare a WhatsApp message with everything above so you can send it in one tap.
                  </p>
                  <div className="mt-4 grid gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Name *
                      </span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-brand-heading outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Phone *
                      </span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+263 77 123 4567"
                        className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-brand-heading outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                        Company (optional)
                      </span>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Company name"
                        className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-brand-heading outline-none transition-colors focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                      />
                    </label>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {!done && (
        <div className="flex items-center justify-between gap-2 border-t border-border bg-secondary/30 px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border bg-background px-4 text-sm font-medium text-brand-heading transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
            Back
          </button>
          <span className="text-xs text-muted-foreground">
            Step {step} of {STEPS.length}
          </span>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={!canProceed()}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || !whatsappNumber}
              title={!whatsappNumber ? "WhatsApp isn't set up yet — please use the contact form instead." : undefined}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[#25D366] px-4 text-sm font-semibold text-[#06351B] shadow-sm shadow-[#25D366]/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
              Send via WhatsApp
            </button>
          )}
        </div>
      )}
    </div>
  );
}
