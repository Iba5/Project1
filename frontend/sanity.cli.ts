import { defineCliConfig } from "sanity/cli";

// The Sanity CLI auto-loads .env / .env.local and only picks up variables
// prefixed with SANITY_STUDIO_ (see sanity.io/docs/studio/environment-variables).
// This is a different prefix than the Next.js app uses (NEXT_PUBLIC_SANITY_*),
// so both are set in .env.local, one for each tool.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment : {
    appId: 'cxbgnz9om7tqzobmmd2dawpi'
  }
});
