'use client';

import { useSiteStore } from '@/lib/store';
import { MessageCircle, Phone } from 'lucide-react';

export function FloatingButtons() {
  const { settings } = useSiteStore();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Call Now */}
      {settings.phone_number && (
        <a
          href={`tel:${settings.phone_number}`}
          className="w-12 h-12 rounded-lg bg-white dark:bg-surface border border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/50 hover:text-ice-blue hover:border-ice-blue/30 dark:hover:border-ice-blue/20 shadow-md dark:shadow-none flex items-center justify-center transition-all duration-300 hover:scale-105"
          aria-label="Call Now"
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
      {/* WhatsApp */}
      {settings.whatsapp_number && (
        <a
          href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent("Hi, I'm interested in your ice products.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-pulse w-14 h-14 rounded-xl bg-[#25D366] text-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(37,211,102,0.3)]"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}
