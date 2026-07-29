import type { Metadata } from "next";
import { SectionHeading } from "@/components/website/section-heading";
import { GalleryBrowser } from "@/components/website/gallery-browser";
import { getGalleryItems, getSiteSettings, quoteWhatsAppHref } from "@/lib/cms";
import { CtaBand } from "@/components/website/cta-band";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside Canbri; factory, production, packaging, deliveries and product photos. New photos are added regularly as the company shares them.",
};

export default async function GalleryPage() {
  const [items, site] = await Promise.all([getGalleryItems(), getSiteSettings()]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  return (
    <>
      <section className="surface-navy band-top">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ice">
            Gallery
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Inside Canbri.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            A growing collection of photos from our facility, production,
            packaging, deliveries and product range. More photos will be added
            as they become available.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Photos"
            title="Filter by what you want to see."
            description="Click any photo to view it larger. The gallery is structured so new photos can be added by appending to src/data/content.ts or by wiring a CMS."
          />
          <div className="mt-8">
            <GalleryBrowser items={items} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <CtaBand
          title="Want to visit our facility?"
          description="Customers are welcome to visit our Harare or Murewa branch. Call ahead and we'll have someone ready to show you around."
          primaryLabel="WhatsApp Us"
          primaryHref={whatsappHref}
          external
          secondaryLabel="See Contact"
          secondaryHref="/contact"
        />
      </section>
    </>
  );
}
