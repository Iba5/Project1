import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * POST /api/admin/login
 *
 * Proxies to FastAPI's POST /api/v1/auth/login.
 * On success, returns { ok: true, access_token, refresh_token, user }.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const { data, status } = await apiProxy<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      user: Record<string, unknown>;
    }>({
      method: "POST",
      path: "/auth/login",
      body: { email, password },
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({
        ok: true,
        access_token: (data as Record<string, unknown>).access_token,
        refresh_token: (data as Record<string, unknown>).refresh_token,
        user: (data as Record<string, unknown>).user,
      });
    }

    const error =
      (data as Record<string, unknown>)?.detail ?? "Invalid credentials";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : "Login failed" },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/login] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable — is the API running?" },
      { status: 503 },
    );
  }
}
