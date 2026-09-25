import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Mountain, Users, ArrowUpRight, Leaf, HandHeart, Soup } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PillArrow } from "@/components/ui/PillArrow";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { homestays } from "@/data/homestays";
import { getPackage } from "@/data/packages";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Homestays",
  description:
    "Family-run homestays across Kalimpong, Sikkim, the Dooars and Darjeeling. Village stays, farm breakfasts and hosts who live there year round.",
};

const why = [
  {
    icon: HandHeart,
    title: "Money stays in the village",
    text: "You pay the household directly. We take no cut of your room rate, only our planning fee.",
  },
  {
    icon: Soup,
    title: "Food from the same kitchen",
    text: "Meals are whatever the family is cooking. Tell us about allergies and we will pass it on ahead.",
  },
  {
    icon: Leaf,
    title: "Small by design",
    text: "Three to six rooms each. We will not overbook a house to fit a group in.",
  },
];

export default function HomestaysPage() {
  return (
    <>
      <PageHero
        title="Stay in someone's home"
        intro="Family-run houses across four regions, with hosts who live there all year. Small, plain, and the best way to actually meet North Bengal."
        image={homestays[0].image}
      />

      {/* Why homestays — icon list, no zigzag split */}
      <Section tone="cream">
        <RevealGroup className="grid gap-8 sm:grid-cols-3">
          {why.map((w) => (
            <RevealItem key={w.title}>
              <w.icon
                className="size-6 text-[var(--color-teal-700)]"
                strokeWidth={1.5}
                aria-hidden
              />
              <h3 className="t-h3 mt-4">{w.title}</h3>
              <p className="t-small mt-2 text-[var(--color-body)]">{w.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Listings */}
      <Section tone="light">
        <SectionHeading
          title="Six houses we book again and again"
          intro="Rates are per room per night, including breakfast and dinner. We arrange transfers and pair any of these with a trip."
        />

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {homestays.map((h) => {
            const pkg = h.packageSlug ? getPackage(h.packageSlug) : null;
            return (
              <RevealItem key={h.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-xl2)] bg-[var(--color-cream)] ring-1 ring-[var(--color-line)]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={h.image}
                      alt={h.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3.5 top-3.5 rounded-[var(--radius-pill)] bg-black/45 px-2.5 py-1 text-[0.75rem] font-medium text-white backdrop-blur-md">
                      {h.region}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="t-h3">{h.name}</h3>
                    <p className="t-small mt-1 text-[var(--color-body-soft)]">{h.village}</p>
                    <p className="t-small mt-3 flex-1 text-[var(--color-body)]">{h.blurb}</p>

                    <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--color-line)] pt-4">
                      <div>
                        <dt className="t-small flex items-center gap-1.5 text-[var(--color-body-soft)]">
                          <BedDouble className="size-3.5" strokeWidth={1.5} aria-hidden />
                          Rooms
                        </dt>
                        <dd className="mt-1 text-[0.875rem] font-semibold">{h.rooms}</dd>
                      </div>
                      <div>
                        <dt className="t-small flex items-center gap-1.5 text-[var(--color-body-soft)]">
                          <Mountain className="size-3.5" strokeWidth={1.5} aria-hidden />
                          Altitude
                        </dt>
                        <dd className="mt-1 text-[0.875rem] font-semibold">{h.altitude}</dd>
                      </div>
                      <div>
                        <dt className="t-small flex items-center gap-1.5 text-[var(--color-body-soft)]">
                          <Users className="size-3.5" strokeWidth={1.5} aria-hidden />
                          Host
                        </dt>
                        <dd className="mt-1 truncate text-[0.875rem] font-semibold">
                          {h.hostedBy}
                        </dd>
                      </div>
                    </dl>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {h.experiences.map((e) => (
                        <li
                          key={e}
                          className="t-small rounded-[var(--radius-pill)] bg-[var(--color-paper)] px-2.5 py-1 text-[var(--color-body)] ring-1 ring-[var(--color-line)]"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex items-end justify-between border-t border-[var(--color-line)] pt-4">
                      <div>
                        <span className="t-small text-[var(--color-body-soft)]">Per night</span>
                        <p className="font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-teal-800)]">
                          {formatPrice(h.pricePerNight)}
                        </p>
                      </div>
                      {pkg && (
                        <Link
                          href={`/tours/${pkg.slug}`}
                          className="t-small group inline-flex items-center gap-1 font-medium text-[var(--color-teal-700)]"
                        >
                          Featured in this trip
                          <ArrowUpRight
                            className="size-3.5 transition-transform duration-[240ms] group-hover:rotate-45"
                            strokeWidth={1.75}
                            aria-hidden
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Closing CTA */}
      <Section tone="deep">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="t-h2 text-balance">Not sure which village suits you?</h2>
          <p className="t-body mt-4 text-white/70">
            Tell us how remote you want to go and how much walking you are up for.
            We will match you to a house and build the route around it.
          </p>
          <div className="mt-8 flex justify-center">
            <PillArrow label="Book a Trip" href="/contact" variant="onDark" />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
