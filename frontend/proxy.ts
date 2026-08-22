import { NextRequest, NextResponse } from "next/server";

/**
 * Security headers, applied to every response.
 *
 * CSP uses a per-request nonce for script-src rather than 'unsafe-inline' —
 * Next.js automatically applies this nonce to the inline hydration scripts
 * it generates itself (documented behavior: it reads the nonce back out of
 * this response header), so no 'unsafe-inline' is needed for scripts. The
 * app's own inline <script> tags are all `type="application/ld+json"`
 * (structured data), which CSP's script-src doesn't govern at all since
 * browsers never execute it as script.
 *
 * style-src needs 'unsafe-inline' pragmatically — Tailwind and Framer
 * Motion both rely on inline style attributes throughout this codebase;
 * nonce-ing every one of those isn't practical.
 *
 * connect-src is 'self' only: the browser never calls the FastAPI backend
 * directly — every request goes through same-origin /api/* routes.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com;
    font-src 'self' data:;
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets and Next's internal image optimizer, apply
    // everywhere else (pages, API routes).
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
