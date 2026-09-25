import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Wordmark with a ridgeline monogram.
 *
 * The mark is a simple geometric ridge — two peaks and a route line — built
 * from primitives rather than a decorative illustration, so it stays crisp at
 * favicon size and reads as a brand mark rather than clip art.
 */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const text = tone === "dark" ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]";

  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <span className="grid size-9 place-items-center rounded-[0.7rem] bg-[var(--color-teal-800)] ring-1 ring-inset ring-white/12">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          {/* ridgeline */}
          <path
            d="M2.5 17.5 8 9l3.5 5 2.5-3.5 7.5 7"
            stroke="var(--color-cream)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* route dot on the ridge */}
          <circle cx="8" cy="9" r="1.9" fill="var(--color-accent-soft)" />
        </svg>
      </span>
      <span className={`font-display text-[1.0625rem] font-semibold tracking-[-0.025em] ${text}`}>
        {site.name}
      </span>
    </Link>
  );
}
