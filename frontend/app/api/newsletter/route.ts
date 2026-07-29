import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * POST /api/newsletter
 *
 * Proxies to FastAPI's POST /api/v1/newsletter/subscribe
 * Frontend sends: { email }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { ok: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const { data, status } = await apiProxy({
      method: "POST",
      path: "/newsletter/subscribe",
      body: { email: body.email },
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true });
    }

    // FastAPI returned an error
    const error =
      (data as Record<string, unknown>)?.detail ?? "Failed to subscribe";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/newsletter] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
