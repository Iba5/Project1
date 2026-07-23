'use client';

import { useSiteStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/hooks/use-reveal';

export function ProductsSection() {
  const { sections, products, settings } = useSiteStore();
  const sec = sections.find((s) => s.section === 'products');
  const ref = useReveal();

  const goContact = () => document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="section-products" className="py-24 md:py-32 bg-slate-50 dark:bg-medium-blue relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200 dark:bg-gradient-to-r dark:from-transparent dark:via-white/5 dark:to-transparent" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="flex items-start justify-between mb-14 gap-8">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-5 reveal">
              <span className="section-line" />
              <span className="text-ice-blue/80 dark:text-ice-blue/70 text-[11px] font-semibold tracking-[0.2em] uppercase">
                {sec?.subtitle || 'Products'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-blue dark:text-white leading-tight tracking-tight reveal reveal-delay-1">
              {sec?.title || 'Our Products'}
            </h2>
          </div>
          <p className="hidden md:block text-slate-400 dark:text-white/35 text-sm leading-relaxed max-w-xs pt-8 reveal reveal-delay-2">
            {sec?.content?.split('.')[0] || ''}.
          </p>
        </div>

        {/* Products */}
        <div className={`grid gap-3 ${products.length >= 3 ? 'md:grid-cols-3' : products.length === 2 ? 'md:grid-cols-2' : ''}`}>
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`group relative border border-slate-200 dark:border-white/5 bg-white dark:bg-surface hover:border-ice-blue/30 dark:hover:border-ice-blue/20 shadow-sm dark:shadow-none transition-all duration-500 overflow-hidden reveal reveal-delay-${Math.min(i + 1, 4)} ${
                i === 0 && products.length >= 3 ? 'md:row-span-2' : ''
              }`}
            >
              {/* Image area */}
              <div className={`relative overflow-hidden bg-slate-100 dark:bg-muted-blue ${i === 0 && products.length >= 3 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-ice-blue/15 dark:border-ice-blue/10 flex items-center justify-center group-hover:border-ice-blue/30 group-hover:bg-ice-blue/5 dark:group-hover:bg-ice-blue/[0.03] transition-all duration-500">
                      <svg className="h-6 w-6 text-ice-blue/30 dark:text-ice-blue/20 group-hover:text-ice-blue/50 dark:group-hover:text-ice-blue/40 transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                  </div>
                )}
                {product.featured && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 bg-dark-blue/80 dark:bg-dark-blue/80 backdrop-blur text-ice-blue text-[10px] font-semibold tracking-widest uppercase rounded-sm">
                    Featured
                  </span>
                )}
                {/* Hover overlay line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-ice-blue/0 via-ice-blue/0 group-hover:via-ice-blue/40 dark:group-hover:via-ice-blue/30 to-ice-blue/0 transition-all duration-500" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-blue dark:text-white mb-2 tracking-tight group-hover:text-ice-blue/90 transition-colors duration-300">{product.name}</h3>
                <p className="text-slate-500 dark:text-white/35 text-sm leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={goContact}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-ice-blue hover:border-ice-blue/30 hover:bg-ice-blue/5 dark:hover:bg-ice-blue/5 rounded-md text-xs font-medium h-9 px-4 transition-all duration-300"
                  >
                    Request Quote
                  </Button>
                  {settings.whatsapp_number && (
                    <button
                      onClick={() => {
                        const msg = encodeURIComponent(`Hi, I'm interested in ${product.name}. Can you provide a quote?`);
                        window.open(`https://wa.me/${settings.whatsapp_number.replace(/[^0-9+]/g, '')}?text=${msg}`);
                      }}
                      className="text-slate-300 dark:text-white/20 hover:text-ice-blue transition-colors duration-300"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA line */}
        <div className="mt-14 flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-8 reveal">
          <p className="text-slate-400 dark:text-white/25 text-sm">Need a custom order?</p>
          <button
            onClick={goContact}
            className="flex items-center gap-1.5 text-ice-blue/80 dark:text-ice-blue/70 hover:text-ice-blue text-sm font-medium transition-colors duration-300 group"
          >
            Get in touch
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
