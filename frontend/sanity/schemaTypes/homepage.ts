import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",

  fields: [
    defineField({
      name: "heroKicker",
      title: "Hero Kicker",
      type: "string",
      description: "Small label above the hero title, e.g. company name and tagline.",
    }),

    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "heroBadgeText",
      title: "Hero Image Badge Text",
      type: "text",
      rows: 2,
      description: "Short caption shown over the hero image, e.g. 'Latest from Canbri...'",
    }),

    defineField({
      name: "ctaOne",
      title: "Primary Button Label",
      type: "string",
    }),

    defineField({
      name: "ctaOneLink",
      title: "Primary Button Link",
      type: "string",
      description:
        "Where the primary button goes. Use a path starting with / for pages on this site (e.g. /contact#quote, /products), or a full https:// URL for an external link.",
      initialValue: "/contact#quote",
    }),

    defineField({
      name: "ctaOneStyle",
      title: "Primary Button Behavior",
      type: "string",
      description: "Whether the primary button is a normal page link or a WhatsApp redirect.",
      options: {
        list: [
          { title: "Go to a page on this site", value: "internal" },
          { title: "Open WhatsApp with a pre-filled message", value: "whatsapp" },
        ],
      },
      initialValue: "internal",
    }),

    defineField({
      name: "ctaTwo",
      title: "Secondary Button Label",
      type: "string",
    }),

    defineField({
      name: "ctaTwoLink",
      title: "Secondary Button Link",
      type: "string",
      description:
        "Where the secondary button goes. Use a path starting with / for pages on this site, or a full https:// URL for an external link. Leave blank if using the WhatsApp behavior below.",
    }),

    defineField({
      name: "ctaTwoStyle",
      title: "Secondary Button Behavior",
      type: "string",
      description: "Whether the secondary button is a normal page link or a WhatsApp redirect.",
      options: {
        list: [
          { title: "Go to a page on this site", value: "internal" },
          { title: "Open WhatsApp with a pre-filled message", value: "whatsapp" },
        ],
      },
      initialValue: "whatsapp",
    }),

    defineField({
      name: "stats",
      title: "Hero Stats",
      type: "array",
      description: "Small stat blocks under the hero buttons, e.g. Delivery / Catalogue / Orders.",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),

    defineField({
      name: "aboutPreviewTitle",
      title: "About Preview: Title",
      type: "string",
    }),

    defineField({
      name: "aboutPreviewDescription",
      title: "About Preview: Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "aboutPreviewCards",
      title: "About Preview: Cards",
      type: "array",
      description: "Short cards shown next to the About preview, e.g. Who We Are / Mission / Vision.",
      of: [
        {
          type: "object",
          name: "aboutCard",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    }),

    defineField({
      name: "ctaBandTitle",
      title: "Bottom CTA: Title",
      type: "string",
    }),

    defineField({
      name: "ctaBandDescription",
      title: "Bottom CTA: Description",
      type: "text",
      rows: 3,
    }),
  ],
});
