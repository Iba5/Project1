import { defineField, defineType } from "sanity";

export const companyValue = defineType({
  name: "companyValue",
  title: "Company Value",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The value's name, e.g. 'Integrity' or 'Reliability'. Kept short — shown as a heading.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A sentence or two explaining what this value means in practice at Canbri.",
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
    select: { title: "title" },
  },
});
