/**
 * Lightweight client-side analytics — logs WhatsApp/Call/Product events to
 * localStorage so they can be reviewed later. In production this could be
 * swapped for a real analytics provider (Plausible, PostHog, GA4, etc).
 */
"use client";

const STORAGE_KEY = "canbri-events";
const MAX_EVENTS = 200;

export type AnalyticsEvent = {
  type:
    | "whatsapp_click"
    | "call_click"
    | "quote_submit"
    | "product_quick_view"
    | "product_compare_add"
    | "product_compare_remove"
    | "newsletter_signup"
    | "contact_submit"
    | "search"
    | "cart_add"
    | "cart_remove"
    | "cart_submit"
    | "wishlist_add"
    | "wishlist_remove"
    | "share"
    | "promo_dismiss";
  label?: string;
  meta?: Record<string, string | number | boolean | undefined>;
  ts: string; // ISO timestamp
};

function readEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as AnalyticsEvent[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(events.slice(-MAX_EVENTS)),
    );
  } catch {
    /* ignore quota errors */
  }
}

export function trackEvent(
  type: AnalyticsEvent["type"],
  label?: string,
  meta?: Record<string, string | number | boolean | undefined>,
) {
  if (typeof window === "undefined") return;
  const event: AnalyticsEvent = {
    type,
    label,
    meta,
    ts: new Date().toISOString(),
  };
  const events = readEvents();
  events.push(event);
  writeEvents(events);

  // Dev-friendly console log
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", type, label ?? "", meta ?? "");
  }

  // Broadcast so any UI showing counts can update
  window.dispatchEvent(
    new CustomEvent("canbri:analytics", { detail: event }),
  );
}

export function getEvents(): AnalyticsEvent[] {
  return readEvents();
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("canbri:analytics-cleared"));
}
