import type { Metadata } from "next";
import { SectionHeading } from "@/components/website/section-heading";
import { CtaBand } from "@/components/website/cta-band";
import { getIndustries, getSiteSettings, quoteWhatsAppHref } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Canbri serves construction and contracting, hospitality, retail, manufacturing, events, fisheries, schools, offices and households across Harare and Murewa.",
};

const ICONS: Record<string, string> = {
  "Construction & Contracting": "Hard hat, beam, tools",
  "Restaurants & Hotels": "Plate, fork, glass",
  "Retail & Supermarkets": "Trolley, shelf, box",
  "Manufacturing & Fabrication": "Spark, beam, fixture",
  "Events & Catering": "Marquee, ice, table",
  "Fisheries & Cold Chain": "Fish, ice, cold storage",
  "Schools & Offices": "Book, pen, desk",
  Households: "House, tool, everyday",
};

export default async function IndustriesPage() {
  const [industries, site] = await Promise.all([getIndustries(), getSiteSettings()]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  return (
    <>
      <section className="surface-navy band-top">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ice">
            Industries We Serve
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Built for the sectors that keep Zimbabwe running.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            From construction sites to hospitality, schools to fisheries; Canbri
            supplies the tools, materials, PPE and ice that keep operations moving.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Sectors"
            title="Who we supply."
            description="A non-exhaustive list of the sectors we serve today. New sectors can be added by appending to src/data/content.ts; the page updates automatically."
          />

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <li
                key={ind.slug}
                className="flex flex-col rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-ice">
                  Sector
                </span>
                <h2 className="mt-2 font-display text-lg font-semibold text-brand-heading">
                  {ind.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {ind.description}
                </p>
                <p className="mt-4 text-xs text-muted-foreground/80">
                  {ICONS[ind.name] ?? "Supplied by Canbri"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <CtaBand
          title="Don't see your sector listed?"
          description="If you buy anything across tools, hardware, fabrication, PPE, stationery or ice; we can probably supply you. Send us your requirement on WhatsApp."
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
