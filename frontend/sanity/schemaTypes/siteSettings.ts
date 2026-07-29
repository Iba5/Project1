import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "legalName",
      title: "Legal Name",
      type: "string",
      description: "Full registered name, used in the footer copyright line.",
    }),

    defineField({
      name: "shortName",
      title: "Short Name",
      type: "string",
      description: "Used in the header logo and short mentions.",
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),

    defineField({
      name: "description",
      title: "Company Description",
      type: "text",
      rows: 4,
      description: "Used in the footer and as the default SEO description.",
    }),

    defineField({
      name: "url",
      title: "Site URL",
      type: "url",
      description: "Canonical production URL, e.g. https://canbri.co.zw. Used for SEO, sitemap and robots.txt.",
    }),

    defineField({
      name: "deliveryAreas",
      title: "Delivery Areas",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),

    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description:
        "Digits only with country code, e.g. +263770000000. Used to build wa.me links.",
    }),

    defineField({
      name: "whatsappDisplay",
      title: "WhatsApp Number (display)",
      type: "string",
      description: "How the number should be shown to visitors, e.g. +263 77 000 0000.",
    }),

    defineField({
      name: "callNumber",
      title: "Call Number",
      type: "string",
      description: "Digits only with country code, used to build tel: links.",
    }),

    defineField({
      name: "callDisplay",
      title: "Call Number (display)",
      type: "string",
    }),

    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
    }),

    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),

    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "string",
    }),

    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      description: "Links shown in the header and footer navigation, in order.",
      of: [
        {
          type: "object",
          name: "navLink",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              description: "e.g. /about",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
  ],

  preview: {
    select: { title: "companyName" },
  },
});
