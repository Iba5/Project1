import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * GET /api/admin/stats
 *
 * Proxies to FastAPI's GET /api/v1/enquiries/stats
 * Requires Authorization header (forwarded to FastAPI).
 *
 * Returns: { ok: true, stats: { total, new, contacted, resolved, recent, today } }
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const { data, status } = await apiProxy<{
      total: number;
      new: number;
      contacted: number;
      resolved: number;
      recent: number;
      today: number;
    }>({
      method: "GET",
      path: "/enquiries/stats",
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, stats: data });
    }

    // FastAPI returned an error
    const error =
      (data as Record<string, unknown>)?.detail ?? "Failed to fetch stats";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/stats] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}
