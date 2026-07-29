import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/website/section-heading";
import { ContactForm } from "@/components/website/contact-form";
import { getContact, getSiteSettings, quoteWhatsAppHref } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Canbri Private Limited in Harare or Murewa. Phone, email, WhatsApp, contact form and business hours. Deliveries across Harare and Murewa.",
};

export default async function ContactPage() {
  const [contact, site] = await Promise.all([getContact(), getSiteSettings()]);
  const whatsappHref = quoteWhatsAppHref(site.whatsappNumber);

  return (
    <>
      <section className="surface-navy band-top">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-ice">
            Contact Us
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Talk to us. We respond during business hours.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {contact.intro}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left: contact details */}
            <div className="lg:col-span-5">
              <SectionHeading
                kicker="Reach Us"
                title="Two branches. Two ways to reach us fast."
              />

              <ul className="mt-8 space-y-4">
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-ice"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#25D366]/15 text-[#1a8a49]">
                      <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-heading">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">{site.whatsappDisplay}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={site.callHref}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-ice"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                      <Phone className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-heading">Phone</p>
                      <p className="text-sm text-muted-foreground">{site.callDisplay}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={site.emailHref}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-ice"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                      <Mail className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-heading">Email</p>
                      <p className="text-sm text-muted-foreground">{site.email}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                    <Clock className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-heading">Business Hours</p>
                    <p className="text-sm text-muted-foreground">{site.businessHours}</p>
                  </div>
                </li>
              </ul>

              {/* Branches */}
              <h2 className="mt-10 font-display text-lg font-semibold text-brand-heading">
                Our Branches
              </h2>
              <div className="mt-4 space-y-4">
                {contact.branches.map((b) => (
                  <div key={b.city} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-accent text-brand-accent-fg">
                        <MapPin className="h-5 w-5" strokeWidth={2.25} />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold text-brand-heading">
                          {b.label}
                        </h3>
                        <address className="mt-1.5 not-italic text-sm leading-relaxed text-muted-foreground">
                          {b.addressLines.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </address>
                        {(b.phone || b.hours) && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {b.phone && (
                              <a href={b.phoneHref} className="hover:underline">
                                {b.phone}
                              </a>
                            )}
                            {b.phone && b.hours && " · "}
                            {b.hours}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form + map */}
            <div className="lg:col-span-7" id="quote">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <SectionHeading
                  kicker="Request a Quote"
                  title="Send us your requirement."
                  description="Tell us what you need and we'll come back to you on WhatsApp or phone during business hours."
                />
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                  <div>
                    <h2 className="font-display text-base font-semibold text-brand-heading">
                      Google Maps
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {contact.googleMaps
                        ? "View our location on Google Maps."
                        : "Map embed will appear here once the location is supplied."}
                    </p>
                  </div>
                  {!contact.googleMaps && (
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-brand-heading">
                      Placeholder
                    </span>
                  )}
                </div>
                <div className="relative aspect-[16/9] w-full bg-secondary">
                  {contact.googleMaps ? (
                    <iframe
                      src={contact.googleMaps}
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Canbri location on Google Maps"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                      <MapPin className="h-8 w-8 text-brand-heading" strokeWidth={1.75} />
                      <p className="text-sm font-medium text-brand-heading">
                        Google Maps location pending
                      </p>
                      <p className="max-w-md text-xs text-muted-foreground">
                        Add a Google Maps embed URL to the <strong>Contact</strong> document
                        in Sanity Studio to replace this placeholder.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
