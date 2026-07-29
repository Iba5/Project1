"use client";

import { motion } from "framer-motion";
import { Linkedin, Mail, ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/website/scroll-reveal";
import { SectionHeading } from "@/components/website/section-heading";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  accent: string;
  tone: "navy" | "ice" | "accent";
};

const team: TeamMember[] = [
  {
    name: "Tendai Moyo",
    role: "Founder & Managing Director",
    bio: "Twenty years in industrial supply across Southern Africa. Tendai started Canbri from a single Harare workshop in 2012.",
    initials: "TM",
    accent: "from-brand-navy to-brand-accent",
    tone: "navy",
  },
  {
    name: "Rumbi Chiweshe",
    role: "Head of Operations",
    bio: "Leads procurement, logistics and the cold-chain team. Rumbi keeps both branches stocked and deliveries on time.",
    initials: "RC",
    accent: "from-brand-accent to-brand-ice",
    tone: "accent",
  },
  {
    name: "Farai Dube",
    role: "Fabrication Lead",
    bio: "Master fabricator with 15 years on the bench. Farai oversees every custom steel and aluminium job that leaves our shop.",
    initials: "FD",
    accent: "from-brand-ice to-brand-navy",
    tone: "ice",
  },
  {
    name: "Nyasha Kadungure",
    role: "Customer Experience",
    bio: "Your first point of contact for quotes, support and after-sales. Nyasha makes sure every enquiry gets a same-day reply.",
    initials: "NK",
    accent: "from-brand-accent to-brand-navy",
    tone: "accent",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function TeamSection() {
  return (
    <section
      id="team"
      className="relative overflow-hidden bg-background"
    >
      {/* Decorative gradient */}
      <div
        className="pointer-events-none absolute inset-0 gradient-mesh opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl animate-pulse-slow"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ScrollReveal>
          <SectionHeading
            kicker="Leadership Team"
            numeral="11"
            title="The people behind Canbri."
            description="A small, senior team that knows the business end-to-end. You will speak to one of us, not a call centre."
          />
        </ScrollReveal>

        <StaggerContainer
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.1}
        >
          {team.map((member) => (
            <StaggerItem key={member.name}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Avatar block */}
                <div className="relative h-44 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${member.accent}`}
                    aria-hidden
                  />
                  {/* Decorative pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                    aria-hidden
                  />
                  {/* Large initials */}
                  <div className="relative flex h-full items-center justify-center">
                    <span className="font-display text-5xl font-bold text-white/95 drop-shadow-md transition-transform duration-500 group-hover:scale-110">
                      {member.initials}
                    </span>
                  </div>
                  {/* Shine sweep */}
                  <div
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden
                  />
                  {/* Online indicator */}
                  <span
                    className="absolute right-3 top-3 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400 pulse-dot"
                    aria-hidden
                  />
                </div>

                {/* Body */}
                <div className="relative p-5">
                  <h3 className="font-display text-base font-semibold text-brand-heading">
                    {member.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-brand-accent-fg dark:text-brand-ice">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>

                  {/* Social row */}
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                    <a
                      href="#contact"
                      aria-label={`Email ${member.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground transition-colors hover:bg-brand-accent hover:text-brand-accent-fg"
                    >
                      <Mail className="h-4 w-4" strokeWidth={2} />
                    </a>
                    <a
                      href="#contact"
                      aria-label={`${member.name} on LinkedIn`}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground transition-colors hover:bg-brand-accent hover:text-brand-accent-fg"
                    >
                      <Linkedin className="h-4 w-4" strokeWidth={2} />
                    </a>
                    <span className="ml-auto text-[11px] font-medium text-muted-foreground">
                      Available
                    </span>
                  </div>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Culture band */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3 sm:p-8">
            {[
              {
                stat: "12+",
                label: "Years in business",
                desc: "Founded 2012 in Harare",
              },
              {
                stat: "28",
                label: "Team members",
                desc: "Across both branches",
              },
              {
                stat: "100%",
                label: "Local ownership",
                desc: "Zimbabwean-owned and operated",
              },
            ].map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold text-brand-heading sm:text-4xl">
                  {item.stat}
                </p>
                <p className="mt-1 text-sm font-semibold text-brand-heading">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-brand-navy to-brand-accent/80 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                <Sparkles className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="font-display text-base font-semibold text-white">
                  Want to join the team?
                </p>
                <p className="mt-0.5 text-sm text-white/80">
                  We are always looking for skilled fabricators and logistics coordinators.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy transition-all hover:bg-white/90 hover:gap-3"
            >
              Send your CV
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.25} />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
