import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CACHE_TAGS } from "@/lib/sanity/queries";

/**
 * Called by a Sanity webhook (configured in sanity.io/manage -> API ->
 * Webhooks) whenever a document is published, updated, or deleted.
 *
 * Flow:
 *   Editor clicks Publish in Studio
 *     -> Sanity POSTs the changed document to this route
 *     -> we verify the request actually came from Sanity (signature check)
 *     -> we revalidate only the cache tag for that document's _type
 *     -> the next visitor to a page using that tag gets fresh content,
 *        instantly, without waiting for a timed revalidation window
 *
 * Everything NOT touched by the publish stays served from cache, so this
 * doesn't cost extra Sanity API calls per visitor and works fine on the
 * free tier.
 */

// Maps a Sanity document _type to the cache tag(s) that should be busted
// when a document of that type is published. Keep in sync with
// lib/sanity/queries.ts CACHE_TAGS and the schema types in sanity/schemaTypes.
const TYPE_TO_TAGS: Record<string, string[]> = {
  product: [CACHE_TAGS.product],
  industry: [CACHE_TAGS.industry],
  galleryItem: [CACHE_TAGS.galleryItem],
  companyValue: [CACHE_TAGS.companyValue],
  homepage: [CACHE_TAGS.homepage],
  about: [CACHE_TAGS.about],
  contact: [CACHE_TAGS.contact],
  siteSettings: [CACHE_TAGS.siteSettings],
};

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature", revalidated: false },
        { status: 401 },
      );
    }

    const type = body?._type;
    if (!type) {
      return NextResponse.json(
        { message: "Missing _type in payload", revalidated: false },
        { status: 400 },
      );
    }

    const tags = TYPE_TO_TAGS[type];
    if (!tags) {
      return NextResponse.json(
        { message: `No cache tag mapped for type "${type}"`, revalidated: false },
        { status: 200 },
      );
    }

    tags.forEach((tag) => revalidateTag(tag,"max"));

    return NextResponse.json({
      revalidated: true,
      type,
      tags,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidate webhook error:", err);
    return NextResponse.json(
      { message: "Error revalidating", revalidated: false },
      { status: 500 },
    );
  }
}
