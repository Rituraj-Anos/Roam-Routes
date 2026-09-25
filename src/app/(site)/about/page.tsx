import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FeatureList } from "@/components/ui/FeatureList";
import { TrustStats } from "@/components/ui/TrustStats";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { trustStats, whyChooseUs } from "@/data/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "RoamAndRoutes is a small North Bengal travel team building honest itineraries around real places, stays and people.",
};

/** Commitments stated plainly. Specific promises beat vague reassurance. */
const commitments = [
  {
    title: "We will talk you out of a bad month",
    text: "If your dates cannot deliver what you came for, we say so before you pay, even when it costs us the booking.",
  },
  {
    title: "Every stay is one we have slept in",
    text: "No listings we have not visited. We recheck them each season because standards slip.",
  },
  {
    title: "One person, start to finish",
    text: "The person who plans your trip is the person on WhatsApp while you travel. No handover to a call centre.",
  },
  {
    title: "Prices in writing, before payment",
    text: "Full breakdown of what is included and what is not, sent before any advance changes hands.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Built by people who grew up in these hills"
        intro="Eleven years guiding travellers through Darjeeling, Sikkim, the Dooars and Kalimpong, on their terms."
        image="https://images.unsplash.com/photo-1544634076-a90160ddf44c?auto=format&fit=crop&w=1600&q=82"
      />

      <Section tone="dark" size="band" className="border-t border-white/8">
        <TrustStats stats={trustStats} tone="dark" />
      </Section>

      {/* Story */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading title="North Bengal deserved better than a brochure" />
            <div className="t-body mt-4 space-y-4 text-[var(--color-body)]">
              <p>
                We got tired of watching travellers arrive with itineraries that
                missed the point. The same five viewpoints, transfers too tight to
                enjoy, and nobody to call when a road closed.
              </p>
              <p>
                So we started planning trips the way we would for family. Routes
                that make sense geographically, stays chosen for the host rather
                than the star rating, and honest answers about weather and permits.
              </p>
              <p>
                We are still small. That is deliberate. It means the person who
                writes your itinerary is the one who picks up when you call from a
                hillside in Lachung.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl2)]">
              <Image
                src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1100&q=82"
                alt="The team planning routes together"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Commitments — full-width grid breaks the split rhythm */}
      <Section tone="cream">
        <SectionHeading
          title="What we commit to"
          intro="Specific promises we are happy to be held to."
        />
        <RevealGroup className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {commitments.map((c, i) => (
            <RevealItem key={c.title}>
              <span className="font-display text-[0.8125rem] font-semibold tabular-nums text-[var(--color-accent)]">
                0{i + 1}
              </span>
              <h3 className="t-h3 mt-2">{c.title}</h3>
              <p className="t-small mt-2 max-w-[24rem] text-[var(--color-body)]">{c.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* How it works */}
      <Section tone="light">
        <SectionHeading
          title="How booking actually works"
          intro="No account, no checkout funnel. Four steps and a human at every one."
        />
        <div className="mt-14">
          <HowItWorks />
        </div>
      </Section>

      {/* Why us */}
      <Section tone="dark">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading title="What we bring that a booking site cannot" tone="dark" />
          <FeatureList items={whyChooseUs} tone="dark" />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
