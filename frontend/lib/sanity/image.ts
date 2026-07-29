import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

/** Resolves a Sanity image reference to a usable URL string. */
export function urlForImage(source: Image) {
  return builder.image(source).auto("format").fit("max").url();
}
