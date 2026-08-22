import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

function errorFrom(data: unknown, fallback: string): string {
  const error = (data as Record<string, unknown>)?.detail ?? fallback;
  return typeof error === "string" ? error : String(error);
}

/** GET /api/admin/catalogue/items — proxies GET /catalogue/items (admin list, all statuses) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proxyParams: Record<string, string> = { limit: searchParams.get("limit") ?? "200" };
    for (const key of ["category_id", "status", "is_featured", "offset"]) {
      const value = searchParams.get(key);
      if (value) proxyParams[key] = value;
    }

    const { data, status } = await apiProxy<{ items: unknown[]; total: number }>({
      method: "GET",
      path: "/catalogue/items",
      headers: await getBackendAuthHeaders(),
      searchParams: proxyParams,
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, items: data.items, total: data.total });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to fetch items") }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/items GET] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** POST /api/admin/catalogue/items — proxies POST /catalogue/items (CATALOGUE_WRITE) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, status } = await apiProxy({
      method: "POST",
      path: "/catalogue/items",
      body,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, item: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to create item") }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/items POST] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** PATCH /api/admin/catalogue/items — body: { id, ...fields } — proxies PATCH /catalogue/items/{id} */
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { data, status } = await apiProxy({
      method: "PATCH",
      path: `/catalogue/items/${encodeURIComponent(id)}`,
      body: fields,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, item: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to update item") }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/items PATCH] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** DELETE /api/admin/catalogue/items — body: { id } — proxies DELETE /catalogue/items/{id} */
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { status } = await apiProxy({
      method: "DELETE",
      path: `/catalogue/items/${encodeURIComponent(id)}`,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "Failed to delete item" }, { status });
  } catch (err) {
    console.error("[/api/admin/catalogue/items DELETE] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
