"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "canbri-announcement-dismissed-v2";

type AnnouncementBarProps = {
  message?: string;
  href?: string;
  ctaLabel?: string;
};

/** Thin dark top strip above the sidebar/hero — matches the live site's
 * "5kg ice blocks @ $1 — Murehwa depot." announcement. */
export function AnnouncementBar({
  message = "5kg ice blocks @ $1 — Murehwa depot.",
  href = "#ice",
  ctaLabel = "SEE DETAILS",
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-2 bg-[var(--brand-navy-deep)] px-10 py-2 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-white/80 sm:text-xs">
        {message}{" "}
        <a href={href} className="font-bold text-brand-accent underline underline-offset-2">
          {ctaLabel}
        </a>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-white/60 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
