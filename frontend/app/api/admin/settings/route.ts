import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

/**
 * GET /api/admin/settings
 *
 * Proxies to FastAPI's GET /api/v1/settings/all (admin — SETTINGS_READ).
 */
export async function GET(request: NextRequest) {
  try {
    const headers = await getBackendAuthHeaders();

    const { data, status } = await apiProxy<unknown>({
      method: "GET",
      path: "/settings/all",
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, settings: data });
    }

    const error = (data as Record<string, unknown> | null)?.detail ?? "Failed to fetch settings";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/settings GET] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/**
 * PATCH /api/admin/settings
 *
 * Body: { key, value, description? }
 * Proxies to FastAPI's PATCH /api/v1/settings/{key} (admin — SETTINGS_WRITE).
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ ok: false, error: "Missing key or value" }, { status: 400 });
    }

    const headers = await getBackendAuthHeaders();

    const { data, status } = await apiProxy({
      method: "PATCH",
      path: `/settings/${encodeURIComponent(key)}`,
      body: { value, description },
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true, setting: data });
    }

    const error = (data as Record<string, unknown>)?.detail ?? "Failed to update setting";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/settings PATCH] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
