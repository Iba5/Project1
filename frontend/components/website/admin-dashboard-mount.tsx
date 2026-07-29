"use client";

import { AdminDashboard } from "@/components/website/admin-dashboard";
import { useAdminDashboard } from "@/lib/hooks/use-admin-dashboard";

/**
 * Client wrapper that mounts the AdminDashboard and wires up
 * the keyboard shortcut + custom event listeners.
 */
export function AdminDashboardMount() {
  const { open, setOpen } = useAdminDashboard();
  return <AdminDashboard open={open} onClose={() => setOpen(false)} />;
}
