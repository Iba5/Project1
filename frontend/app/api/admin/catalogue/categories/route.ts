import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

function errorFrom(data: unknown, fallback: string): string {
  const error = (data as Record<string, unknown>)?.detail ?? fallback;
  return typeof error === "string" ? error : String(error);
}

/** GET /api/admin/catalogue/categories — proxies GET /catalogue/categories (public read, admin-consumed) */
export async function GET(request: NextRequest) {
  try {
    const { data, status } = await apiProxy<{ items: unknown[]; total: number }>({
      method: "GET",
      path: "/catalogue/categories",
      headers: await getBackendAuthHeaders(),
      searchParams: { limit: "200" },
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, categories: data.items });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to fetch categories") }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/categories GET] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** POST /api/admin/catalogue/categories — proxies POST /catalogue/categories (CATALOGUE_WRITE) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, status } = await apiProxy({
      method: "POST",
      path: "/catalogue/categories",
      body,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, category: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to create category") }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/categories POST] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** PATCH /api/admin/catalogue/categories — body: { id, ...fields } — proxies PATCH /catalogue/categories/{id} */
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { data, status } = await apiProxy({
      method: "PATCH",
      path: `/catalogue/categories/${encodeURIComponent(id)}`,
      body: fields,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, category: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to update category") }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/categories PATCH] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
