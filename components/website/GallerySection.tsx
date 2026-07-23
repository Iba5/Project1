'use client';

import { useSiteStore } from '@/lib/store';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useReveal } from '@/hooks/use-reveal';

export function GallerySection() {
  const { sections, gallery } = useSiteStore();
  const sec = sections.find((s) => s.section === 'gallery');
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const ref = useReveal();

  const open = (url: string, title: string) => { setSelected(url); setSelectedTitle(title); };
  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      const urls = gallery.map((img) => img.imageUrl).filter(Boolean);
      const idx = urls.indexOf(selected);
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowRight' && idx < urls.length - 1) {
        const next = gallery.find((img) => img.imageUrl === urls[idx + 1]);
        if (next) { setSelected(next.imageUrl); setSelectedTitle(next.title); }
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        const prev = gallery.find((img) => img.imageUrl === urls[idx - 1]);
        if (prev) { setSelected(prev.imageUrl); setSelectedTitle(prev.title); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, gallery, close]);

  return (
    <section id="section-gallery" className="py-24 md:py-32 bg-white dark:bg-dark-blue relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200 dark:bg-gradient-to-r dark:from-transparent dark:via-white/5 dark:to-transparent" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="flex items-start justify-between mb-14 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5 reveal">
              <span className="section-line" />
              <span className="text-ice-blue/80 dark:text-ice-blue/70 text-[11px] font-semibold tracking-[0.2em] uppercase">
                {sec?.subtitle || 'Gallery'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-blue dark:text-white leading-tight tracking-tight reveal reveal-delay-1">
              {sec?.title || 'Gallery'}
            </h2>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-lg py-24 flex flex-col items-center reveal">
            <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center mb-4 hover:border-ice-blue/20 hover:bg-ice-blue/5 dark:hover:bg-ice-blue/[0.03] transition-all duration-300">
              <svg className="h-5 w-5 text-slate-300 dark:text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-300 dark:text-white/20 text-sm">Images coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <button
                key={img.id}
                onClick={() => open(img.imageUrl, img.title)}
                className={`gal-item group relative aspect-square overflow-hidden rounded-md bg-slate-100 dark:bg-surface reveal reveal-delay-${Math.min(i % 4 + 1, 4)}`}
              >
                {img.imageUrl ? (
                  <img src={img.imageUrl} alt={img.title || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-slate-200 dark:text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="gal-over absolute inset-0 bg-dark-blue/70 dark:bg-dark-blue/70 flex items-end p-4">
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{img.title || 'Image'}</p>
                    {img.description && <p className="text-white/40 text-xs mt-0.5">{img.description}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{selectedTitle}</DialogTitle>
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
          {selected && (
            <img src={selected} alt={selectedTitle} className="w-full max-h-[80vh] object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}