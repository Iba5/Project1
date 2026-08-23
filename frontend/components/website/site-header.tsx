"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/website/theme-toggle";
import { SearchBar } from "@/components/website/search-bar";
import { CartTrigger } from "@/components/website/cart-trigger";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { NavLink as NavLinkType } from "@/lib/cms";

type SearchableProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  shortDescription: string;
};

type SearchableIndustry = {
  slug: string;
  name: string;
  description: string;
};

type SiteHeaderProps = {
  companyName: string;
  shortName: string;
  tagline: string;
  navLinks: NavLinkType[];
  whatsappHref: string;
  products: SearchableProduct[];
  industries: SearchableIndustry[];
};

export function SiteHeader({
  companyName,
  shortName,
  tagline,
  navLinks,
  whatsappHref,
  products,
  industries,
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [navLinks]);

  const handleQuoteClick = () => {
    trackEvent("whatsapp_click", "header_quote_btn", {});
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-brand-heading"
          aria-label={`${companyName} home`}
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden>
            <Image
              src="/logo-mark.png"
              alt=""
              fill
              sizes="36px"
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo-mark-light.png"
              alt=""
              fill
              sizes="36px"
              className="hidden object-contain dark:block"
              priority
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight">
              {shortName}
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "nav-underline rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-accent text-brand-accent-fg"
                    : "text-foreground/80 hover:bg-secondary hover:text-brand-heading",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: search + cart + theme + quote (desktop) */}
        <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
          <SearchBar
            products={products}
            industries={industries}
            sections={navLinks.map((l) => ({
              slug: l.href.replace("#", ""),
              name: l.label,
              description: `Jump to ${l.label} section`,
            }))}
            className="max-w-xs"
          />
          <CartTrigger />
          <ThemeToggle />
          {whatsappHref && (
            <Button
              asChild
              size="sm"
              className="bg-brand-accent text-brand-accent-fg hover:bg-brand-accent/90"
            >
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleQuoteClick}
              >
                Request a Quote
              </a>
            </Button>
          )}
        </div>

        {/* Tablet cluster: search + cart + theme + menu */}
        <div className="flex items-center gap-1 lg:hidden">
          <CartTrigger />
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-heading transition-colors hover:bg-secondary"
          >
            {searchOpen ? <X className="h-5 w-5" /> : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            )}
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-heading lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Tablet/mobile search row */}
      {searchOpen && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <SearchBar
              products={products}
              industries={industries}
              sections={navLinks.map((l) => ({
                slug: l.href.replace("#", ""),
                name: l.label,
                description: `Jump to ${l.label} section`,
              }))}
              variant="expanded"
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-border/60 bg-background lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-accent text-brand-accent-fg"
                    : "text-foreground/90 hover:bg-secondary hover:text-brand-heading",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-brand-accent px-4 text-sm font-semibold text-brand-accent-fg"
              onClick={() => {
                setOpen(false);
                handleQuoteClick();
              }}
            >
              Request a Quote
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
