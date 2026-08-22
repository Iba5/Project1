import { NextResponse } from "next/server";
import { clearAdminSessionCookies } from "@/lib/admin-auth-server";

/**
 * POST /api/admin/logout
 *
 * Clears the httpOnly session cookies. No backend call needed — the JWT
 * simply expires naturally; there's no server-side session to revoke.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookies(response.cookies);
  return response;
}
