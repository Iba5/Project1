/**
 * Public CMS content types.
 */

export type NavLink = {
  label: string;
  href: string;
};

export type Branch = {
  city: string;
  label: string;
  addressLines: string[];
  phone?: string;
  phoneHref?: string;
  hours?: string;
  mapsEmbedUrl?: string;
};

export type Stat = {
  label: string;
  value: string;
};

export type AboutCard = {
  title: string;
  description: string;
};

export type RichText = string | any[];

export type SiteSettings = {
  companyName: string;
  legalName: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  deliveryAreas: string[];
  email: string;
  emailHref: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  callNumber: string;
  callDisplay: string;
  callHref: string;
  facebook: string;
  instagram: string;
  businessHours: string;
  navLinks: NavLink[];
};

export type Homepage = {
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroBadgeText: string;
  ctaOne: string;
  ctaOneLink: string;
  ctaOneStyle: "internal" | "whatsapp";
  ctaTwo: string;
  ctaTwoLink: string;
  ctaTwoStyle: "internal" | "whatsapp";
  stats: Stat[];
  aboutPreviewTitle: string;
  aboutPreviewDescription: string;
  aboutPreviewCards: AboutCard[];
  ctaBandTitle: string;
  ctaBandDescription: string;
};

export type About = {
  heroTitle: string;
  heroDescription: string;
  whoWeAreTitle: string;
  whoWeAre: RichText;
  missionTitle: string;
  mission: RichText;
  visionTitle: string;
  vision: RichText;
  ctaTitle: string;
  ctaDescription: string;
};

export type Contact = {
  intro: string;
  branches: Branch[];
  googleMaps?: string;
};
