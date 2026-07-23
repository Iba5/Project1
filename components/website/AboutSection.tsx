'use client';

import { useSiteStore } from '@/lib/store';
import { useReveal } from '@/hooks/use-reveal';

const STATS = [
  { value: '2', label: 'Locations' },
  { value: '24/7', label: 'Production' },
  { value: '100%', label: 'Hygiene' },
  { value: 'Fast', label: 'Delivery' },
];

export function AboutSection() {
  const { sections } = useSiteStore();
  const about = sections.find((s) => s.section === 'about');
  const ref = useReveal();

  return (
    <section id="section-about" className="py-24 md:py-32 bg-slate-50 dark:bg-dark-blue relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200 dark:bg-gradient-to-r dark:from-transparent dark:via-white/5 dark:to-transparent" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8" ref={ref}>
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5 reveal">
            <span className="section-line" />
            <span className="text-ice-blue/80 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {about?.subtitle || 'Who We Are'}
            </span>
          </div>
          <div className="grid md:grid-cols-12 gap-8 items-start">
            <h2 className="md:col-span-5 text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-dark-blue dark:text-white leading-tight tracking-tight reveal reveal-delay-1">
              {about?.title || 'About Us'}
            </h2>
            <div className="md:col-span-7 reveal reveal-delay-2">
              <p className="text-slate-500 dark:text-white/40 text-[15px] leading-[1.8] whitespace-pre-line">
                {about?.content || 'Canbri Ice is a leading supplier of premium ice cubes and ice blocks based in Harare and Murewa, Zimbabwe. We are committed to delivering high-quality, hygienic ice products to businesses and events across the region.'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-white/5 rounded-lg overflow-hidden">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`stat-card bg-white dark:bg-surface p-6 md:p-8 transition-all duration-300 cursor-default reveal reveal-delay-${i + 1}`}
            >
              <p className="text-ice-blue text-2xl md:text-3xl font-bold tracking-tight mb-1">{s.value}</p>
              <p className="text-slate-400 dark:text-white/30 text-xs font-medium tracking-[0.15em] uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
