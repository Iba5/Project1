import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "A short caption for this gallery photo, e.g. 'Loading dock, morning dispatch'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier, generated from the Title. Click 'Generate' after typing a title.",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Which gallery section this photo belongs to. Controls filtering on the Gallery page.",
      options: {
        list: ["Factory", "Production", "Packaging", "Deliveries", "Products", "Team"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional extra detail shown when the image is opened full-size.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "The gallery photo. Landscape orientation works best for the grid layout.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
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
    select: { title: "title", subtitle: "category", media: "image" },
  },
});
