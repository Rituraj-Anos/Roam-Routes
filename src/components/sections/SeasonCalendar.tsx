"use client";

import { useState } from "react";
import { destinations } from "@/data/destinations";
import { cn } from "@/lib/utils";

/**
 * When-to-go grid.
 *
 * Solves a real planning question rather than decorating the page: which months
 * actually work for each region. Colour is backed by a text label in the legend
 * and a per-cell title, so the meaning never depends on hue alone.
 */
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Rating = "peak" | "good" | "avoid";

function ratingFor(peak: number[], avoid: number[], month: number): Rating {
  if (peak.includes(month)) return "peak";
  if (avoid.includes(month)) return "avoid";
  return "good";
}

const cellStyle: Record<Rating, string> = {
  peak: "bg-[var(--color-teal-700)] text-white",
  good: "bg-[var(--color-teal-700)]/16 text-[var(--color-teal-800)]",
  avoid: "bg-[var(--color-line)] text-[var(--color-body-soft)]",
};

const legend: { rating: Rating; label: string }[] = [
  { rating: "peak", label: "Best time" },
  { rating: "good", label: "Workable" },
  { rating: "avoid", label: "We advise against" },
];

export function SeasonCalendar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[34rem] border-separate border-spacing-y-2">
          <caption className="sr-only">
            Best months to visit each North Bengal region
          </caption>
          <thead>
            <tr>
              <th scope="col" className="t-small w-[8.5rem] text-left font-medium text-[var(--color-body-soft)]">
                Region
              </th>
              {MONTHS.map((m, i) => (
                <th
                  key={i}
                  scope="col"
                  className="t-small pb-1 text-center font-medium text-[var(--color-body-soft)]"
                >
                  <abbr title={FULL[i]} className="no-underline">{m}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {destinations.map((d) => (
              <tr
                key={d.slug}
                onMouseEnter={() => setActive(d.slug)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "transition-opacity duration-[180ms]",
                  active && active !== d.slug && "opacity-55",
                )}
              >
                <th
                  scope="row"
                  className="font-display pr-3 text-left text-[0.875rem] font-semibold tracking-[-0.012em]"
                >
                  {d.name}
                </th>
                {MONTHS.map((_, i) => {
                  const month = i + 1;
                  const rating = ratingFor(d.peakMonths, d.avoidMonths, month);
                  return (
                    <td key={i} className="px-0.5">
                      <span
                        title={`${d.name}, ${FULL[i]}: ${
                          legend.find((l) => l.rating === rating)!.label
                        }`}
                        className={cn(
                          "block h-8 rounded-md",
                          cellStyle[rating],
                        )}
                      />
                      <span className="sr-only">
                        {FULL[i]}: {legend.find((l) => l.rating === rating)!.label}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {legend.map((l) => (
          <li key={l.rating} className="flex items-center gap-2">
            <span className={cn("size-3 rounded-sm", cellStyle[l.rating])} aria-hidden />
            <span className="t-small text-[var(--color-body)]">{l.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
