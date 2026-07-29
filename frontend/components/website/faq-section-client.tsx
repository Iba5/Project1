"use client";

import dynamic from "next/dynamic";

/**
 * Client-only wrapper for the FAQ section.
 *
 * Radix Accordion generates random IDs (e.g. radix-_R_gv5aqatm6lb_)
 * that differ between server and client rendering, which causes a
 * hydration mismatch warning. By loading the FAQ section with
 * `ssr: false`, we skip server-side rendering entirely so the IDs
 * are only generated once on the client.
 */
const FaqSection = dynamic(
  () =>
    import("@/components/website/faq-section").then((mod) => ({
      default: mod.FaqSection,
    })),
  { ssr: false },
);

export function FaqSectionClient() {
  return <FaqSection />;
}
