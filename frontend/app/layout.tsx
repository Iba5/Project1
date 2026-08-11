import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/components/website/theme-provider";
import { SiteHeader } from "@/components/website/site-header";
import { SiteFooter } from "@/components/website/site-footer";
import { FloatingActions } from "@/components/website/floating-actions";
import { BackToTop } from "@/components/website/back-to-top";
import { CookieConsent } from "@/components/website/cookie-consent";
import { ScrollProgress } from "@/components/website/scroll-progress";
import { SectionNavigator } from "@/components/website/section-navigator";
import { MobileBottomNav } from "@/components/website/mobile-bottom-nav";
import { CompareTray } from "@/components/website/compare-tray";
import { KeyboardShortcutsModal } from "@/components/website/keyboard-shortcuts-modal";
import { PromoBanner } from "@/components/website/promo-banner";
import { QuoteCartDrawer } from "@/components/website/quote-cart-drawer";
import {
  getSiteSettings,
  getContact,
  getProducts,
  getIndustries,
  quoteWhatsAppHref,
} from "@/lib/cms";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = "https://canbri.co.zw";

// The root layout fetches live site settings/products/industries from the
// backend on every request. Forcing dynamic rendering means every page is
// fetched at request time instead of frozen into the build — required so
// `next build` doesn't need a reachable backend, and so admin-edited
// settings (prices, contact info, etc.) show up without a redeploy.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Canbri Private Limited — Tools, Hardware, Fabrication, PPE, Stationery & Ice",
    template: "%s | Canbri Private Limited",
  },
  description:
    "Canbri Private Limited supplies tools and hardware, fabrication services, PPE, stationery and ice blocks across Harare and Murewa. Reliable delivery, bulk orders welcome. Cool & Cold.",
  keywords: [
    "Canbri",
    "Canbri Private Limited",
    "tools and hardware Zimbabwe",
    "fabrication Harare",
    "PPE Zimbabwe",
    "stationery supplier",
    "ice blocks Harare",
    "ice cubes Murewa",
    "Harare supplier",
    "Murewa supplier",
  ],
  authors: [{ name: "Canbri Private Limited" }],
  creator: "Canbri Private Limited",
  publisher: "Canbri Private Limited",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Canbri Private Limited — Cool & Cold",
    description:
      "Tools & hardware, fabrication, PPE, stationery and ice blocks. Reliable delivery across Harare and Murewa.",
    url: siteUrl,
    siteName: "Canbri Private Limited",
    locale: "en_ZW",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Canbri Private Limited — Tools, Hardware, Fabrication, PPE, Stationery & Ice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canbri Private Limited — Cool & Cold",
    description:
      "Tools & hardware, fabrication, PPE, stationery and ice blocks. Reliable delivery across Harare and Murewa.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Canbri Private Limited",
  alternateName: "Canbri Ice",
  slogan: "Cool & Cold",
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  description:
    "Canbri Private Limited supplies tools and hardware, fabrication services, PPE, stationery and ice blocks across Harare and Murewa.",
  areaServed: ["Harare", "Murewa", "Zimbabwe"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "7th Floor, ZB Chambers, Corner First Street & George Silundika Avenue",
    addressLocality: "Harare",
    addressCountry: "ZW",
  },
  sameAs: [
    "https://www.facebook.com/canbri",
    "https://www.instagram.com/canbri",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, contact, products, industries] = await Promise.all([
    getSiteSettings(),
    getContact(),
    getProducts(),
    getIndustries(),
  ]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  // Map to minimal searchable shape (avoid passing full Product objects)
  const searchableProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.image,
    shortDescription: p.shortDescription,
  }));
  const searchableIndustries = industries.map((i) => ({
    slug: i.slug,
    name: i.name,
    description: i.description,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased bg-background text-foreground`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <PromoBanner />
            <SiteHeader
              companyName={site.companyName}
              shortName={site.shortName}
              tagline={site.tagline}
              navLinks={site.navLinks}
              whatsappHref={whatsappHref}
              products={searchableProducts}
              industries={searchableIndustries}
            />
            <main id="main-content" className="flex-1">{children}</main>
            <SiteFooter
              companyName={site.companyName}
              legalName={site.legalName}
              tagline={site.tagline}
              description={site.description}
              deliveryAreas={site.deliveryAreas}
              email={site.email}
              emailHref={site.emailHref}
              callDisplay={site.callDisplay}
              callHref={site.callHref}
              facebook={site.facebook}
              instagram={site.instagram}
              businessHours={site.businessHours}
              navLinks={site.navLinks}
              branches={contact.branches}
            />
          </div>
          <ScrollProgress />
          <SectionNavigator />
          <FloatingActions
            callHref={site.callHref}
            callDisplay={site.callDisplay}
            whatsappHref={whatsappHref}
          />
          <CompareTray />
          <MobileBottomNav callHref={site.callHref} />
          <BackToTop />
          <CookieConsent />
          <KeyboardShortcutsModal />
          <QuoteCartDrawer whatsappNumber={site.whatsappNumber} />
          <SonnerToaster position="bottom-left" richColors closeButton />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
