import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

/**
 * POST /api/admin/upload
 *
 * Forwards a multipart file upload to FastAPI's POST /api/v1/media/upload
 * (GALLERY_WRITE). Can't use apiProxy here — it always JSON-encodes the body,
 * so this route streams the incoming FormData through untouched instead.
 */
export async function POST(request: NextRequest) {
  try {
    const headers = await getBackendAuthHeaders();
    if (!headers.Authorization) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();

    const response = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      headers,
      body: formData,
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    if (response.status >= 200 && response.status < 300) {
      return NextResponse.json({ ok: true, url: data.url });
    }

    const error = data?.detail ?? "Failed to upload file";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status: response.status },
    );
  } catch (err) {
    console.error("[/api/admin/upload POST] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
