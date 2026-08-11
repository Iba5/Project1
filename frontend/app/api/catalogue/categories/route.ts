import { NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * GET /api/catalogue/categories
 *
 * Proxies to FastAPI's GET /api/v1/catalogue/categories.
 * Public — no auth required.
 */
export async function GET() {
  try {
    const { data, status } = await apiProxy<{ items: unknown[]; total: number }>({
      method: "GET",
      path: "/catalogue/categories",
      searchParams: { limit: "200" },
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json(data);
    }

    const error = (data as Record<string, unknown>)?.detail ?? "Failed to fetch categories";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/catalogue/categories] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
