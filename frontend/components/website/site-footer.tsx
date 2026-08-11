import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { NewsletterForm } from "@/components/website/newsletter-form";
import { FooterUtilityLinks } from "@/components/website/footer-utility-links";
import type { NavLink as NavLinkType, Branch } from "@/lib/cms";

type SiteFooterProps = {
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  deliveryAreas: string[];
  email: string;
  emailHref: string;
  callDisplay: string;
  callHref: string;
  facebook: string;
  instagram: string;
  businessHours: string;
  navLinks: NavLinkType[];
  branches: Branch[];
};

export function SiteFooter({
  companyName,
  legalName,
  tagline,
  description,
  deliveryAreas,
  email,
  emailHref,
  callDisplay,
  callHref,
  facebook,
  instagram,
  businessHours,
  navLinks,
  branches,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-navy mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter row */}
        <div className="mb-10 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                Stay Updated
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Get news about new products, seasonal offers and delivery updates.
              </p>
            </div>
            <div className="md:max-w-sm md:flex-1">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden>
                <Image
                  src="/logo-mark-light.png"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-display text-base font-semibold">
                  {companyName}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                  {tagline}
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              {description}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${companyName} on Facebook`}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${companyName} on Instagram`}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              {callHref && (
                <li>
                  <a
                    href={callHref}
                    className="flex items-start gap-2.5 hover:text-white"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-ice" aria-hidden />
                    <span>{callDisplay}</span>
                  </a>
                </li>
              )}
              {emailHref && (
                <li>
                  <a
                    href={emailHref}
                    className="flex items-start gap-2.5 hover:text-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-ice" aria-hidden />
                    <span>{email}</span>
                  </a>
                </li>
              )}
              {branches.map((b) => (
                <li key={b.city} className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-ice" aria-hidden />
                  <span>
                    <span className="font-medium text-white">{b.city}</span>
                    <br />
                    <span className="text-white/70">{b.addressLines.join(", ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + delivery */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              Hours &amp; Delivery
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {businessHours}
            </p>
            {deliveryAreas.length > 0 && (
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Deliveries across{" "}
                <span className="text-white">{deliveryAreas.join(" and ")}</span>.
                Bulk orders welcome.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            &copy; {year} {legalName}. All rights reserved.
          </p>
          <p>{tagline} — reliable supply, every day.</p>
        </div>

        {/* Utility links: admin + cookie preferences */}
        <FooterUtilityLinks />
      </div>
    </footer>
  );
}
