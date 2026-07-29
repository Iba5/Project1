import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/lib/api-proxy";

/**
 * POST /api/contact
 *
 * Proxies the contact form to FastAPI's enquiry creation endpoint.
 * Maps the frontend field names to the FastAPI EnquiryCreate schema.
 *
 * Frontend sends:  { name, company, phone, email, product, message }
 * FastAPI expects: { name, company, phone, email, product_name, message, source }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Map frontend field names to FastAPI schema
    const enquiryPayload = {
      name: body.name,
      company: body.company || null,
      phone: body.phone || null,
      email: body.email,
      product_name: body.product || null,
      message: body.message || null,
      source: "contact_form",
    };

    const { data, status } = await apiProxy({
      method: "POST",
      path: "/enquiries",
      body: enquiryPayload,
    });

    if (status >= 200 && status < 300) {
      return NextResponse.json({ ok: true });
    }

    // FastAPI returned an error — extract the detail if available
    const error =
      (data as Record<string, unknown>)?.detail ?? "Failed to submit enquiry";
    return NextResponse.json(
      { ok: false, error: typeof error === "string" ? error : String(error) },
      { status },
    );
  } catch (err) {
    // FastAPI is down or unreachable
    console.error("[/api/contact] Proxy error:", err);
    return NextResponse.json(
      { ok: false, error: "Service unavailable. Please try again later." },
      { status: 503 },
    );
  }
}
