import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * POST /api/admin/register
 *
 * Proxies to FastAPI's POST /api/v1/auth/register — the one-time bootstrap
 * signup. The backend refuses this once any admin account already exists.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { ok: false, error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    const { data, status } = await apiProxy<Record<string, unknown>>({
      method: "POST",
      path: "/auth/register",
      body: { email, name, password },
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, user: data });
    }

    const error = (data as Record<string, unknown>)?.detail ?? "Registration failed";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : "Registration failed" },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/register] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable — is the API running?" },
      { status: 503 },
    );
  }
}
