import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * GET /api/catalogue
 *
 * Proxies to FastAPI's GET /api/v1/catalogue/items
 * Public — no auth required.
 *
 * Returns the same shape as the current static data for backward compatibility.
 */
export async function GET(request: NextRequest) {
  try {
    // Forward any query params (category_id, status, is_featured, limit, offset)
    const { searchParams } = new URL(request.url);
    const proxyParams: Record<string, string> = {};
    const keys = ["category_id", "status", "is_featured", "limit", "offset"];
    for (const key of keys) {
      const value = searchParams.get(key);
      if (value) proxyParams[key] = value;
    }

    const { data, status } = await apiProxy<{
      items: unknown[];
      total: number;
      limit: number;
      offset: number;
    }>({
      method: "GET",
      path: "/catalogue/items",
      searchParams: proxyParams,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json(data);
    }

    // FastAPI returned an error
    const error =
      (data as Record<string, unknown>)?.detail ?? "Failed to fetch catalogue";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/catalogue] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}
