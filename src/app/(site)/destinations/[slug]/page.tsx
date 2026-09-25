import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Plane,
  ShieldAlert,
  TriangleAlert,
  Mountain,
  ArrowUpRight,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PillArrow } from "@/components/ui/PillArrow";
import { destinations, getDestination } from "@/data/destinations";
import { homestays } from "@/data/homestays";
import { getPackagesByRegion } from "@/lib/store/queries";
import { formatPrice } from "@/lib/utils";

// Trips shown here come from the live store.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return { title: "Destination" };
  return { title: dest.name, description: dest.overview };
}

export default async function DestinationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const trips = await getPackagesByRegion(dest.name);
  const stays = homestays.filter((h) => h.region === dest.name);
  const others = destinations.filter((d) => d.slug !== dest.slug);

  const facts = [
    { icon: CalendarDays, label: "Best months", value: dest.bestWindow },
    { icon: Mountain, label: "Altitude", value: dest.altitude },
    { icon: Plane, label: "Getting there", value: dest.gateway },
  ];

  return (
    <>
      <PageHero title={dest.name} intro={dest.tagline} image={dest.heroImage} />

      {/* Fact strip */}
      <Section tone="deep" size="flush">
        <dl className="grid gap-6 py-6 sm:grid-cols-3 sm:gap-px">
          {facts.map((f, i) => (
            <div key={f.label} className={i > 0 ? "sm:border-l sm:border-white/10 sm:pl-6" : ""}>
              <dt className="t-small flex items-center gap-1.5 text-white/50">
                <f.icon className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                {f.label}
              </dt>
              <dd className="t-small mt-1.5 font-medium text-[var(--color-cream)]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Overview + photos */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div>
            <SectionHeading title={`Knowing ${dest.name}`} />
            <p className="t-body mt-4 text-[var(--color-body)]">{dest.overview}</p>

            <h3 className="t-h3 mt-8">When to come</h3>
            <p className="t-body mt-2 text-[var(--color-body)]">{dest.bestSeason}</p>

            {(dest.permitNote || dest.advisory) && (
              <div className="mt-8 space-y-3">
                {dest.permitNote && (
                  <div className="flex gap-3.5 rounded-[var(--radius-xl2)] bg-[var(--color-teal-950)] p-5 text-[var(--color-cream)]">
                    <ShieldAlert
                      className="mt-0.5 size-5 shrink-0 text-[var(--color-accent-soft)]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div>
                      <h4 className="font-display text-[0.9375rem] font-semibold">
                        Permits
                      </h4>
                      <p className="t-small mt-1.5 text-white/70">{dest.permitNote}</p>
                    </div>
                  </div>
                )}
                {dest.advisory && (
                  <div className="flex gap-3.5 rounded-[var(--radius-xl2)] bg-[var(--color-accent)]/8 p-5 ring-1 ring-[var(--color-accent)]/20">
                    <TriangleAlert
                      className="mt-0.5 size-5 shrink-0 text-[var(--color-accent-dim)]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <div>
                      <h4 className="font-display text-[0.9375rem] font-semibold">
                        Worth knowing
                      </h4>
                      <p className="t-small mt-1.5 text-[var(--color-body)]">
                        {dest.advisory}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Reveal delay={0.06}>
            <div className="grid gap-3">
              {dest.thumbs.map((t, i) => (
                <div
                  key={t}
                  className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl2)]"
                >
                  <Image
                    src={t}
                    alt={`${dest.name}, view ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Trips */}
      {trips.length > 0 && (
        <Section tone="cream">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading title={`Trips in ${dest.name}`} />
            <PillArrow label="All tours" href="/tours" variant="onLight" size="sm" />
          </div>
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((pkg) => (
              <RevealItem key={pkg.id}>
                <PackageCard pkg={pkg} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* Homestays here */}
      {stays.length > 0 && (
        <Section tone="light">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              title={`Homestays in ${dest.name}`}
              intro="Family-run houses, three to six rooms, room rates paid direct to the host."
            />
            <PillArrow label="All homestays" href="/homestays" variant="onLight" size="sm" />
          </div>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((h) => (
              <RevealItem key={h.slug}>
                <Link
                  href="/homestays"
                  className="hover-lift group block overflow-hidden rounded-[var(--radius-xl2)] ring-1 ring-[var(--color-line)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
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
      )}

      {/* Onward wayfinding — never leave the page a dead end */}
      <Section tone="cream">
        <SectionHeading title="Pair it with another region" />
        <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-3">
          {others.map((d) => (
            <RevealItem key={d.slug}>
              <Link
                href={`/destinations/${d.slug}`}
                className="hover-lift group flex items-center justify-between gap-3 rounded-[var(--radius-card)] bg-[var(--color-paper)] p-5 ring-1 ring-[var(--color-line)]"
              >
                <span>
                  <span className="font-display block text-[1rem] font-semibold tracking-[-0.018em]">
                    {d.name}
                  </span>
                  <span className="t-small mt-0.5 block text-[var(--color-body-soft)]">
                    Best {d.bestWindow}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-[var(--color-teal-700)] transition-transform duration-[240ms] group-hover:rotate-45"
                  strokeWidth={1.75}
                />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <ClosingCta context={`a ${dest.name} trip`} />
    </>
  );
}
