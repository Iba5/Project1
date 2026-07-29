/**
 * SEO structured data components.
 * - FaqJsonLd: FAQPage schema (Google FAQ rich results)
 * - ProductCatalogJsonLd: ItemList of Products (Google product rich results)
 * - BreadcrumbJsonLd: BreadcrumbList for the single-page site
 */
import type { Product } from "@/lib/cms";

const siteUrl = "https://canbri.co.zw";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I request a quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "The fastest way is WhatsApp — message us with what you need (product, quantity, delivery location) and we'll respond during business hours. You can also call us, email, or fill in the contact form on this page. We quote by request because pricing depends on quantity, location and whether it's a recurring order.",
      },
    },
    {
      "@type": "Question",
      name: "Do you deliver across Harare and Murewa?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. We run scheduled delivery routes across Harare and Murewa five days a week, with Saturday delivery available by arrangement. Cold-chain handling for ice products is built into our logistics. Bulk and recurring orders can be set up on standing delivery schedules.",
      },
    },
    {
      "@type": "Question",
      name: "Can I order in bulk or on a recurring schedule?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Absolutely. Bulk orders and recurring supply are welcome across every division — tools and hardware, fabrication, PPE, stationery and ice blocks. Many of our business customers run weekly or monthly standing orders. Bulk pricing applies and we can accommodate seasonal or event-based spikes.",
      },
    },
    {
      "@type": "Question",
      name: "What industries do you supply?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "We supply construction and contracting, restaurants and hotels, retail and supermarkets, manufacturing and fabrication, events and catering, fisheries and cold chain, schools and offices, and households. If your sector isn't listed, reach out — we're adding new customers all the time.",
      },
    },
    {
      "@type": "Question",
      name: "Why don't you publish prices online?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Because pricing depends on quantity, delivery location, and whether it's a one-off or a recurring order. A single hammer costs differently from a case of hammers delivered to a site weekly. We prefer to quote accurately rather than publish ballpark figures that might mislead.",
      },
    },
    {
      "@type": "Question",
      name: "What is your return or exchange policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "If a product is defective or doesn't match what was quoted, we'll exchange it or arrange a refund. Because we quote by request, the product you receive should match the specification we agreed on. Contact us on WhatsApp, phone or email and we'll sort it out promptly.",
      },
    },
  ],
};

export function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

/**
 * Product catalog schema — emits an ItemList of Products with their categories,
 * descriptions and images. Helps Google show product rich results.
 */
export function ProductCatalogJsonLd({ products }: { products: Product[] }) {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Canbri Product Catalogue",
    description:
      "Five divisions — Tools & Hardware, Fabrication, PPE, Stationery and Ice Blocks — supplied across Harare and Murewa.",
    numberOfItems: products.length,
    itemListElement: products.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Product",
        name: p.name,
        category: p.category,
        description: p.shortDescription,
        image: `${siteUrl}${p.image}`,
        url: `${siteUrl}/#products`,
        brand: { "@type": "Brand", name: "Canbri" },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "PriceSpecification",
            valueAddedTaxIncluded: false,
          },
          seller: { "@type": "Organization", name: "Canbri Private Limited" },
        },
        additionalProperty: (p.specs ?? []).map((s) => ({
          "@type": "PropertyValue",
          name: s.label,
          value: s.value,
        })),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
    />
  );
}

/**
 * Breadcrumb schema — for the single-page site we represent the
 * canonical Home > Products trail.
 */
export function BreadcrumbJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/#products`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
