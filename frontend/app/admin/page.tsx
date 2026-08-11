import type { Metadata } from "next";
import { AdminEntry } from "@/components/website/admin-entry";

export const metadata: Metadata = {
  title: "Admin — Canbri Private Limited",
  description: "Admin dashboard for Canbri Private Limited",
  robots: { index: false, follow: false }, // Never indexed by search engines
};

/**
 * /admin — the real admin entry point.
 *
 * Shows the one-time bootstrap signup if no admin account exists yet,
 * otherwise the login form, otherwise the dashboard directly. The dashboard
 * bundle is dynamic-imported client-side only once authenticated, so it
 * never ships to public visitors.
 */
export default function AdminPage() {
  return <AdminEntry />;
}
