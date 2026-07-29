import { defineField, defineType } from "sanity";

export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The industry's display name, e.g. 'Construction' or 'Hospitality'.",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A short explanation of how Canbri serves this industry, shown on the Industries section of the site.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orderRank",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first. Leave at 0 if order doesn't matter.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
