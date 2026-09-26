import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { FeaturedTrip } from "@/components/sections/FeaturedTrip";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SeasonCalendar } from "@/components/sections/SeasonCalendar";
import { Faq } from "@/components/sections/Faq";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Marquee } from "@/components/ui/Marquee";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PillArrow } from "@/components/ui/PillArrow";
import { FeatureList } from "@/components/ui/FeatureList";
import { TrustStats } from "@/components/ui/TrustStats";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { DestinationSpotlight } from "@/components/cards/DestinationSpotlight";
import { PackageCard } from "@/components/cards/PackageCard";
import { ReviewMarquee } from "@/components/sections/ReviewMarquee";
import { destinations } from "@/data/destinations";
import { homestays } from "@/data/homestays";
import { trustStats, whyChooseUs } from "@/data/content";
import {
  getFeaturedPackages,
  getFeaturedReviews,
  getRatingSummary,
} from "@/lib/store/queries";
import { formatPrice } from "@/lib/utils";

// Reads the live store, so what the admin publishes appears here.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [packages, reviews, rating] = await Promise.all([
    getFeaturedPackages(3),
    getFeaturedReviews(8),
    getRatingSummary(),
  ]);

  const featuredStays = homestays.slice(0, 3);

  // The headline rating figure comes from the reviews the admin actually
  // publishes, rather than a number hardcoded in a content file.
  const stats = trustStats.map((s) =>
    s.label.toLowerCase().includes("rating") && rating.count > 0
      ? { ...s, value: rating.average }
      : s,
  );

  return (
    <>
      {/* Hero — one message, one primary action */}
      <Hero />

      {/* Proof band, lifted out of the hero. Compact by design. */}
      <Section tone="dark" size="band" className="border-t border-white/8">
        <TrustStats stats={stats} tone="dark" />
      </Section>

      <Marquee />

      {/* About — split 1 of 2 */}
      <Section tone="light">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1100&q=82"
            alt="A local guide on a ridge above the tea gardens"
            className="aspect-[5/4] rounded-[var(--radius-xl2)]"
          />
          <Reveal delay={0.06}>
            <SectionHeading title="A small team who actually lives in these hills" />
            <div className="t-body mt-4 space-y-4 text-[var(--color-body)]">
              <p>
                North Bengal deserved better than thin brochures and phone-only
                booking. We plan trips the way we would for family: honest routes,
                stays we have slept in, and a clear answer when a road is closed.
              </p>
              <p>
                Eleven years in, we host more than two thousand travellers a year
                and still write every itinerary by hand.
              </p>
            </div>
            <div className="mt-8">
              <PillArrow label="About us" href="/about" variant="onLight" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Destinations — bento grid breaks the split rhythm */}
      <Section tone="dark">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Four regions, one Himalayan circuit"
            tone="dark"
            intro="Each has its own season, permits and pace. Most trips combine two."
          />
          <PillArrow label="All destinations" href="/destinations" variant="onDark" size="sm" />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          <DestinationSpotlight
            dest={destinations[0]}
            large
            className="min-h-[19rem] sm:col-span-2 lg:row-span-2 lg:min-h-0"
          />
          {destinations.slice(1).map((dest) => (
            <DestinationSpotlight
              key={dest.slug}
              dest={dest}
              className="min-h-[15rem] lg:col-span-1"
            />
          ))}
          {/* Fills the fourth cell on the wide grid */}
          <Link
            href="/homestays"
            className="hover-lift group flex min-h-[15rem] flex-col justify-between rounded-[var(--radius-xl2)] bg-[var(--color-teal-900)] p-5 ring-1 ring-white/10 lg:col-span-1"
          >
            <span
              aria-hidden
              className="grid size-10 place-items-center rounded-full bg-white/10 text-[var(--color-cream)] ring-1 ring-inset ring-white/20 transition-transform duration-[240ms] ease-[var(--ease-out)] group-hover:rotate-45"
            >
              <ArrowUpRight className="size-[1.125rem]" strokeWidth={1.75} />
            </span>
            <span>
              <span className="font-display block text-[1.25rem] font-semibold tracking-[-0.025em] text-[var(--color-cream)]">
                Village homestays
              </span>
              <span className="t-small mt-1.5 block text-white/65">
                Family-run houses in all four regions
              </span>
            </span>
          </Link>
        </div>
      </Section>

      {/* Packages — lead with an editorial spotlight, then the rest as cards */}
      <Section tone="cream">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Hand-built itineraries, ready to go"
            intro="Fixed departures with live seat counts. Every one of them is adjustable."
          />
          <PillArrow label="All tours" href="/tours" variant="onLight" size="sm" />
        </div>

        {packages[0] && (
          <div className="mt-12">
            <FeaturedTrip pkg={packages[0]} />
          </div>
        )}

        {packages.length > 1 && (
          <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2">
            {packages.slice(1).map((pkg) => (
              <RevealItem key={pkg.id}>
                <PackageCard pkg={pkg} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </Section>

      {/* How it works — full-width sequence */}
      <Section tone="light">
        <SectionHeading
          title="How booking actually works"
          intro="No account, no checkout funnel. Four steps and a human at every one."
        />
        <div className="mt-14">
          <HowItWorks />
        </div>
      </Section>

      {/* Season calendar — a planning tool, not decoration */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="When to go"
          title="The honest month-by-month picture"
          intro="We would rather lose a booking than send you into a month that cannot deliver what you came for."
        />
        <div className="mt-12">
          <SeasonCalendar />
        </div>
      </Section>

      {/* Why us — split 2 of 2, then the pattern stops */}
      <Section tone="dark">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              title="The details competitors skip"
              tone="dark"
              intro="Real photography, real reviews, and the local knowledge to get the timing right."
            />
            <div className="mt-8">
              <FeatureList items={whyChooseUs} tone="dark" />
            </div>
          </div>
          <ParallaxImage
            src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1100&q=82"
            alt="Travellers above Tsomgo Lake in Sikkim"
            className="aspect-[4/5] rounded-[var(--radius-xl2)] ring-1 ring-white/10"
          />
        </div>
      </Section>

      {/* Homestays teaser */}
      <Section tone="light">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Or stay in someone's home"
            intro="Three to six rooms, hosts who live there year round, and room rates paid straight to the family."
          />
          <PillArrow label="All homestays" href="/homestays" variant="onLight" size="sm" />
        </div>
        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {featuredStays.map((h) => (
            <RevealItem key={h.slug}>
              <Link
                href="/homestays"
                className="hover-lift group block overflow-hidden rounded-[var(--radius-xl2)] ring-1 ring-[var(--color-line)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={h.image}
                    alt={h.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.04]"
                  />
                </div>
                <div className="bg-[var(--color-cream)] p-5">
                  <h3 className="t-h3">{h.name}</h3>
                  <p className="t-small mt-1 text-[var(--color-body-soft)]">{h.village}</p>
                  <p className="t-small mt-3 font-semibold text-[var(--color-teal-800)]">
                    {formatPrice(h.pricePerNight)} per night
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Permits — trust at the decision point */}
      <Section tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <ShieldCheck
              className="size-7 text-[var(--color-accent-soft)]"
              strokeWidth={1.5}
              aria-hidden
            />
            <h2 className="t-h2 mt-5 text-balance">Permits, handled</h2>
          </div>
          <div className="t-body space-y-4 text-white/70">
            <p>
              Tsomgo (Changu) Lake, Nathula Pass and North Sikkim each need a
              protected-area permit arranged in advance through a registered
              operator. We file them as part of your booking.
            </p>
            <p>
              Nathula is usually closed on Mondays and Tuesdays, sits above
              4,300 m, and can shut at short notice in winter. Foreign nationals
              face different rules and are generally not permitted at the pass,
              so tell us your nationality when you enquire.
            </p>
            <p className="t-small text-white/50">
              Permit rules and fees change season to season. We reconfirm them
              before every departure rather than quoting last year&apos;s paperwork.
            </p>
          </div>
        </div>
      </Section>

      {/* Reviews — heading in the container, marquee full-bleed below it */}
      <Section tone="cream" size="flush" className="pt-20 sm:pt-24 lg:pt-28">
        <SectionHeading
          title={
            rating.count > 0
              ? `Rated ${rating.average} by the people who travelled with us`
              : "What travellers say"
          }
          intro="Verified reviews from recent trips across all four regions."
          align="center"
        />
      </Section>
      <div className="bg-[var(--color-cream)] pb-20 pt-12 sm:pb-24 lg:pb-28">
        <ReviewMarquee reviews={reviews} />
      </div>

      {/* FAQ */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            title="Questions we get every week"
            intro="If yours is not here, message us and we will answer it properly."
          />
          <Faq />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
