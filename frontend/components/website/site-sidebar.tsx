"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  Wrench,
  Info,
  HelpCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  Phone,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/website/theme-toggle";
import { CartTrigger } from "@/components/website/cart-trigger";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { NavLink as NavLinkType } from "@/lib/cms";

const ICONS: Record<string, typeof Home> = {
  Home,
  Divisions: LayoutGrid,
  Products: ShoppingBag,
  Industries: Wrench,
  About: Info,
  FAQ: HelpCircle,
  Contact: Mail,
};

type SiteSidebarProps = {
  companyName: string;
  navLinks: NavLinkType[];
  callHref: string;
  callDisplay: string;
  whatsappHref: string;
};

export function SiteSidebar({ companyName, navLinks, callHref, whatsappHref }: SiteSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [navLinks]);

  const handleCallClick = () => trackEvent("call_click", "sidebar_call_btn", {});
  const handleWhatsappClick = () => trackEvent("whatsapp_click", "sidebar_whatsapp_btn", {});

  const NavList = () => (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4" aria-label="Primary">
      {navLinks.map((link) => {
        const sectionId = link.href.replace("#", "");
        const isActive = activeSection === sectionId;
        const Icon = ICONS[link.label] ?? Home;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "true" : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
              isActive
                ? "bg-white/10 text-brand-accent"
                : "text-white/70 hover:bg-white/5 hover:text-white",
              collapsed && "justify-center px-2",
            )}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            <span
              className={cn(
                "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-in-out",
                collapsed ? "max-w-0 opacity-0" : "max-w-[140px] opacity-100",
              )}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between gap-3 bg-[var(--brand-navy-deep)] px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2 text-white" aria-label={`${companyName} home`}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-accent text-sm font-black text-brand-accent-fg">
            C
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold tracking-tight">CANBRI</span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-white/60">Private Limited</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <CartTrigger className="text-white hover:bg-white/10" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="bg-[var(--brand-navy-deep)] lg:hidden">
          <NavList />
          <div className="flex flex-col gap-2 px-3 pb-4">
            {callHref && (
              <a
                href={callHref}
                onClick={handleCallClick}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-accent text-sm font-bold uppercase tracking-wider text-brand-accent-fg"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsappClick}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/15 text-sm font-bold uppercase tracking-wider text-white"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-[var(--brand-navy-deep)] transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-[210px]",
        )}
      >
        <div className={cn("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-2")}>
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand-accent">
            <Image src="/logo-mark.png" alt="" fill sizes="36px" className="object-contain p-1" priority />
          </span>
          <span
            className={cn(
              "flex flex-col justify-center overflow-hidden whitespace-nowrap leading-tight text-white transition-[max-width,opacity] duration-200 ease-in-out",
              collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100",
            )}
          >
            <span className="font-display text-sm font-extrabold tracking-tight">CANBRI</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Private Limited
            </span>
          </span>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        <NavList />

        <div className="flex flex-col gap-2 border-t border-white/10 px-3 py-4">
          <div className={cn("flex items-center gap-1", collapsed ? "flex-col" : "justify-between")}>
            <ThemeToggle />
            <CartTrigger className="text-white hover:bg-white/10" />
          </div>
          {callHref && (
            <a
              href={callHref}
              onClick={handleCallClick}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-accent text-xs font-bold uppercase tracking-wider text-brand-accent-fg transition-colors hover:bg-brand-accent/90",
                collapsed && "px-0",
              )}
            >
              <Phone className="h-4 w-4 shrink-0" />
              {!collapsed && "Call Now"}
            </a>
          )}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappClick}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/15 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/5",
                collapsed && "px-0",
              )}
            >
              {!collapsed && "WhatsApp"}
              {collapsed && <span className="text-[10px]">WA</span>}
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
