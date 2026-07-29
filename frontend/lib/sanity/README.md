# Connecting your Sanity project

1. Find your Project ID at https://www.sanity.io/manage (or wherever you ran `sanity init`).
2. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
   (Use whatever your dataset is actually named if it isn't `production`.)
3. Add your Next.js site's URL to CORS Origins in Sanity Manage, so the
   browser can talk to the API (Settings → API → CORS Origins).
4. Deploy Sanity Studio so you have somewhere to add content:
   ```
   npx sanity deploy
   ```
   This uses `sanity.config.ts` at the project root and the schemas in
   `sanity/schemaTypes/`.
5. In the deployed Studio, add at least one Product, Industry, Gallery Item,
   and Company Value so the pages aren't empty.
6. Redeploy the Next.js site (or restart `next dev`) with the env vars set.
   `lib/cms/index.ts` detects `NEXT_PUBLIC_SANITY_PROJECT_ID` automatically
   and switches from the static seed data to live Sanity content — no other
   code changes needed.

## Notes

- Until step 2 is done, the site keeps working off the static seed data in
  `content/`, so there's no broken state in between.
- The `orderRank` field on each schema controls display order (lower first).
  It's not auto-populated, set it manually per document if order matters.
- Product `category` is a fixed dropdown list in the schema, matching the
  `ProductCategory` type in `content/products.ts`. If you add a new category
  in Sanity's schema, update that type too so `getProductCategories()` stays
  in sync (it currently returns a fixed list rather than querying Sanity for
  categories, since categories aren't their own document type).
