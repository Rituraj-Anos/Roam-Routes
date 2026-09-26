import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Check } from "lucide-react";
import type { Package } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice, seatsLeft } from "@/lib/utils";

/**
 * Editorial spotlight for the single strongest trip.
 *
 * A large asymmetric layout instead of a fourth equal card — three identical
 * feature cards in a row is the templated default this deliberately avoids. The
 * photo carries the emotion; the copy carries the specifics.
 */
export function FeaturedTrip({ pkg }: { pkg: Package }) {
  const nextOpen = pkg.departures.find((d) => d.status === "open");
  const left = nextOpen ? seatsLeft(nextOpen.totalSeats, nextOpen.bookedSeats) : null;

  return (
    <Reveal>
      <Link
        href={`/tours/${pkg.slug}`}
        className="hover-lift elev-2 group grid overflow-hidden rounded-[var(--radius-xl2)] bg-[var(--color-ink)] lg:grid-cols-[1.15fr_1fr]"
      >
        {/* Image half */}
        <div className="relative min-h-[20rem] overflow-hidden lg:min-h-[26rem]">
          <Image
            src={pkg.heroImage}
            alt={pkg.title}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-[700ms] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.04]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[var(--color-ink)]/30"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge tone="onPhoto">
              <Clock className="size-3.5" strokeWidth={1.75} aria-hidden />
              <span className="nums">
                {pkg.durationNights}N / {pkg.durationDays}D
              </span>
            </Badge>
            <Badge tone="onPhoto">
              <MapPin className="size-3.5" strokeWidth={1.75} aria-hidden />
              {pkg.region}
            </Badge>
            {left !== null && left > 0 && left <= 5 && (
              <Badge tone="scarcity" className="font-semibold">
                {left} seats left
              </Badge>
            )}
          </div>
        </div>

        {/* Copy half */}
        <div className="flex flex-col justify-center gap-5 p-7 text-[var(--color-cream)] sm:p-9 lg:p-10">
          <div>
            <p className="t-small font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-soft)]">
              Most booked this season
            </p>
            <h3 className="t-h2 mt-3 text-balance">{pkg.title}</h3>
            <p className="t-body mt-3 text-pretty text-white/70">{pkg.summary}</p>
          </div>

          {pkg.highlights.length > 0 && (
            <ul className="grid gap-2">
              {pkg.highlights.slice(0, 3).map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[0.9375rem] text-white/80">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--color-accent-soft)]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-5">
            <div>
              <span className="t-small text-white/50">From</span>
              <p className="font-display nums text-[1.5rem] font-semibold leading-none tracking-[-0.02em]">
                {formatPrice(pkg.priceFrom)}
              </p>
            </div>
            <span
              aria-hidden
              className="grid size-12 place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-ink)] transition-transform duration-[240ms] ease-[var(--ease-out)] group-hover:rotate-45"
            >
              <ArrowUpRight className="size-5" strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
