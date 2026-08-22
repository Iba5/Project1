"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { AdminAuthForm } from "@/components/website/admin-auth-form";

const AdminDashboard = dynamic(
  () => import("@/components/website/admin-dashboard").then((m) => m.AdminDashboard),
  { ssr: false },
);

type Status = "checking" | "needs-setup" | "needs-login" | "authed";

/**
 * The real /admin entry point: checks whether the one-time bootstrap signup
 * is still available, then shows signup, login, or the dashboard directly —
 * no hidden event dispatch, no global mount on every public page.
 */
export function AdminEntry() {
  const [status, setStatus] = useState<Status>("checking");
  const router = useRouter();

  const checkStatus = useCallback(async () => {
    try {
      // The session lives in an httpOnly cookie, invisible to this code —
      // ask the server whether it's valid rather than reading a token.
      const meRes = await fetch("/api/admin/me");
      if (meRes.ok) {
        setStatus("authed");
        return;
      }
      const res = await fetch("/api/admin/bootstrap-status");
      const data = await res.json();
      setStatus(data.ok && data.needsSetup ? "needs-setup" : "needs-login");
    } catch {
      setStatus("needs-login");
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" strokeWidth={2.25} />
      </div>
    );
  }

  if (status === "authed") {
    return <AdminDashboard open onClose={() => router.push("/")} />;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <AdminAuthForm
        mode={status === "needs-setup" ? "signup" : "login"}
        onSuccess={() => setStatus("authed")}
      />
    </div>
  );
}
