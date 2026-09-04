import {
  industries as seedIndustries,
  companyValues as seedCompanyValues,
} from "@/content/content";
import { siteConfig, branches } from "@/content/site";

import type { Industry, CompanyValue } from "@/content/content";
import type { Homepage, About, Contact } from "./types";


export async function getIndustries(): Promise<Industry[]> {
  return seedIndustries;
}

export async function getCompanyValues(): Promise<CompanyValue[]> {
  return seedCompanyValues;
}

export async function getHomepage(): Promise<Homepage> {
  return {
    heroKicker: `${siteConfig.name} · ${siteConfig.tagline}`,
    heroTitle: "Premium supply solutions for homes, businesses & events.",
    heroDescription:
      "A diversified Zimbabwean supplier with reliable delivery across Harare and Murewa. Bulk orders welcome, every day.",
    heroImage: "/products/ice-blocks.png",
    heroBadgeText:
      "Reliable supply across five divisions. Quote-driven pricing, delivery throughout Harare and Murewa.",
    ctaOne: "Request a Quote",
    ctaOneLink: "#contact",
    ctaOneStyle: "internal",
    ctaTwo: "WhatsApp Us",
    ctaTwoLink: "",
    ctaTwoStyle: "whatsapp",
    stats: [
      { label: "Divisions", value: "5" },
      { label: "Locations", value: "2" },
      { label: "Pricing", value: "Quote-based" },
      { label: "Orders", value: "Bulk welcome" },
    ],
    aboutPreviewTitle: "A diversified Zimbabwean supplier built on reliability.",
    aboutPreviewDescription:
      "Canbri Private Limited trades across five divisions; tools and hardware, fabrication, PPE, stationery and ice blocks. We serve contractors, retailers, schools, hospitality, fisheries, events and households across Harare and Murewa.",
    aboutPreviewCards: [
      {
        title: "Who We Are",
        description:
          "A Zimbabwean private limited company supplying businesses and households across Harare and Murewa.",
      },
      {
        title: "Our Mission",
        description:
          "Reliable supply of quality tools, hardware, PPE, stationery and ice, delivered on time, every time.",
      },
      {
        title: "Our Vision",
        description:
          "To be the trusted one-stop supplier for businesses and households across Zimbabwe.",
      },
    ],
    ctaBandTitle: "Ready to place an order or request a quote?",
    ctaBandDescription:
      "Tell us what you need; bulk orders, recurring supply, fabrication work or ice for an event. We respond on WhatsApp and phone during business hours.",
  };
}

export async function getAbout(): Promise<About> {
  return {
    heroTitle: "A diversified Zimbabwean supplier built on reliability.",
    heroDescription: `${siteConfig.name} trades across five divisions, serving contractors, retailers, schools, hospitality, fisheries, events and households across Harare and Murewa.`,
    whoWeAreTitle: "One company, five divisions, one standard.",
    whoWeAre: [
      `${siteConfig.name} is a Zimbabwean private limited company headquartered in Harare with a second branch in Murewa. We supply five divisions under one roof: tools and hardware, fabrication services, personal protective equipment, stationery, and ice blocks.`,
      "Our customers are contractors, hardware retailers, schools, offices, restaurants, hotels, supermarkets, fisheries, caterers, event organisers and households. Some buy a single item; others run standing orders that we deliver weekly. Both matter to us.",
      "We quote by request rather than publishing prices, because pricing depends on quantity, delivery location and recurring supply. The fastest way to a quote is WhatsApp; we respond during business hours, every working day.",
    ],
    missionTitle: "Reliable supply, on time, every time.",
    mission: [
      "To be the supplier businesses and households in Harare and Murewa can plan around; accurate quotes, on-time delivery, and a dependable catalogue across every division we trade in.",
      "We exist to remove supply friction. Whether that means stocking the hardware a site needs for the week, fabricating a gate to spec, keeping a restaurant in ice through a busy weekend, or running PPE and stationery to a school before term starts; the job is the same: get the right product, to the right place, on time.",
    ],
    visionTitle: "The trusted one-stop supplier across Zimbabwe.",
    vision: [
      "To grow Canbri into the trusted one-stop supplier for businesses and households across Zimbabwe; adding divisions where we can serve customers better, and adding the digital infrastructure (online ordering, customer accounts, payments) that lets our customers buy from us as easily as possible.",
      "The website you are reading is built for that path. Today it is a professional corporate presence; tomorrow it can carry an online catalogue, customer accounts and online payments, without rebuilding what is already here.",
    ],
    ctaTitle: "Want to know if we supply what you need?",
    ctaDescription:
      "Message us on WhatsApp with your requirement; bulk, recurring, or one-off. We will tell you straight away whether we can help.",
  };
}

export async function getContact(): Promise<Contact> {
  return {
    intro:
      "Send a WhatsApp message, call, or fill in the form below. The fastest route to a quote is WhatsApp.",
    branches,
    googleMaps: undefined,
  };
}
