import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

type ResponseCookies = NextResponse["cookies"];

/**
 * Server-side admin session cookies.
 *
 * The admin JWT never reaches browser JavaScript — it's set as an httpOnly
 * cookie by /api/admin/login and /api/admin/register, sent automatically by
 * the browser on same-origin requests, and read here (server-side only) to
 * build the Authorization header forwarded to FastAPI. This closes the
 * XSS-token-theft risk that sessionStorage-based auth had.
 */

export const ACCESS_COOKIE = "canbri_admin_access";
export const REFRESH_COOKIE = "canbri_admin_refresh";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60; // matches backend ACCESS_TOKEN_EXPIRE_MINUTES
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // matches backend REFRESH_TOKEN_EXPIRE_DAYS

function baseCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

/** Set both session cookies on a route handler response after login/register. */
export function setAdminSessionCookies(
  responseCookies: ResponseCookies,
  tokens: { accessToken: string; refreshToken: string },
) {
  responseCookies.set(ACCESS_COOKIE, tokens.accessToken, baseCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS));
  responseCookies.set(REFRESH_COOKIE, tokens.refreshToken, baseCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS));
}

/** Clear both session cookies on logout. */
export function clearAdminSessionCookies(responseCookies: ResponseCookies) {
  responseCookies.set(ACCESS_COOKIE, "", { ...baseCookieOptions(0), maxAge: 0 });
  responseCookies.set(REFRESH_COOKIE, "", { ...baseCookieOptions(0), maxAge: 0 });
}

/** Read the access token from the incoming request's cookies (server-only). */
export async function getAdminAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

/** Build the Authorization header to forward to FastAPI, from the session cookie. */
export async function getBackendAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAdminAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
