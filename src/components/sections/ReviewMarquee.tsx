import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { getPackage } from "@/data/packages";
import { cn } from "@/lib/utils";

/**
 * Auto-scrolling wall of reviews.
 *
 * Pattern adapted from a 21st.dev testimonials marquee, rebuilt on our own
 * tokens and review data rather than dropped in with foreign CSS variables.
 * The row pauses on hover so a quote can actually be read, holds still under
 * reduced motion (handled by the shared `.animate-marquee` rule), and fades at
 * both edges so cards enter and leave rather than hard-clipping.
 *
 * Content was adapted for our data model; original component authored by
 * serafimcloud on 21st.dev.
 */
export function ReviewMarquee({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  // Duplicate the set so the -50% translate loops seamlessly.
  const doubled = [...reviews, ...reviews];

  return (
    <div className="marquee-host marquee-mask relative w-full overflow-hidden">
      <ul className="flex w-max animate-marquee gap-5 py-2">
        {doubled.map((r, i) => (
          <li
            key={`${r.id}-${i}`}
            aria-hidden={i >= reviews.length}
            className="w-[19rem] shrink-0"
          >
            <ReviewChip review={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewChip({ review }: { review: Review }) {
  const pkg = review.packageSlug ? getPackage(review.packageSlug) : null;

  return (
    <figure className="elev-1 flex h-full flex-col rounded-[var(--radius-xl2)] bg-[var(--color-paper)] p-6 ring-1 ring-[var(--color-line)]">
      <div
        className="flex items-center gap-0.5 text-[var(--color-accent)]"
        role="img"
        aria-label={`${review.rating} out of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="size-[0.9375rem]"
            fill={i < review.rating ? "currentColor" : "none"}
            strokeWidth={1.5}
            aria-hidden
          />
        ))}
      </div>

      <blockquote className="t-small mt-3 line-clamp-4 flex-1 text-[var(--color-body)]">
        {review.text}
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-2.5 border-t border-[var(--color-line)] pt-3.5">
        <span
          aria-hidden
          className={cn(
            "font-display grid size-9 shrink-0 place-items-center rounded-full",
            "bg-[var(--color-teal-800)] text-[0.8125rem] font-semibold text-[var(--color-cream)]",
          )}
        >
          {review.author.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.8125rem] font-semibold">{review.author}</p>
          <p className="t-small truncate text-[var(--color-body-soft)]">
            {pkg ? pkg.title : `Verified ${review.source} review`}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
