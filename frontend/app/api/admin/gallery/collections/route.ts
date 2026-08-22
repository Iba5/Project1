import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

function errorFrom(data: unknown, fallback: string): string {
  const error = (data as Record<string, unknown>)?.detail ?? fallback;
  return typeof error === "string" ? error : String(error);
}

/** GET /api/admin/gallery/collections — proxies GET /gallery/collections */
export async function GET(request: NextRequest) {
  try {
    const { data, status } = await apiProxy<{ items: unknown[]; total: number }>({
      method: "GET",
      path: "/gallery/collections",
      headers: await getBackendAuthHeaders(),
      searchParams: { limit: "200" },
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, collections: data.items });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to fetch collections") }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/collections GET] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** POST /api/admin/gallery/collections — proxies POST /gallery/collections (GALLERY_WRITE) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, status } = await apiProxy({
      method: "POST",
      path: "/gallery/collections",
      body,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, collection: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to create collection") }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/collections POST] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** PATCH /api/admin/gallery/collections — body: { id, ...fields } */
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { data, status } = await apiProxy({
      method: "PATCH",
      path: `/gallery/collections/${encodeURIComponent(id)}`,
      body: fields,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true, collection: data });
    return NextResponse.json({ ok: false, error: errorFrom(data, "Failed to update collection") }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/collections PATCH] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}

/** DELETE /api/admin/gallery/collections — body: { id } */
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    const { status } = await apiProxy({
      method: "DELETE",
      path: `/gallery/collections/${encodeURIComponent(id)}`,
      headers: await getBackendAuthHeaders(),
    });
    if (status >= 200 && status < 300) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "Failed to delete collection" }, { status });
  } catch (err) {
    console.error("[/api/admin/gallery/collections DELETE] Proxy error:", err);
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }
}
