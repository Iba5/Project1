import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jf48ftd4";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2026-01-01";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in your .env.local (see .env.example).",
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn is false because caching is handled by Next.js's own fetch cache
  // instead (see lib/sanity/queries.ts + app/api/revalidate/route.ts).
  // That gives us tag-based, on-demand invalidation: pages stay statically
  // cached and fast for visitors, but a Sanity publish webhook can bust
  // just the affected tag instantly instead of waiting on a TTL.
  useCdn: false,
});
