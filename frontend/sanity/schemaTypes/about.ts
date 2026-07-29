import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",

  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    }),

    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "whoWeAreTitle",
      title: "Who We Are: Title",
      type: "string",
    }),

    defineField({
      name: "whoWeAre",
      title: "Who We Are: Body",
      type: "array",
      of: [{ type: "block" }],
      description: "One paragraph per block; renders as rich text.",
    }),

    defineField({
      name: "missionTitle",
      title: "Mission: Title",
      type: "string",
    }),

    defineField({
      name: "mission",
      title: "Mission: Body",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "visionTitle",
      title: "Vision: Title",
      type: "string",
    }),

    defineField({
      name: "vision",
      title: "Vision: Body",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "ctaTitle",
      title: "Bottom CTA: Title",
      type: "string",
    }),

    defineField({
      name: "ctaDescription",
      title: "Bottom CTA: Description",
      type: "text",
      rows: 3,
    }),
  ],
});
