/**
 * Canonical site URL — single source of truth for metadata, JSON-LD, and
 * share links. Reads from NEXT_PUBLIC_SITE_URL rather than hardcoding a
 * domain: this app is currently served from a *.vercel.app URL, not
 * canbri.co.zw, and a hardcoded mismatch tells search engines the wrong
 * canonical address. Falls back to localhost (never a real customer
 * domain) so a missing env var is an obvious signal, not a false claim.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
