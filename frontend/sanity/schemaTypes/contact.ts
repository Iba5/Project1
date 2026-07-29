import { defineField, defineType } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",

  fields: [
    defineField({
      name: "intro",
      title: "Intro Text",
      type: "text",
      rows: 3,
      description: "Short intro shown at the top of the Contact page.",
    }),

    defineField({
      name: "branches",
      title: "Branches",
      type: "array",
      description: "One entry per physical location. Add, remove or reorder freely.",
      of: [
        {
          type: "object",
          name: "branch",
          fields: [
            defineField({
              name: "city",
              title: "City",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. Harare Branch, Head Office",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "addressLines",
              title: "Address Lines",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "phone",
              title: "Phone (display)",
              type: "string",
            }),
            defineField({
              name: "phoneHref",
              title: "Phone Link",
              type: "string",
              description: "e.g. tel:+263770000000",
            }),
            defineField({
              name: "hours",
              title: "Hours",
              type: "string",
            }),
            defineField({
              name: "mapsEmbedUrl",
              title: "Google Maps Embed URL",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "city" },
          },
        },
      ],
    }),

    defineField({
      name: "googleMaps",
      title: "Google Maps URL (general)",
      type: "url",
      description: "Fallback map link if a branch doesn't have its own embed.",
    }),
  ],
});
