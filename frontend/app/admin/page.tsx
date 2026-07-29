import type { Metadata } from "next";
import { AdminAutoOpen } from "./admin-auto-open";

export const metadata: Metadata = {
  title: "Admin — Canbri Private Limited",
  description: "Admin dashboard for Canbri Private Limited",
  robots: { index: false, follow: false }, // Never indexed by search engines
};

/**
 * /admin page
 *
 * This page exists so administrators can navigate directly to /admin
 * and have the dashboard open automatically, without needing to know
 * the Ctrl+Shift+A keyboard shortcut.
 *
 * The AdminDashboardMount component handles auth gating — if no valid
 * JWT is in sessionStorage it shows the login form first.
 */
export default function AdminPage() {
  return (
    <>
      {/* Background content — keeps layout consistent */}
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading admin panel…
        </p>
      </div>

      {/*
        AutoOpen: dispatches the custom event on mount so the dashboard
        opens immediately when navigating to /admin directly.
      */}
      <AdminAutoOpen />
    </>
  );
}
