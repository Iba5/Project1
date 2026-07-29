import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/cms";

/**
 * Contact form handler.
 *
 * Today: validates the payload and logs the enquiry (and would email it).
 * Tomorrow: when a CMS or database is wired, persist the enquiry there.
 *
 * The shape is intentionally simple so the same handler works whether the
 * persistence target is email, a database row, a CMS entry, or a WhatsApp
 * Business API call.
 */

type ContactPayload = {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  product?: string;
  message?: string;
};

function isValid(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValid(body.name) || !isValid(body.phone) || !isValid(body.message)) {
    return NextResponse.json(
      { ok: false, error: "Name, phone and message are required." },
      { status: 422 },
    );
  }

  const site = await getSiteSettings();

  // TODO: when email/transactional provider is wired, send the enquiry here.
  // For now we log so the developer can confirm the pipeline works.
  console.log("[contact] new enquiry", {
    name: body.name,
    company: body.company,
    phone: body.phone,
    email: body.email,
    product: body.product,
    message: body.message,
    at: new Date().toISOString(),
    recipient: site.email,
  });

  return NextResponse.json({ ok: true });
}
