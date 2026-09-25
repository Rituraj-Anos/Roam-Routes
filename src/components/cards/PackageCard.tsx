import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import type { Package } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

/**
 * Package card: full-bleed photo, duration pill top-left, title and price below.
 *
 * Hover motion is CSS-only and gated to fine pointers (the `hover-lift`
 * utility), so a tap on mobile doesn't leave the card stuck in a hover state.
 * Only transform and opacity animate.
 */
export function PackageCard({ pkg }: { pkg: Package }) {
  const seatsTight = pkg.departures.find(
    (d) => d.status === "open" && d.totalSeats - d.bookedSeats <= 3,
  );

  return (
    <Link
      href={`/tours/${pkg.slug}`}
      className="hover-lift elev-1 group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl2)] bg-[var(--color-paper)] ring-1 ring-[var(--color-line)] transition-shadow hover:[box-shadow:0_4px_8px_-4px_rgb(16_24_26/0.12),0_24px_48px_-20px_rgb(16_24_26/0.2)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.04]"
        />
        {/* Scrim only where the pills sit, so photos stay bright */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent"
        />
        <Badge tone="onPhoto" className="absolute left-3.5 top-3.5">
          <Clock className="size-3.5" strokeWidth={1.75} aria-hidden />
          <span className="nums">
            {pkg.durationNights}N / {pkg.durationDays}D
          </span>
        </Badge>
        <Badge tone="onPhoto" className="absolute right-3.5 top-3.5">
          <MapPin className="size-3.5" strokeWidth={1.75} aria-hidden />
          {pkg.region}
        </Badge>
        {seatsTight && (
          <Badge tone="scarcity" className="absolute bottom-3.5 left-3.5 font-semibold">
            {seatsTight.totalSeats - seatsTight.bookedSeats} seats left
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="t-h3 text-balance">{pkg.title}</h3>
        <p className="t-small mt-2 line-clamp-2 flex-1 text-[var(--color-body)]">
          {pkg.summary}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-[var(--color-line)] pt-4">
          <div>
            <span className="t-small text-[var(--color-body-soft)]">From</span>
            <p className="font-display nums text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-teal-800)]">
              {formatPrice(pkg.priceFrom)}
            </p>
          </div>
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-teal-800)] transition-transform duration-[240ms] ease-[var(--ease-out)] group-hover:rotate-45"
          >
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </Link>
  );
}
