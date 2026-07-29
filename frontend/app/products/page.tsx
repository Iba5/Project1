import type { Metadata } from "next";
import { SectionHeading } from "@/components/website/section-heading";
import { CtaBand } from "@/components/website/cta-band";
import { ProductsBrowser } from "@/components/website/products-browser";
import { getProducts, getProductCategories, getSiteSettings, quoteWhatsAppHref } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Tools and hardware, fabrication, PPE, stationery and ice blocks from Canbri Private Limited. Bulk orders welcome, delivery across Harare and Murewa. Request a quote.",
};

export default async function ProductsPage() {
  const [products, productCategories, site] = await Promise.all([
    getProducts(),
    getProductCategories(),
    getSiteSettings(),
  ]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  return (
    <>
      <section className="surface-navy band-top">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ice">
            Our Products
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Five divisions. Quote-driven pricing. Reliable delivery.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Each division is structured so new products can be added without
            redesigning the site. We do not publish prices; quotations are
            prepared based on quantity, delivery location and recurring supply.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Catalogue"
            title="Browse by division."
            description="Filter by category to see what each division supplies. Don't see a specific item? Message us on WhatsApp; if we don't stock it, we'll try to source it."
          />

          <div className="mt-8">
            <ProductsBrowser
              products={products}
              categories={productCategories}
              whatsappNumber={site.whatsappNumber}
            />
          </div>

          <div className="mt-12 rounded-xl border border-border bg-secondary/50 p-6">
            <h2 className="font-display text-lg font-semibold text-brand-heading">
              Adding new products later
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              New product lines can be added in two ways: by appending an
              entry to{" "}
              <code className="rounded bg-background px-1.5 py-0.5 text-xs">content/products.ts</code>{" "}
              (no code changes elsewhere, requires a redeploy), or by adding
              the product in Sanity Studio if the CMS is connected. Either
              path renders the new product on this page automatically.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <CtaBand
          title="Need a product you don't see here?"
          description={`We stock more than we can list. Tell us what you need; bulk orders, site supply, recurring delivery; and we'll quote you on WhatsApp.`}
          primaryLabel="Request a Quote"
          primaryHref={whatsappHref}
          external
          secondaryLabel="Call Us"
          secondaryHref={site.callHref}
        />
      </section>
    </>
  );
}
