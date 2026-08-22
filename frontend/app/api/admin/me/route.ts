import { NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

/**
 * GET /api/admin/me
 *
 * Tells the client whether the current session cookie is valid, without
 * ever exposing the token itself. Used by the /admin entry page to decide
 * whether to show the dashboard, the login form, or the signup form.
 */
export async function GET() {
  try {
    const headers = await getBackendAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const { data, status } = await apiProxy<Record<string, unknown>>({
      method: "GET",
      path: "/auth/me",
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, user: data });
    }

    return NextResponse.json({ ok: false, error: "Session expired" }, { status: 401 });
  } catch (err) {
    console.error("[/api/admin/me] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
