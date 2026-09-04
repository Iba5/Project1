type Stat = {
  value: string;
  label: string;
  description: string;
};

const DEFAULT_STATS: Stat[] = [
  { value: "5", label: "Divisions", description: "Under one roof" },
  { value: "2", label: "Locations", description: "Harare & Murewa" },
  { value: "Quote-based", label: "Pricing", description: "Accurate to your order" },
  { value: "Bulk welcome", label: "Orders", description: "Standing orders too" },
];

export function StatsBar({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <div className="border-y border-white/10 bg-[var(--brand-navy-deep)]">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:px-8 lg:grid-cols-4 lg:px-12">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-3xl font-bold text-white sm:text-4xl">{stat.value}</dd>
            <dt className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
              {stat.label}
            </dt>
            <p className="mt-1 text-sm text-white/60">{stat.description}</p>
          </div>
        ))}
      </dl>
    </div>
  );
}
