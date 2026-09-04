"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/website/announcement-bar";
import { SiteSidebar } from "@/components/website/site-sidebar";
import { SiteFooter } from "@/components/website/site-footer";
import type { NavLink, Branch } from "@/lib/cms";

type SiteChromeProps = {
  children: React.ReactNode;
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
  address: string;
  navLinks: NavLink[];
  branches: Branch[];
  whatsappHref: string;
};

/** Swaps between the marketing-site sidebar chrome and a bare passthrough
 * for /admin, since the admin dashboard has its own full-screen layout. */
export function SiteChrome({ children, whatsappHref, ...footerProps }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <SiteSidebar
        companyName={footerProps.companyName}
        navLinks={footerProps.navLinks}
        callHref={footerProps.callHref}
        callDisplay={footerProps.callDisplay}
        whatsappHref={whatsappHref}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <AnnouncementBar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter {...footerProps} />
      </div>
    </div>
  );
}
