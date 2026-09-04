import {
  MessageCircle,
  ShieldCheck,
  Truck,
  PackageCheck,
  Headset,
  MapPin,
  Phone,
  Mail,
  Clock,
  Eye,
  Users,
  Award,
  HardHat,
  UtensilsCrossed,
  ShoppingBag,
  Factory,
  PartyPopper,
  Fish,
  GraduationCap,
  Home,
} from "lucide-react";
import { SectionHeading } from "@/components/website/section-heading";
import { CtaBand } from "@/components/website/cta-band";
import { ContactForm } from "@/components/website/contact-form";
import { FaqSectionClient } from "@/components/website/faq-section-client";
import { ProductFilter } from "@/components/website/product-filter";
import { FaqJsonLd, ProductCatalogJsonLd, BreadcrumbJsonLd } from "@/components/website/seo-schema";
import { MarqueeBar } from "@/components/website/marquee-bar";
import { StatsBar } from "@/components/website/stats-bar";
import { DivisionsGrid } from "@/components/website/divisions-grid";
import { FeaturedSpotlight } from "@/components/website/featured-spotlight";
import { SpotlightCard } from "@/components/website/spotlight-card";
import { HeroSection } from "@/components/website/hero-section";
import { IceBand } from "@/components/website/ice-band";
import {
  getFeaturedProducts,
  getProducts,
  getProductCategories,
  getIndustries,
  getCompanyValues,
  getHomepage,
  getAbout,
  getSiteSettings,
  getContact,
  quoteWhatsAppHref,
} from "@/lib/cms";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/website/scroll-reveal";
import { CompareDrawer } from "@/components/website/compare-drawer";
import { RecentlyViewed } from "@/components/website/recently-viewed";
import { WishlistSection } from "@/components/website/wishlist-section";
import { SectionDivider } from "@/components/website/section-divider";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [featuredProducts, allProducts, categories, industries, values, homepage, about, site, contact] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getProductCategories(),
    getIndustries(),
    getCompanyValues(),
    getHomepage(),
    getAbout(),
    getSiteSettings(),
    getContact(),
  ]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  return (
    <>
      <FaqJsonLd />
      <ProductCatalogJsonLd products={allProducts} />
      <BreadcrumbJsonLd />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection
        heroKicker={`${site.companyName.toUpperCase()} — HARARE & MUREWA`}
        heroDescription={homepage.heroDescription}
        ctaOne={homepage.ctaOne}
        ctaOneLink={homepage.ctaOneLink}
        ctaOneStyle={homepage.ctaOneStyle}
        whatsappHref={whatsappHref}
        callHref={site.callHref}
        callDisplay={site.callDisplay}
        divisionsCount={categories.length}
        divisionNames={categories}
      />

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <StatsBar
        stats={
          homepage.stats.length > 0
            ? homepage.stats.map((s) => ({
                value: s.value,
                label: s.label,
                description:
                  {
                    Divisions: "Under one roof",
                    Locations: "Harare & Murewa",
                    Pricing: "Accurate to your order",
                    Orders: "Standing orders too",
                  }[s.label] ?? "",
              }))
            : undefined
        }
      />

      {/* ── Marquee trust strip ──────────────────────────────────────────── */}
      <MarqueeBar
        items={categories.map(
          (c, i) => `${["PPE", "STA", "TLS", "FAB", "ICE"][i % 5]}-0${i + 1} · ${c.toUpperCase()}`,
        )}
      />

      {/* ── Divisions ────────────────────────────────────────────────────── */}
      <section id="divisions" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Our Divisions"
              title="Five divisions. One manifest."
              description="Every job on your site draws from one of five Canbri divisions. Tap a tag to see what's inside."
            />
          </ScrollReveal>
          <DivisionsGrid categories={categories} products={allProducts} />
        </div>
      </section>

      {/* ── About preview ────────────────────────────────────────────────── */}
      <section id="about" className="bg-secondary/40 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <ScrollReveal direction="left" className="lg:col-span-5">
              <SectionHeading
                kicker="About Canbri"
                numeral="01"
                title={homepage.aboutPreviewTitle}
                description={homepage.aboutPreviewDescription}
              />
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-brand-heading">{about.whoWeAreTitle}</h3>
                  {(Array.isArray(about.whoWeAre) ? about.whoWeAre : [about.whoWeAre]).map((paragraph: string, i: number) => (
                    <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid gap-4 sm:grid-cols-3 lg:col-span-7" staggerDelay={0.1}>
              {homepage.aboutPreviewCards.map((card, i) => {
                const Icon = [Users, Award, Eye][i % 3];
                return (
                  <StaggerItem key={card.title}>
                    <div className="group card-hover relative h-full overflow-hidden rounded-xl border border-border bg-card p-5">
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-accent/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                      <span className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent text-brand-accent-fg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <Icon className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <h3 className="relative mt-4 font-display text-base font-semibold text-brand-heading">
                        {card.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>

          {/* Mission & Vision */}
          <ScrollReveal delay={0.2}>
            <div className="mt-16 grid gap-10 lg:grid-cols-2">
              <div className="card-hover rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                    <Award className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-brand-heading">{about.missionTitle}</h3>
                </div>
                {(Array.isArray(about.mission) ? about.mission : [about.mission]).map((paragraph: string, i: number) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
                ))}
              </div>
              <div className="card-hover rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                    <Eye className="h-4 w-4" strokeWidth={2.25} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-brand-heading">{about.visionTitle}</h3>
                </div>
                {(Array.isArray(about.vision) ? about.vision : [about.vision]).map((paragraph: string, i: number) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Products / quote builder ─────────────────────────────────────── */}
      <section id="products" className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <ScrollReveal>
            <SectionHeading
              kicker="Sample Catalogue"
              title="Build your quote request."
              description="Add what you need from the list below, then send your quote straight to WhatsApp."
              className="max-w-3xl [&_h2]:text-4xl [&_h2]:sm:text-5xl"
            />
          </ScrollReveal>

          <ProductFilter
            products={allProducts}
            categories={categories}
            whatsappNumber={site.whatsappNumber}
          />
        </div>
      </section>

      {/* ── Ice highlight band (folded into Products — Ice has no top-level nav entry) ── */}
      <IceBand whatsappHref={whatsappHref} />

      {/* ── Featured product spotlight (auto-rotates through all featured items) ── */}
      {featuredProducts.length > 0 && (
        <FeaturedSpotlight
          products={featuredProducts}
          whatsappNumber={site.whatsappNumber}
        />
      )}

      {/* ── Recently viewed (only renders if 2+ items in localStorage) ──── */}
      <RecentlyViewed />

      {/* ── Wishlist (only renders if user has saved any products) ──── */}
      <WishlistSection />

      {/* ── Industries we serve ──────────────────────────────────────────── */}
      <section id="industries" className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <ScrollReveal>
            <SectionHeading
              kicker="Who We Serve"
              title="Built for real industries."
              description="From construction sites to hospitality, schools to fisheries; Canbri supplies the tools, materials, PPE and ice that keep operations moving."
              align="center"
              className="mx-auto"
            />
          </ScrollReveal>

          <StaggerContainer className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {industries.slice(0, 8).map((ind, i) => {
              const Icon = [
                HardHat,
                UtensilsCrossed,
                ShoppingBag,
                Factory,
                PartyPopper,
                Fish,
                GraduationCap,
                Home,
              ][i % 8];
              return (
                <StaggerItem key={ind.slug}>
                  <article className="group card-hover h-full rounded-xl border border-border bg-card p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/60 text-brand-accent-fg transition-colors duration-300 group-hover:bg-brand-accent">
                      <Icon className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold text-brand-heading">
                      {ind.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {ind.description}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Why choose Canbri ────────────────────────────────────────────── */}
      <SectionDivider from="secondary" to="navy" variant="wave" />
      <section className="surface-navy band-top relative overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Why Canbri"
              title="One call covers the whole job."
              description="Five divisions under one supplier means one relationship, one delivery schedule, and one number to call."
              tone="white"
            />
          </ScrollReveal>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.12}>
            {values.map((v, i) => {
              const Icon = [
                ShieldCheck,
                Truck,
                PackageCheck,
                Headset,
              ][i % 4];
              return (
                <StaggerItem key={v.title}>
                  <SpotlightCard
                    className="h-full rounded-2xl bg-white/[0.04] ring-1 ring-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:-translate-y-1 hover:ring-brand-ice/30"
                    spotlightColor="rgba(255,255,255,0.12)"
                  >
                    <div className="relative h-full p-6">
                      {/* Large faded number */}
                      <span
                        className="pointer-events-none absolute -right-2 -top-3 font-display text-7xl font-bold text-white/[0.06] transition-colors duration-300 group-hover:text-white/[0.10]"
                        aria-hidden
                      >
                        0{i + 1}
                      </span>
                      <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent text-brand-accent-fg transition-transform duration-300 hover:scale-110">
                        <Icon className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <h3 className="relative mt-5 font-display text-lg font-semibold text-white">
                        {v.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                        {v.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <SectionDivider from="navy" to="background" variant="wave" />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <ScrollReveal>
            <SectionHeading
              kicker="Frequently Asked Questions"
              title="Common questions, answered."
              description="Everything you need to know about ordering, delivery, and working with Canbri."
              align="center"
              className="mx-auto"
            />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="mt-8">
              <FaqSectionClient />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <ScrollReveal>
            <CtaBand
              title={homepage.ctaBandTitle}
              description={homepage.ctaBandDescription}
              primaryLabel={whatsappHref ? "WhatsApp Us" : "Get in Touch"}
              primaryHref={whatsappHref || "#contact"}
              external={Boolean(whatsappHref)}
              secondaryLabel="Go to Contact"
              secondaryHref="#contact"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Contact & Quote ──────────────────────────────────────────────── */}
      <section id="contact" className="surface-navy band-top relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <ScrollReveal direction="left" className="lg:col-span-5">
              <SectionHeading kicker="Get in Touch" title="Talk to Canbri." tone="white" />

              <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-accent">
                  Head Office
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-ice" strokeWidth={2.25} />
                    <p className="text-sm text-white/80">{site.address}</p>
                  </div>
                  {site.callHref && (
                    <a href={site.callHref} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                      <Phone className="h-4 w-4 shrink-0 text-brand-ice" strokeWidth={2.25} />
                      {site.callDisplay}
                    </a>
                  )}
                  {site.emailHref && (
                    <a href={site.emailHref} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                      <Mail className="h-4 w-4 shrink-0 text-brand-ice" strokeWidth={2.25} />
                      {site.email}
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Clock className="h-4 w-4 shrink-0 text-brand-ice" strokeWidth={2.25} />
                    {site.businessHours}
                  </div>
                </div>
              </div>

              {contact.branches
                .filter((b) => /murewa|murehwa/i.test(b.city))
                .map((b) => (
                  <div key={b.city} className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-accent">
                      Ice Depot &mdash; {b.city}
                    </p>
                    <div className="mt-4 flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-ice" strokeWidth={2.25} />
                      <p className="text-sm text-white/80">{b.addressLines.join(", ")}</p>
                    </div>
                  </div>
                ))}

              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-md border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                  WhatsApp {site.whatsappDisplay}
                </a>
              )}
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15} className="lg:col-span-7">
              <div className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-accent">
                  Request a Quote
                </p>
                <h3 className="mt-1 font-display text-lg font-bold uppercase text-brand-heading">
                  Tell us what you need
                </h3>
                <div className="mt-6">
                  <ContactForm categories={categories} />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Compare drawer (slide-over) ─────────────────────────────────── */}
      <CompareDrawer
        whatsappNumber={site.whatsappNumber}
        fullProducts={allProducts}
      />
    </>
  );
}
