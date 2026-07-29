import { groq } from "next-sanity";

/**
 * Cache tags, one per Sanity document type. Each adapter fetch below is
 * tagged with the relevant entry here, and app/api/revalidate/route.ts
 * calls revalidateTag() with these same strings when Sanity's publish
 * webhook fires. Keep this list and the webhook's type -> tag mapping in
 * sync if a new schema type is added.
 */
export const CACHE_TAGS = {
  product: "sanity:product",
  industry: "sanity:industry",
  galleryItem: "sanity:galleryItem",
  companyValue: "sanity:companyValue",
  homepage: "sanity:homepage",
  about: "sanity:about",
  contact: "sanity:contact",
  siteSettings: "sanity:siteSettings",
} as const;

/**
 * GROQ projections are written to match the existing app-level types in
 * @content/products and @content/content as closely as possible, so the
 * adapter layer in lib/cms.ts needs minimal reshaping.
 */

export const productsQuery = groq`
  *[_type == "product"] | order(orderRank asc) {
    "slug": slug.current,
    name,
    category,
    shortDescription,
    longDescription,
    "image": image.asset->url,
    featured
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(orderRank asc) {
    "slug": slug.current,
    name,
    category,
    shortDescription,
    longDescription,
    "image": image.asset->url,
    featured
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && category == $category] | order(orderRank asc) {
    "slug": slug.current,
    name,
    category,
    shortDescription,
    longDescription,
    "image": image.asset->url,
    featured
  }
`;

export const industriesQuery = groq`
  *[_type == "industry"] | order(orderRank asc) {
    "slug": slug.current,
    name,
    description
  }
`;

export const galleryItemsQuery = groq`
  *[_type == "galleryItem"] | order(orderRank asc) {
    "slug": slug.current,
    title,
    category,
    description,
    "image": image.asset->url
  }
`;

export const companyValuesQuery = groq`
  *[_type == "companyValue"] | order(orderRank asc) {
    title,
    description
  }
`;
export const homepageQuery = groq`
  *[_type == "homepage"][0] {
    heroKicker,
    heroTitle,
    heroDescription,
    "heroImage": heroImage.asset->url,
    heroBadgeText,
    ctaOne,
    ctaOneLink,
    ctaOneStyle,
    ctaTwo,
    ctaTwoLink,
    ctaTwoStyle,
    stats,
    aboutPreviewTitle,
    aboutPreviewDescription,
    aboutPreviewCards,
    ctaBandTitle,
    ctaBandDescription
  }
`;

export const aboutQuery = groq`
  *[_type == "about"][0] {
    heroTitle,
    heroDescription,
    whoWeAreTitle,
    whoWeAre,
    missionTitle,
    mission,
    visionTitle,
    vision,
    ctaTitle,
    ctaDescription
  }
`;

export const contactQuery = groq`
  *[_type == "contact"][0] {
    intro,
    branches,
    googleMaps
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName,
    legalName,
    shortName,
    tagline,
    description,
    url,
    deliveryAreas,
    email,
    whatsappNumber,
    whatsappDisplay,
    callNumber,
    callDisplay,
    facebook,
    instagram,
    businessHours,
    navLinks
  }
`;