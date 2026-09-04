"use client";

const DEFAULT_ITEMS = [
  "PPE-01 · PPE",
  "STA-02 · STATIONERY",
  "TLS-03 · TOOLS & HARDWARE",
  "FAB-04 · FABRICATION",
  "ICE-05 · ICE MANUFACTURING",
];

const STRIPE_BG =
  "repeating-linear-gradient(-45deg, var(--brand-accent) 0 10px, var(--brand-navy) 10px 20px)";

export function MarqueeBar({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const loop = [...items, ...items];

  return (
    <div className="relative" aria-hidden>
      <div className="h-2" style={{ backgroundImage: STRIPE_BG }} />
      <div className="relative overflow-hidden bg-[var(--brand-navy-deep)] py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--brand-navy-deep)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--brand-navy-deep)] to-transparent" />
        <div className="marquee-track flex w-max items-center gap-10">
          {loop.map((item, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10">
              <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/85">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-2" style={{ backgroundImage: STRIPE_BG }} />

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
