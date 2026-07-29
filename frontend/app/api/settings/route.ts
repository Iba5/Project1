import { NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * GET /api/settings
 *
 * Proxies to FastAPI's GET /api/v1/settings
 * Public — no auth required.
 *
 * Returns a list of public settings (key-value pairs).
 */
export async function GET() {
  try {
    const { data, status } = await apiProxy<unknown[]>({
      method: "GET",
      path: "/settings",
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json(data);
    }

    // FastAPI returned an error
    const error =
      (data as any)?.detail ?? "Failed to fetch settings";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/settings] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}
