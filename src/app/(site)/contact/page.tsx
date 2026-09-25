import type { Metadata } from "next";
import { MapPin, Mail, Clock } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { InquiryForm } from "@/components/sections/InquiryForm";
import { Faq } from "@/components/sections/Faq";
import { publishedPackages } from "@/data/packages";
import { site } from "@/lib/site";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Plan your North Bengal trip with RoamAndRoutes. Send a short enquiry or reach us directly on WhatsApp.",
};

export default function ContactPage() {
  const pkgs = publishedPackages().map((p) => ({ slug: p.slug, title: p.title }));

  const details = [
    {
      icon: SiWhatsapp,
      label: "WhatsApp",
      value: "The fastest way to reach us",
      href: waLink(site.whatsapp, `Hi ${site.name}, I'd like to plan a trip.`),
      accent: true,
    },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Based in", value: site.base },
    { icon: Clock, label: "Hours", value: site.hours },
  ];

  return (
    <>
      <PageHero
        title="Let's plan your trip"
        intro="Tell us your rough dates and who is travelling. You will get a real reply, usually within a few hours."
        image="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=82"
      />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              title="Reach us directly"
              intro="We are a small team and reply personally. WhatsApp is quickest."
            />

            <ul className="mt-8 space-y-2.5">
              {details.map((d) => {
                const body = (
                  <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-[var(--color-paper)] p-4 ring-1 ring-[var(--color-line)]">
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full ${
                        d.accent
                          ? "bg-[#1faa53] text-white"
                          : "bg-[var(--color-teal-800)] text-[var(--color-cream)]"
                      }`}
                    >
                      <d.icon className="size-[1.0625rem]" strokeWidth={1.5} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="t-small font-semibold uppercase tracking-[0.14em] text-[var(--color-body-soft)]">
                        {d.label}
                      </p>
                      <p className="mt-0.5 truncate text-[0.9375rem] font-medium">{d.value}</p>
                    </div>
                  </div>
                );

                return (
                  <li key={d.label}>
                    {d.href ? (
                      <a
                        href={d.href}
                        target={d.href.startsWith("http") ? "_blank" : undefined}
                        rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="hover-lift block"
                      >
                        {body}
                      </a>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 aspect-[4/3] overflow-hidden rounded-[var(--radius-xl2)] ring-1 ring-[var(--color-line)]">
              <iframe
                src="https://www.google.com/maps?q=Siliguri,West+Bengal&output=embed"
                className="size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${site.name} location in Siliguri`}
              />
            </div>
          </div>

          <div>
            <SectionHeading
              title="Send a short enquiry"
              intro="Six fields, no account, no obligation."
            />
            <div className="mt-8">
              <InquiryForm packages={pkgs} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            title="Common questions"
            intro="Answered here so you do not have to ask."
          />
          <Faq />
        </div>
      </Section>
    </>
  );
}
