import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { getPackage } from "@/data/packages";

/**
 * Review card.
 *
 * Quote bodies are kept short on purpose — a landing-page testimonial is a
 * snippet, not a full review. Attribution carries the trip taken, not just a
 * bare name, so the proof is specific.
 */
export function ReviewCard({ review }: { review: Review }) {
  const pkg = review.packageSlug ? getPackage(review.packageSlug) : null;

  return (
    <figure className="flex h-full flex-col rounded-[var(--radius-xl2)] bg-[var(--color-paper)] p-6 ring-1 ring-[var(--color-line)]">
      <div
        className="flex items-center gap-0.5 text-[var(--color-accent)]"
        role="img"
        aria-label={`${review.rating} out of 5 stars`}
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

      <blockquote className="t-body mt-4 flex-1 text-[var(--color-body)]">
        {review.text}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--color-line)] pt-4">
        <span
          aria-hidden
          className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-teal-800)] text-[0.875rem] font-semibold text-[var(--color-cream)]"
        >
          {review.author.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="text-[0.875rem] font-semibold leading-tight">{review.author}</p>
          <p className="t-small truncate text-[var(--color-body-soft)]">
            {pkg ? pkg.title : `Verified ${review.source} review`}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
