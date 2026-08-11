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
import { GalleryGrid } from "@/components/website/gallery-lightbox";
import { ProductFilter } from "@/components/website/product-filter";
import { FaqJsonLd, ProductCatalogJsonLd, BreadcrumbJsonLd } from "@/components/website/seo-schema";
import { TrustBar } from "@/components/website/trust-bar";
import { MarqueeBar } from "@/components/website/marquee-bar";
import { FeaturedSpotlight } from "@/components/website/featured-spotlight";
import { QuoteWizard } from "@/components/website/quote-wizard";
import { SpotlightCard } from "@/components/website/spotlight-card";
import { HowItWorks } from "@/components/website/how-it-works";
import { HeroSection } from "@/components/website/hero-section";
import { DeliveryAreas } from "@/components/website/delivery-areas";
import { SustainabilitySection } from "@/components/website/sustainability-section";
import {
  getFeaturedProducts,
  getProducts,
  getProductCategories,
  getIndustries,
  getCompanyValues,
  getGalleryItems,
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
  const [featuredProducts, allProducts, categories, industries, values, gallery, homepage, about, site, contact] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getProductCategories(),
    getIndustries(),
    getCompanyValues(),
    getGalleryItems(),
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
        heroKicker={homepage.heroKicker}
        heroDescription={homepage.heroDescription}
        rotatingWords={["tools", "hardware", "fabrication", "PPE", "stationery", "ice blocks"]}
        heroTitlePrefix="Premium supply for"
        heroTitleSuffix="across Zimbabwe."
        stats={homepage.stats.map((stat, i) => {
          const numericMatch = stat.value.match(/^\d+/);
          return {
            label: stat.label,
            value: stat.value,
            numeric: numericMatch && i === 0 ? parseInt(numericMatch[0], 10) : undefined,
          };
        })}
        ctaOne={homepage.ctaOne}
        ctaOneLink={homepage.ctaOneLink}
        ctaOneStyle={homepage.ctaOneStyle}
        ctaTwo={homepage.ctaTwo}
        ctaTwoLink={homepage.ctaTwoLink}
        ctaTwoStyle={homepage.ctaTwoStyle}
        whatsappHref={whatsappHref}
        heroImage={homepage.heroImage}
        heroBadgeText={homepage.heroBadgeText ?? undefined}
        heroBadgeLabel={`Latest from ${site.shortName}`}
        divisionsCount={5}
        companyName={site.companyName}
        shortName={site.shortName}
      />

      {/* ── Marquee trust strip ──────────────────────────────────────────── */}
      <SectionDivider from="background" to="background" variant="wave" className="opacity-30 divider-animated" />
      <MarqueeBar />

      {/* ── Trust bar ────────────────────────────────────────────────────── */}
      <TrustBar />

      {/* ── About preview ────────────────────────────────────────────────── */}
      <section id="about" className="bg-secondary/40 pattern-dots gradient-mesh-animated relative overflow-hidden">
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

      {/* ── Products ─────────────────────────────────────────────────────── */}
      <section id="products" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Our Products"
              numeral="02"
              title="Five divisions. One reliable supplier."
              description="From tools and fabrication to PPE, stationery and ice blocks; each division is structured so new lines can be added without redesigning the site."
            />
          </ScrollReveal>

          <ProductFilter
            products={allProducts}
            categories={categories}
            whatsappNumber={site.whatsappNumber}
          />
        </div>
      </section>

      {/* ── Featured product spotlight ───────────────────────────────────── */}
      {featuredProducts[0] && (
        <FeaturedSpotlight
          product={featuredProducts[0]}
          whatsappNumber={site.whatsappNumber}
        />
      )}

      {/* ── Recently viewed (only renders if 2+ items in localStorage) ──── */}
      <RecentlyViewed />

      {/* ── Wishlist (only renders if user has saved any products) ──── */}
      <WishlistSection />

      {/* ── Industries we serve ──────────────────────────────────────────── */}
      <section id="industries" className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Industries We Serve"
              numeral="03"
              title="Built for the sectors that keep Zimbabwe running."
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
      <SectionDivider from="secondary" to="navy" variant="wave" className="divider-animated" />
      <section className="surface-navy band-top relative overflow-hidden">
        {/* Decorative grid + glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        {/* Animated gradient mesh — premium depth effect */}
        <div className="gradient-mesh-animated pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-brand-ice/10 blur-3xl animate-pulse-slow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-1/4 h-72 w-72 rounded-full bg-brand-accent/15 blur-3xl animate-pulse-slow-delayed"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <ScrollReveal>
            <SectionHeading
              kicker="Why Choose Canbri"
              numeral="04"
              title="Four reasons businesses and households stay with us."
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

      {/* ── How It Works ──────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <SectionDivider from="navy" to="background" variant="wave" className="divider-animated" />
      <section id="gallery" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Gallery"
              numeral="05"
              title="Inside Canbri."
              description="Click any image to view full-size. More photos will be added as the company shares them."
            />
          </ScrollReveal>
          <GalleryGrid items={gallery} />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-accent/5 via-transparent to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Frequently Asked Questions"
              numeral="06"
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

      {/* ── Branches ─────────────────────────────────────────────────────── */}
      <section className="bg-secondary/40 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 pattern-dots opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <ScrollReveal>
            <SectionHeading
              kicker="Visit Us"
              numeral="07"
              title="Come see us, or call ahead."
              description="Visit our Harare office, or call ahead and we will have your order ready for collection or delivery."
            />
          </ScrollReveal>
          <StaggerContainer className="mt-10 grid gap-6 sm:max-w-xl" staggerDelay={0.15}>
            {contact.branches.map((b) => (
              <StaggerItem key={b.city}>
                <div className="group card-hover relative h-full overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8">
                  {/* Decorative corner accent */}
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-accent/20 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0"
                    aria-hidden
                  />
                  <div className="relative flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-accent text-brand-accent-fg transition-transform duration-300 group-hover:scale-110">
                      <MapPin className="h-6 w-6" strokeWidth={2.25} />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-brand-heading">
                        {b.label}
                      </h3>
                      <address className="mt-2 not-italic text-sm leading-relaxed text-muted-foreground">
                        {b.addressLines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                      {b.phone && (
                        <p className="mt-4 text-sm text-muted-foreground">
                          <span className="font-medium text-brand-heading">Phone:</span>{" "}
                          <a href={b.phoneHref} className="link-hover-underline hover:text-brand-heading">
                            {b.phone}
                          </a>
                        </p>
                      )}
                      {b.hours && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          <span className="font-medium text-brand-heading">Hours:</span>{" "}
                          {b.hours}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Delivery Areas ──────────────────────────────────────────────── */}
      <DeliveryAreas />

      {/* ── Sustainability & Impact ─────────────────────────────────────── */}
      <SustainabilitySection />

      {/* ── Quick Quote Wizard ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-navy py-16 text-brand-ice lg:py-20">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-accent/15 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-brand-ice/10 blur-3xl" />
          <div className="absolute inset-0 pattern-grid opacity-[0.06]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <ScrollReveal direction="left" className="lg:col-span-5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-ice">
                <span className="h-px w-6 bg-brand-ice/40" aria-hidden />
                Quick Quote
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Get a quote in 30 seconds.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-brand-ice/80">
                Tell us what you need across three quick steps. We&apos;ll compose a WhatsApp message with all the details so you can send it in one tap.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "No account needed",
                  "No spam — we only contact you about your enquiry",
                  "Response during business hours, every working day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-brand-ice/90">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent/25 text-brand-ice">
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15} className="lg:col-span-7">
              <QuoteWizard categories={categories} whatsappNumber={site.whatsappNumber} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Contact & Quote ──────────────────────────────────────────────── */}
      <section id="contact" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <ScrollReveal direction="left" className="lg:col-span-5">
              <SectionHeading
                kicker="Get in Touch"
                numeral="08"
                title="Contact us or request a quote."
                description={contact.intro}
              />

              <div className="mt-8 space-y-4">
                {site.callHref && (
                  <a
                    href={site.callHref}
                    className="group card-hover flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg transition-colors group-hover:bg-primary group-hover:text-white">
                      <Phone className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-heading">Call Us</p>
                      <p className="text-sm text-muted-foreground">{site.callDisplay}</p>
                    </div>
                  </a>
                )}

                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group card-hover flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#25D366] text-white">
                      <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-heading">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">{site.whatsappDisplay}</p>
                    </div>
                  </a>
                )}

                {site.emailHref && (
                  <a
                    href={site.emailHref}
                    className="group card-hover flex items-center gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg transition-colors group-hover:bg-primary group-hover:text-white">
                      <Mail className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-heading">Email</p>
                      <p className="text-sm text-muted-foreground">{site.email}</p>
                    </div>
                  </a>
                )}

                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                    <Clock className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-heading">Business Hours</p>
                    <p className="text-sm text-muted-foreground">{site.businessHours}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15} className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="font-display text-lg font-semibold text-brand-heading">
                  Send Us a Message
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill in the form below and we&apos;ll get back to you during business hours.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
      </section>

      {/* ── Compare drawer (slide-over) ─────────────────────────────────── */}
      <CompareDrawer
        whatsappNumber={site.whatsappNumber}
        fullProducts={allProducts}
      />
    </>
  );
}
