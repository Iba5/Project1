import type { Metadata } from "next";
import { SectionHeading } from "@/components/website/section-heading";
import { CtaBand } from "@/components/website/cta-band";
import { RichText } from "@/components/website/rich-text";
import { getCompanyValues, getAbout, getSiteSettings, quoteWhatsAppHref } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Canbri Private Limited is a diversified Zimbabwean supplier across tools and hardware, fabrication, PPE, stationery and ice blocks. Learn who we are, our mission and our vision.",
};

export default async function AboutPage() {
  const [values, about, site] = await Promise.all([
    getCompanyValues(),
    getAbout(),
    getSiteSettings(),
  ]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  return (
    <>
      <section className="surface-navy band-top">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ice">
            About Us
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {about.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {about.heroDescription}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading kicker="Who We Are" title={about.whoWeAreTitle} />
            </div>
            <div className="lg:col-span-7">
              <RichText
                value={about.whoWeAre}
                className="prose-canbri space-y-5 text-base leading-relaxed text-foreground/85"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading kicker="Our Mission" title={about.missionTitle} />
            </div>
            <div className="lg:col-span-7">
              <RichText
                value={about.mission}
                className="prose-canbri space-y-5 text-base leading-relaxed text-foreground/85"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading kicker="Our Vision" title={about.visionTitle} />
            </div>
            <div className="lg:col-span-7">
              <RichText
                value={about.vision}
                className="prose-canbri space-y-5 text-base leading-relaxed text-foreground/85"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Why Choose Canbri"
            title="Four reasons customers stay with us."
            align="center"
            className="mx-auto"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-base font-semibold text-brand-heading">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <CtaBand
          title={about.ctaTitle}
          description={about.ctaDescription}
          primaryLabel="WhatsApp Us"
          primaryHref={whatsappHref}
          external
          secondaryLabel="See Products"
          secondaryHref="/products"
        />
      </section>
    </>
  );
}
