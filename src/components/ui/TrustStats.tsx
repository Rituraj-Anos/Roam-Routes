import { Star } from "lucide-react";
import type { TrustStat } from "@/lib/types";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "./Reveal";
import { CountUp } from "./CountUp";

/**
 * Proof band. Sits directly below the hero as a compact strip rather than a
 * full-height section, so it reads as a continuation of the hero instead of an
 * empty stripe between two blocks.
 *
 * Figures count up on entry, which draws the eye to the numbers that matter.
 */
export function TrustStats({
  stats,
  tone = "dark",
  className,
}: {
  stats: TrustStat[];
  tone?: "dark" | "light";
  className?: string;
}) {
  const label = tone === "dark" ? "text-white/55" : "text-[var(--color-body-soft)]";
  const rule = tone === "dark" ? "border-white/10" : "border-[var(--color-line)]";

  return (
    <RevealGroup
      className={cn("grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0", className)}
    >
      {stats.map((s, i) => (
        <RevealItem
          key={s.label}
          className={cn(
            "flex items-baseline gap-4 sm:block",
            i > 0 && `sm:border-l sm:pl-6 ${rule}`,
          )}
        >
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] sm:text-[2.375rem]">
              <CountUp value={s.value} />
            </span>
            {s.label.toLowerCase().includes("rating") && (
              <Star
                className="size-4 shrink-0 fill-[var(--color-accent)] text-[var(--color-accent)]"
                aria-hidden
              />
            )}
          </div>
          <p className={cn("t-small max-w-[13rem] sm:mt-2", label)}>{s.label}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
