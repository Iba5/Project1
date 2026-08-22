import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

function errorFrom(data: unknown, fallback: string): string {
  const error = (data as Record<string, unknown>)?.detail ?? fallback;
  return typeof error === "string" ? error : String(error);
}

/** GET /api/admin/gallery/items — proxies GET /gallery/items */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proxyParams: Record<string, string> = { limit: searchParams.get("limit") ?? "200" };
    const category = searchParams.get("category");
    if (category) proxyParams.category = category;

    const { data, status } = await apiProxy<{ items: unknown[]; total: number }>({
      method: "GET",
      path: "/gallery/items",
      headers: await getBackendAuthHeaders(),
      searchParams: proxyParams,
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, items: data.items, total: data.total });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to fetch media items") }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/items GET] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** POST /api/admin/gallery/items — proxies POST /gallery/items (GALLERY_WRITE) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, status } = await apiProxy({
      method: "POST",
      path: "/gallery/items",
      body,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, item: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to create media item") }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/items POST] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** PATCH /api/admin/gallery/items — body: { id, ...fields } */
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { data, status } = await apiProxy({
      method: "PATCH",
      path: `/gallery/items/${encodeURIComponent(id)}`,
      body: fields,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, item: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to update media item") }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/items PATCH] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** DELETE /api/admin/gallery/items — body: { id } */
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { status } = await apiProxy({
      method: "DELETE",
      path: `/gallery/items/${encodeURIComponent(id)}`,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "Failed to delete media item" }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/items DELETE] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
