import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jf48ftd4";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const SINGLETON_TYPES = new Set(["homepage", "about", "contact", "siteSettings"]);

export default defineConfig({
  name: "canbri",
  title: "Canbri Content",
  projectId: projectId,
  dataset: dataset,
  basePath: '/studio',
   vite: (prev) => ({
    ...prev,
    css: {
      postcss: {
        plugins: []
      }
    }
  }),
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Singletons are created/managed only through the pinned desk items in
    // sanity/deskStructure.ts, so hide them from the generic "+ Create" menu.
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType)),
  },
  document: {
    // Also remove the "Duplicate" action for singletons, since a second copy
    // would never be queried by the app (queries always take [0]).
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter((action) => action.action !== "duplicate")
        : input,
  },
});
