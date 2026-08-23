import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

/**
 * GET /api/admin/storage-stats
 *
 * Proxies to FastAPI's GET /api/v1/settings/storage-stats (admin — SETTINGS_READ).
 */
export async function GET(_request: NextRequest) {
  try {
    const headers = await getBackendAuthHeaders();

    const { data, status } = await apiProxy<unknown>({
      method: "GET",
      path: "/settings/storage-stats",
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, stats: data });
    }

    const error = (data as Record<string, unknown> | null)?.detail ?? "Failed to fetch storage stats";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/storage-stats GET] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
