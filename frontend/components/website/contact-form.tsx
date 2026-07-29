"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

type State = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
      toast.success("Message sent — we'll respond during business hours.");
      trackEvent("contact_submit", data.product || "general", {
        has_company: !!data.company,
        has_email: !!data.email,
      });
      form.reset();
    } catch {
      setState("error");
      toast.error("Something went wrong. Please WhatsApp or call us instead.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required autoComplete="name" placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" autoComplete="organization" placeholder="Optional" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+263 ..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="Optional" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product">Product / division of interest</Label>
        <Input
          id="product"
          name="product"
          placeholder="e.g. Ice blocks, fabrication, PPE bulk order"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you need — quantity, delivery location, preferred date."
        />
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={state === "submitting"} size="lg">
          {state === "submitting" ? "Sending..." : "Send Message"}
        </Button>
        <p className="text-xs text-muted-foreground">
          By submitting you agree to be contacted about your enquiry. We do not share your details.
        </p>
      </div>
    </form>
  );
}
