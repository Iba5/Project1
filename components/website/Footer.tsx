'use client';

import { useSiteStore } from '@/lib/store';
import { Snowflake, Facebook, Instagram } from 'lucide-react';

const LINKS = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'products', label: 'Products' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'contact', label: 'Contact' },
];

export function Footer() {
  const { settings } = useSiteStore();

  return (
    <footer className="bg-dark-blue dark:bg-dark-blue border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-ice-blue/10 flex items-center justify-center border border-ice-blue/20">
                <Snowflake className="h-3.5 w-3.5 text-ice-blue" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                {settings.company_name || 'Canbri Ice'}
              </span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed max-w-xs">
              Premium ice products delivered throughout Harare and Murewa.
            </p>
            {/* Social */}
            <div className="flex gap-2 mt-6">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md border border-white/5 flex items-center justify-center text-white/25 hover:text-ice-blue hover:border-ice-blue/20 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-md border border-white/5 flex items-center justify-center text-white/25 hover:text-ice-blue hover:border-ice-blue/20 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">Navigate</p>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(`section-${link.key}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white/35 hover:text-ice-blue text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact mini */}
          <div className="md:col-span-3">
            <p className="text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">Contact</p>
            <ul className="space-y-2.5 text-sm text-white/35">
              <li>Harare & Murewa</li>
              {settings.phone_number && <li>{settings.phone_number}</li>}
              <li>info@canbriice.co.zw</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-white/15 text-xs">
            &copy; {new Date().getFullYear()} {settings.company_name || 'Canbri Ice'}
          </p>
        </div>
      </div>
    </footer>
  );
}