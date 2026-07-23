'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Snowflake, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSiteStore } from '@/lib/store';

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'products', label: 'Products' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'contact', label: 'Contact' },
];

export function Navbar() {
  const { settings, activeSection, setActiveSection, loaded } = useSiteStore();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isClickNav = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const ids = NAV.map((n) => `section-${n.key}`);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickNav.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = [...visible].sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const sectionKey = sorted[0].target.id.replace('section-', '');
          setActiveSection(sectionKey);
        }
      },
      { threshold: 0.05, rootMargin: '-80px 0px -45% 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loaded, setActiveSection]);

  const handleNav = useCallback((key: string) => {
    isClickNav.current = true;
    setActiveSection(key);
    setMobileOpen(false);
    const el = document.getElementById(`section-${key}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { isClickNav.current = false; }, 1000);
  }, [setActiveSection]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark-blue/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-ice-blue/10 dark:bg-ice-blue/10 flex items-center justify-center border border-ice-blue/20 group-hover:bg-ice-blue/20 group-hover:border-ice-blue/30 transition-all duration-300">
              <Snowflake className="h-4 w-4 text-ice-blue group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div className="text-left">
              <span className="text-dark-blue dark:text-white font-semibold text-[15px] tracking-tight block leading-tight">
                {settings.company_name || 'Canbri Ice'}
              </span>
              {settings.slogan && (
                <span className="text-ice-blue/70 text-[10px] tracking-[0.2em] uppercase font-medium">
                  {settings.slogan}
                </span>
              )}
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`nav-link text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 pb-0.5 ${
                  activeSection === item.key
                    ? 'active text-ice-blue'
                    : 'text-slate-500 dark:text-white/50 hover:text-dark-blue dark:hover:text-white/90'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-white/40 hover:text-ice-blue hover:border-ice-blue/30 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-white/40 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-slate-500 dark:text-white/60 hover:text-dark-blue dark:hover:text-white p-1 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
          <div className="border-t border-slate-200/60 dark:border-white/[0.04] pt-4 space-y-1">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium tracking-wide uppercase transition-all duration-200 ${
                  activeSection === item.key
                    ? 'text-ice-blue bg-ice-blue/5 dark:bg-ice-blue/5'
                    : 'text-slate-500 dark:text-white/50 hover:text-dark-blue dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/[0.02]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
