import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";
import { getBackendAuthHeaders } from "@/lib/admin-auth-server";

function errorFrom(data: unknown, fallback: string): string {
  const error = (data as Record<string, unknown>)?.detail ?? fallback;
  return typeof error === "string" ? error : String(error);
}

/**
 * GET /api/admin/enquiries
 *
 * Proxies to FastAPI's GET /api/v1/enquiries?limit=100
 * Requires Authorization header (forwarded to FastAPI).
 */
export async function GET(request: NextRequest) {
  try {
    const headers = await getBackendAuthHeaders();

    // Forward any query params (e.g. ?status=new)
    const { searchParams } = new URL(request.url);
    const proxyParams: Record<string, string> = {};
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const statusFilter = searchParams.get("status");
    if (limit) proxyParams["limit"] = limit;
    if (offset) proxyParams["offset"] = offset;
    if (statusFilter) proxyParams["status"] = statusFilter;

    // Default to limit=100 if not specified
    if (!proxyParams["limit"]) proxyParams["limit"] = "100";

    const { data, status } = await apiProxy<{
      items: unknown[];
      total: number;
      limit: number;
      offset: number;
    }>({
      method: "GET",
      path: "/enquiries",
      headers,
      searchParams: proxyParams,
    });

    if (status >= 200 && status < 300) {
      // Map FastAPI paginated response to the format the frontend expects
      // Frontend Enquiry type: { id, name, company, phone, email, product, message, status, createdAt }
      const enquiries = data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        company: item.company ?? null,
        phone: item.phone ?? null,
        email: item.email ?? null,
        product: item.product_name ?? null,
        message: item.message ?? "",
        status: item.status,
        createdAt: item.created_at,
      }));

      return NextResponse.json({ ok: true, enquiries });
    }

    // FastAPI returned an error
    const error =
      (data as Record<string, unknown>)?.detail ?? "Failed to fetch enquiries";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/enquiries GET] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}

/**
 * PATCH /api/admin/enquiries
 *
 * Proxies to FastAPI's PATCH /api/v1/enquiries/{id}/status
 * Frontend sends: { id, status } — maps to PATCH with { status }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status: newStatus } = body;

    if (!id || !newStatus) {
      return NextResponse.json(
        { ok: false, error: "Missing id or status" },
        { status: 400 },
      );
    }

    const headers = await getBackendAuthHeaders();

    const { data, status } = await apiProxy({
      method: "PATCH",
      path: `/enquiries/${encodeURIComponent(id)}/status`,
      body: { status: newStatus },
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true });
    }

    const error =
      (data as Record<string, unknown>)?.detail ?? "Failed to update enquiry";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/enquiries PATCH] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}

/**
 * DELETE /api/admin/enquiries
 *
 * Proxies to FastAPI's DELETE /api/v1/enquiries/{id}
 * Frontend sends: { id } — maps to DELETE /api/v1/enquiries/{id}
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing id" },
        { status: 400 },
      );
    }

    const headers = await getBackendAuthHeaders();

    const { data, status } = await apiProxy({
      method: "DELETE",
      path: `/enquiries/${encodeURIComponent(id)}`,
      headers,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: errorFrom(data, "Failed to delete enquiry") },
      { status },
    );
  } catch (err) {
    console.error("[/api/admin/enquiries DELETE] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}
