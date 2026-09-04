import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, ArrowLeft, Check } from "lucide-react";
import { getProducts, getSiteSettings, quoteWhatsAppHref } from "@/lib/cms";
import { ProductGallery } from "@/components/website/product-gallery";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} — Canbri Private Limited`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [products, site] = await Promise.all([getProducts(), getSiteSettings()]);
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  const quoteHref = quoteWhatsAppHref(site.whatsappNumber, product.name);
  const galleryImages = product.images ?? [];

  return (
    <>
      {/* ── Banner ───────────────────────────────────────────────────────── */}
      <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden bg-brand-navy">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              Back to Products
            </Link>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
              {product.category}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {product.name}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Details ──────────────────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="text-base leading-relaxed text-muted-foreground">
                {product.longDescription ?? product.shortDescription}
              </p>

              {product.features && product.features.length > 0 && (
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent-fg">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
                {product.minOrder && <span>Min order: {product.minOrder}</span>}
                {product.leadTime && <span>Lead time: {product.leadTime}</span>}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                  Request a Quote
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us how much you need and where — we'll get back to you on WhatsApp.
                </p>
                <a
                  href={quoteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-accent px-5 text-sm font-semibold text-brand-accent-fg transition-colors hover:bg-brand-accent/90"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
            Gallery
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-brand-heading">
            {product.name} in detail.
          </h2>
          <div className="mt-8">
            <ProductGallery productName={product.name} images={galleryImages} />
          </div>
        </div>
      </section>
    </>
  );
}
