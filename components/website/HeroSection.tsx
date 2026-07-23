'use client';

import { useSiteStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Snowflake, Truck } from 'lucide-react';
import { useReveal } from '@/hooks/use-reveal';

export function HeroSection() {
  const { sections, settings } = useSiteStore();
  const hero = sections.find((s) => s.section === 'hero');
  const ref = useReveal();

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="section-home"
      className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-dark-blue"
    >
      {/* Light theme: subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-ice-blue/5 via-transparent to-ice-blue/[0.08] dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none" />
      {/* Dark theme: ambient glow */}
      <div className="hidden dark:block absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-ice-blue/[0.03] blur-[120px] pointer-events-none" />
      <div className="hidden dark:block absolute bottom-[-30%] left-[-15%] w-[500px] h-[500px] rounded-full bg-ice-blue/[0.02] blur-[100px] pointer-events-none" />
      {/* Dark theme: grid */}
      <div
        className="hidden dark:block absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(126,200,227,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(126,200,227,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-32 md:py-0" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text content */}
          <div>
            {/* Overline */}
            <div className="flex items-center gap-3 mb-6 reveal">
              <span className="section-line" />
              <span className="text-ice-blue/90 text-[11px] font-semibold tracking-[0.2em] uppercase">
                {hero?.subtitle || settings.slogan || 'Cool & Cold'}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-dark-blue dark:text-white leading-[1.08] tracking-tight mb-6 reveal reveal-delay-1">
              {hero?.title || 'Welcome to Canbri Ice'}
            </h1>

            {/* Body */}
            <p className="text-slate-500 dark:text-white/45 text-[15px] md:text-base leading-relaxed max-w-lg mb-10 reveal reveal-delay-2">
              {hero?.content || 'Your trusted supplier of premium ice products in Zimbabwe.'}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 reveal reveal-delay-3">
              <Button
                onClick={() => go('section-products')}
                className="bg-dark-blue dark:bg-ice-blue text-white dark:text-dark-blue hover:bg-dark-blue/90 dark:hover:bg-light-ice font-semibold rounded-md px-6 h-11 text-sm group transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_24px_rgba(126,200,227,0.15)]"
              >
                View Products
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Button>
              <button
                onClick={() => go('section-contact')}
                className="text-slate-500 dark:text-white/50 hover:text-ice-blue text-sm font-medium transition-colors duration-300 underline underline-offset-4 decoration-slate-300 dark:decoration-white/10 hover:decoration-ice-blue/40"
              >
                Request a Quote
              </button>
            </div>

            {/* Delivery */}
            {settings.delivery_areas && (
              <div className="mt-12 flex items-center gap-2 text-slate-400 dark:text-white/25 text-xs tracking-wide reveal reveal-delay-4">
                <Truck className="h-3.5 w-3.5" />
                <span>{settings.delivery_areas}</span>
              </div>
            )}
          </div>

          {/* Right — visual element */}
          <div className="hidden lg:flex items-center justify-center reveal reveal-delay-2">
            <div className="relative w-full max-w-md aspect-square">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full bg-ice-blue/5 dark:bg-ice-blue/[0.04]" />
              <div className="absolute inset-8 rounded-full bg-ice-blue/8 dark:bg-ice-blue/[0.06]" />
              <div className="absolute inset-16 rounded-full bg-ice-blue/10 dark:bg-ice-blue/[0.08] border border-ice-blue/20 dark:border-ice-blue/10" />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-ice-blue/10 dark:bg-ice-blue/[0.08] border border-ice-blue/20 flex items-center justify-center">
                  <Snowflake className="h-12 w-12 text-ice-blue" />
                </div>
              </div>
              {/* Floating stats */}
              <div className="absolute top-8 right-4 bg-white dark:bg-surface border border-slate-200 dark:border-white/5 rounded-lg px-4 py-3 shadow-sm">
                <p className="text-ice-blue text-lg font-bold">2</p>
                <p className="text-slate-400 dark:text-white/30 text-[10px] font-medium tracking-wider uppercase">Locations</p>
              </div>
              <div className="absolute bottom-12 left-0 bg-white dark:bg-surface border border-slate-200 dark:border-white/5 rounded-lg px-4 py-3 shadow-sm">
                <p className="text-ice-blue text-lg font-bold">100%</p>
                <p className="text-slate-400 dark:text-white/30 text-[10px] font-medium tracking-wider uppercase">Hygiene</p>
              </div>
              <div className="absolute bottom-4 right-12 bg-white dark:bg-surface border border-slate-200 dark:border-white/5 rounded-lg px-4 py-3 shadow-sm">
                <p className="text-ice-blue text-lg font-bold">Fast</p>
                <p className="text-slate-400 dark:text-white/30 text-[10px] font-medium tracking-wider uppercase">Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200 dark:bg-gradient-to-r dark:from-transparent dark:via-white/5 dark:to-transparent" />
    </section>
  );
}
