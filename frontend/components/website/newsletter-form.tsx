"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

type State = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || "Failed to subscribe");
      trackEvent("newsletter_signup", data.email);
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-white/75">
        <CheckCircle className="h-4 w-4 text-brand-ice" />
        <span>Thank you for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          name="email"
          type="email"
          required
          placeholder="Your email address"
          className="h-10 border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-white/40 focus-visible:ring-brand-ice"
        />
      </div>
      <Button
        type="submit"
        disabled={state === "submitting"}
        size="sm"
        className="h-10 bg-brand-accent text-brand-accent-fg hover:bg-brand-accent/90"
      >
        {state === "submitting" ? "..." : "Subscribe"}
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </Button>
    </form>
  );
}
