import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  X,
  ShieldAlert,
  Instagram,
  Clock,
  Mountain,
  Users,
  CalendarDays,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { TripDetailsCard } from "@/components/ui/TripDetailsCard";
import { ItineraryAccordion } from "@/components/ui/ItineraryAccordion";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { PackageCard } from "@/components/cards/PackageCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getDestination } from "@/data/destinations";
import { homestays } from "@/data/homestays";
import {
  getPublicPackage,
  getRelatedPackages,
  getReviewsForPackage,
} from "@/lib/store/queries";
import { formatPrice } from "@/lib/utils";

// Live data: price, seats, itinerary and status all come from the database.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPublicPackage(slug);
  if (!pkg) return { title: "Tour" };
  return { title: pkg.title, description: pkg.summary };
}

export default async function TourDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPublicPackage(slug);
  if (!pkg) notFound();

  const [related, pkgReviews] = await Promise.all([
    getRelatedPackages(pkg.slug, pkg.region),
    getReviewsForPackage(pkg.slug),
  ]);

  const dest = getDestination(pkg.region.toLowerCase());
  const stays = homestays.filter((h) => h.packageSlug === pkg.slug);

  const quickFacts = [
    { icon: Clock, label: "Length", value: `${pkg.durationNights}N / ${pkg.durationDays}D` },
    { icon: Mountain, label: "Region", value: pkg.region },
    { icon: Users, label: "Trip style", value: pkg.type },
    {
      icon: CalendarDays,
      label: "Best months",
      value: dest?.bestWindow ?? "Year round",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[68svh] items-end overflow-hidden bg-[var(--color-ink)] pt-28">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-black/45 to-black/35"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="t-small flex flex-wrap items-center gap-1.5 text-white/60">
              <li>
                <Link href="/tours" className="transition-colors hover:text-white">
                  Tours
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/destinations/${pkg.region.toLowerCase()}`}
                  className="transition-colors hover:text-white"
                >
                  {pkg.region}
                </Link>
              </li>
            </ol>
          </nav>

          <h1 className="t-display max-w-[38rem] text-balance text-[var(--color-cream)]">
            {pkg.title}
          </h1>

          <p className="t-body-lg mt-4 max-w-[34rem] text-white/75">{pkg.summary}</p>

          <p className="t-small mt-5 text-white/60">
            From{" "}
            <span className="font-display text-[1.125rem] font-semibold text-[var(--color-cream)]">
              {formatPrice(pkg.priceFrom)}
            </span>{" "}
            per person
          </p>
        </div>
      </section>

      {/* Quick facts strip */}
      <Section tone="deep" size="flush">
        <dl className="grid grid-cols-2 gap-px py-6 sm:grid-cols-4">
          {quickFacts.map((f, i) => (
            <div
              key={f.label}
              className={i > 0 ? "border-l border-white/10 pl-4 sm:pl-6" : "pl-0"}
            >
              <dt className="t-small flex items-center gap-1.5 text-white/50">
                <f.icon className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                {f.label}
              </dt>
              <dd className="font-display mt-1.5 text-[0.9375rem] font-semibold tracking-[-0.012em]">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          {/* Main column */}
          <div className="min-w-0 space-y-14">
            {/* Highlights */}
            <Reveal>
              <SectionHeading title="What you will actually do" />
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {pkg.highlights.map((h) => (
                  <li key={h} className="t-small flex items-start gap-2.5 text-[var(--color-body)]">
                    <span
                      aria-hidden
                      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-teal-800)] text-[var(--color-cream)]"
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>

            {pkg.permitNote && (
              <div className="flex gap-3.5 rounded-[var(--radius-xl2)] bg-[var(--color-teal-950)] p-5 text-[var(--color-cream)] sm:p-6">
                <ShieldAlert
                  className="mt-0.5 size-5 shrink-0 text-[var(--color-accent-soft)]"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-[0.9375rem] font-semibold">
                    Permits and advisories
                  </h3>
                  <p className="t-small mt-1.5 text-white/70">{pkg.permitNote}</p>
                </div>
              </div>
            )}

            {/* Itinerary */}
            <div>
              <h2 className="t-h2">Day by day</h2>
              <p className="t-small mt-2 text-[var(--color-body-soft)]">
                {pkg.itinerary.length} days. Tap any day to open it.
              </p>
              <div className="mt-6">
                <ItineraryAccordion days={pkg.itinerary} />
              </div>
            </div>

            {/* Inclusions */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[var(--radius-xl2)] bg-[var(--color-cream)] p-6 ring-1 ring-[var(--color-line)]">
                <h3 className="t-h3">Included</h3>
                <ul className="mt-3.5 space-y-2">
                  {pkg.inclusions.map((i) => (
                    <li key={i} className="t-small flex items-start gap-2 text-[var(--color-body)]">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-[var(--color-teal-700)]"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-xl2)] bg-[var(--color-cream)] p-6 ring-1 ring-[var(--color-line)]">
                <h3 className="t-h3">Not included</h3>
                <ul className="mt-3.5 space-y-2">
                  {pkg.exclusions.map((i) => (
                    <li key={i} className="t-small flex items-start gap-2 text-[var(--color-body)]">
                      <X
                        className="mt-0.5 size-4 shrink-0 text-[var(--color-body-soft)]"
                        strokeWidth={2}
                        aria-hidden
                      />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="t-h2">Photographs from this trip</h2>
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {pkg.gallery.map((g, i) => (
                  <div
                    key={g}
                    className={`relative overflow-hidden rounded-[var(--radius-card)] ${
                      i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={g}
                      alt={`${pkg.title}, photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 30vw"
                      className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out)] motion-safe:hover:scale-[1.04]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Homestays on this trip */}
            {stays.length > 0 && (
              <div>
                <h2 className="t-h2">Where you sleep</h2>
                <p className="t-small mt-2 text-[var(--color-body-soft)]">
                  This trip includes a family-run homestay.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {stays.map((h) => (
                    <Link
                      key={h.slug}
                      href="/homestays"
                      className="hover-lift group flex gap-4 rounded-[var(--radius-card)] bg-[var(--color-cream)] p-3 ring-1 ring-[var(--color-line)]"
                    >
                      <span className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={h.image}
                          alt={h.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="font-display block text-[0.9375rem] font-semibold tracking-[-0.012em]">
                          {h.name}
                        </span>
                        <span className="t-small mt-0.5 block text-[var(--color-body-soft)]">
                          {h.village}
                        </span>
                        <span className="t-small mt-1.5 block text-[var(--color-body)]">
                          Hosted by {h.hostedBy}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reels */}
            {pkg.reelUrls && pkg.reelUrls.length > 0 && (
              <div>
                <h2 className="t-h2">On the ground</h2>
                <div className="mt-6 flex flex-wrap gap-4">
                  {pkg.reelUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pressable group flex aspect-[9/16] w-36 flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] bg-[var(--color-teal-950)] text-[var(--color-cream)] ring-1 ring-[var(--color-line-dark)]"
                    >
                      <Instagram className="size-7" strokeWidth={1.5} aria-hidden />
                      <span className="t-small font-medium">Watch the reel</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {pkg.mapEmbed && (
              <div>
                <h2 className="t-h2">Where you will be</h2>
                <div className="mt-6 aspect-video overflow-hidden rounded-[var(--radius-xl2)] ring-1 ring-[var(--color-line)]">
                  <iframe
                    src={pkg.mapEmbed}
                    className="size-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${pkg.title}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <TripDetailsCard pkg={pkg} />
            </div>
          </aside>
        </div>
      </Section>

      {/* Reviews */}
      {pkgReviews.length > 0 && (
        <Section tone="cream">
          <SectionHeading title="From people who took this trip" />
          <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pkgReviews.map((r) => (
              <RevealItem key={r.id}>
                <ReviewCard review={r} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Section tone="light">
          <SectionHeading title={`More ${pkg.region} trips`} />
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <RevealItem key={p.id}>
                <PackageCard pkg={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      <ClosingCta
        title="Want this trip on different dates?"
        body="Most of our itineraries end up adjusted. Tell us what to change and we will rebuild it around you."
        context={pkg.title}
      />
    </>
  );
}
