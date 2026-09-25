import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Destination spotlight: photo-led, with the name and tagline anchored
 * bottom-left and the affordance top-right.
 *
 * The gradient scrim is only as tall as the text needs, keeping the photograph
 * readable instead of flattening it into a dark rectangle.
 */
export function DestinationSpotlight({
  dest,
  large,
  className,
}: {
  dest: Destination;
  large?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/destinations/${dest.slug}`}
      className={cn(
        "hover-lift group relative block h-full overflow-hidden rounded-[var(--radius-xl2)] ring-1 ring-white/10",
        className,
      )}
    >
      <Image
        src={dest.heroImage}
        alt={dest.name}
        fill
        sizes={large ? "(max-width: 768px) 100vw, 55vw" : "(max-width: 768px) 100vw, 28vw"}
        className="object-cover transition-transform duration-[700ms] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.05]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
      />

      <span
        aria-hidden
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/12 text-white ring-1 ring-inset ring-white/25 backdrop-blur-md transition-transform duration-[240ms] ease-[var(--ease-out)] group-hover:rotate-45"
      >
        <ArrowUpRight className="size-[1.125rem]" strokeWidth={1.75} />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3
          className={cn(
            "font-display font-semibold tracking-[-0.025em] text-white",
            large ? "text-[1.875rem] leading-[1.05]" : "text-[1.25rem] leading-tight",
          )}
        >
          {dest.name}
        </h3>
        <p className="t-small mt-1.5 max-w-[22rem] text-white/70">{dest.tagline}</p>
        <p className="t-small mt-3 font-medium text-[var(--color-accent-soft)]">
          Best {dest.bestWindow}
        </p>
      </div>
    </Link>
  );
}
