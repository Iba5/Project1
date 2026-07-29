"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook that manages the Admin Dashboard open state.
 * - Opens automatically when the pathname is /admin.
 * - Listens for Ctrl+Shift+A (or Cmd+Shift+A on Mac) to toggle the dashboard.
 * - Also listens for a custom "canbri:open-admin" event so the footer link
 *   and the /admin page can open it programmatically.
 */
export function useAdminDashboard() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auto-open on /admin route
  useEffect(() => {
    if (pathname === "/admin") {
      setOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onCustom = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener("canbri:open-admin", onCustom);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("canbri:open-admin", onCustom);
    };
  }, []);

  return { open, setOpen };
}
