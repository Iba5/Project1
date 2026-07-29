import type { StructureResolver } from "sanity/structure";

/**
 * Custom desk structure (see sanity.config.ts, wired in via structureTool({ structure })).
 *
 * `homepage`, `about`, `contact` and `siteSettings` are singletons: exactly
 * one document of each type should ever exist. The default Studio desk
 * structure lists every document type as a collection, which makes it easy
 * for an editor to accidentally create a second "Homepage" document. This
 * structure instead pins each singleton to a single, directly-editable item.
 */

const SINGLETON_TYPES = new Set(["homepage", "about", "contact", "siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),

      S.listItem()
        .title("About")
        .id("about")
        .child(S.document().schemaType("about").documentId("about")),

      S.listItem()
        .title("Contact")
        .id("contact")
        .child(S.document().schemaType("contact").documentId("contact")),

      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      // Every other (non-singleton) document type keeps the default list view.
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
