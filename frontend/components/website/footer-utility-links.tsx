"use client";

import { useState } from "react";
import { Lock, Cookie, RotateCcw, Keyboard } from "lucide-react";

/**
 * Small client component for footer utility links:
 * - Admin Dashboard (dispatches canbri:open-admin event)
 * - Keyboard Shortcuts (dispatches canbri:open-shortcuts event)
 * - Cookie Preferences (re-opens cookie consent)
 */
export function FooterUtilityLinks() {
  const [cookieReset, setCookieReset] = useState(false);

  const openAdmin = () => {
    window.dispatchEvent(new CustomEvent("canbri:open-admin"));
  };

  const openShortcuts = () => {
    window.dispatchEvent(new CustomEvent("canbri:open-shortcuts"));
  };

  const reopenCookies = () => {
    localStorage.removeItem("canbri-cookie-consent");
    setCookieReset(true);
    // Reload to trigger the cookie consent to reappear
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/40">
      <button
        type="button"
        onClick={openAdmin}
        className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
        title="Open admin dashboard (Ctrl+Shift+A)"
      >
        <Lock className="h-3 w-3" strokeWidth={2.25} />
        Admin
      </button>
      <button
        type="button"
        onClick={openShortcuts}
        className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
        title="Show keyboard shortcuts (?)"
      >
        <Keyboard className="h-3 w-3" strokeWidth={2.25} />
        Shortcuts
      </button>
      <button
        type="button"
        onClick={reopenCookies}
        className="inline-flex items-center gap-1 transition-colors hover:text-white/70"
      >
        {cookieReset ? (
          <RotateCcw className="h-3 w-3 animate-spin" strokeWidth={2.25} />
        ) : (
          <Cookie className="h-3 w-3" strokeWidth={2.25} />
        )}
        Cookie preferences
      </button>
      <span className="opacity-50">·</span>
      <span>
        Press{" "}
        <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 text-[9px] font-semibold">
          ?
        </kbd>{" "}
        for help
      </span>
    </div>
  );
}
