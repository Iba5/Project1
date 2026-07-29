"use client";

import { useEffect } from "react";

/**
 * Fires the canbri:open-admin event on mount so the AdminDashboardMount
 * (rendered in the root layout) opens the dashboard automatically when
 * a user navigates directly to /admin.
 */
export function AdminAutoOpen() {
  useEffect(() => {
    // Small delay so the layout is fully hydrated first
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("canbri:open-admin"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
