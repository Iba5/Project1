import { Snowflake, MessageCircle } from "lucide-react";

type IceBandProps = {
  whatsappHref: string;
};

export function IceBand({ whatsappHref }: IceBandProps) {
  return (
    <section id="ice" className="relative overflow-hidden bg-sky-50 dark:bg-sky-950/30">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">Canbri Cool &amp; Cold</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-heading sm:text-4xl">
            Fresh ice, made daily in Murewa.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Clean, dense 5kg ice blocks manufactured at our Murewa depot — for bars, butcheries, events and
            households across Harare and Murewa.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-accent px-6 text-sm font-bold uppercase tracking-wide text-brand-accent-fg transition-colors hover:bg-brand-accent/90"
            >
              Shop Ice
            </a>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-brand-navy/20 px-6 text-sm font-semibold text-brand-heading transition-colors hover:bg-brand-navy/5"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                WhatsApp
              </a>
            )}
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Murehwa Depot</p>
        </div>
        <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl bg-white/70 shadow-soft ring-1 ring-sky-200 dark:bg-white/5 dark:ring-white/10">
          <Snowflake className="h-28 w-28 text-sky-400" strokeWidth={1.25} />
          <div className="absolute -bottom-4 right-4 rounded-xl bg-brand-navy px-4 py-3 text-center shadow-lg">
            <p className="font-display text-lg font-bold text-white">5KG ICE BLOCK</p>
            <p className="text-2xl font-black text-brand-accent">$1</p>
          </div>
        </div>
      </div>
    </section>
  );
}
