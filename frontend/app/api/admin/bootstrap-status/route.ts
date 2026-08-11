import { NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * GET /api/admin/bootstrap-status
 *
 * Proxies to FastAPI's GET /api/v1/auth/bootstrap-status. Tells the /admin
 * page whether to show the one-time signup form or the login form.
 */
export async function GET() {
  try {
    const { data, status } = await apiProxy<{ needs_setup: boolean }>({
      method: "GET",
      path: "/auth/bootstrap-status",
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, needsSetup: Boolean(data?.needs_setup) });
    }

    return NextResponse.json({ ok: false, error: "Could not check setup status" }, { status });
  } catch (err) {
    console.error("[/api/admin/bootstrap-status] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable — is the API running?" },
      { status: 503 },
    );
  }
}
