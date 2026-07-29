import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The product's display name, e.g. 'Angle Grinder 4.5\"' or 'Dust Mask (Box of 50)'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier, generated from the Name. Click 'Generate' after typing a name.",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Which product category this belongs to. Controls where it appears when filtering by category on the site.",
      options: {
        list: [
          "Tools & Hardware",
          "Fabrication",
          "PPE",
          "Stationery",
          "Ice Blocks",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "A one- or two-sentence summary shown on product cards and listings. Max 220 characters.",
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "longDescription",
      title: "Long description",
      type: "text",
      rows: 5,
      description: "Optional, more detailed description shown on the product's own detail page.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Main product photo. Use a clear, well-lit image on a plain background where possible.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      description: "Toggle on to show this product in the featured section on the homepage.",
      initialValue: false,
    }),
    defineField({
      name: "orderRank",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first within its category. Leave at 0 if order doesn't matter.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
  },
});
