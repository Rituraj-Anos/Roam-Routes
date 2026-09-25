"use client";

import { useState } from "react";
import { Plus, Utensils, BedDouble } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Day-by-day itinerary.
 *
 * Expansion uses a CSS `grid-template-rows: 0fr → 1fr` transition rather than a
 * JS height animation: no measuring pass, no layout thrash per frame, and it
 * stays interruptible if someone toggles rows quickly. The first day is open by
 * default so the section never reads as an empty stack of bars.
 */
export function ItineraryAccordion({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number | null>(days[0]?.day ?? null);

  return (
    <ul className="space-y-2.5">
      {days.map((d) => {
        const isOpen = open === d.day;
        const panelId = `itinerary-panel-${d.day}`;

        return (
          <li
            key={d.day}
            className={cn(
              "overflow-hidden rounded-[var(--radius-card)] ring-1 transition-colors duration-[180ms]",
              isOpen
                ? "bg-[var(--color-paper)] ring-[var(--color-line)]"
                : "bg-[var(--color-cream)] ring-transparent hover:ring-[var(--color-line)]",
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : d.day)}
              className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span
                aria-hidden
                className={cn(
                  "font-display grid size-9 shrink-0 place-items-center rounded-full text-[0.8125rem] font-semibold transition-colors duration-[180ms]",
                  isOpen
                    ? "bg-[var(--color-teal-800)] text-[var(--color-cream)]"
                    : "bg-[var(--color-paper)] text-[var(--color-teal-800)] ring-1 ring-[var(--color-line)]",
                )}
              >
                {d.day}
              </span>

              <span className="min-w-0 flex-1">
                <span className="t-small block text-[var(--color-body-soft)]">
                  Day {d.day}
                </span>
                <span className="font-display block text-[0.9375rem] font-semibold tracking-[-0.012em]">
                  {d.title}
                </span>
              </span>

              <Plus
                aria-hidden
                className={cn(
                  "size-[1.125rem] shrink-0 text-[var(--color-teal-700)] transition-transform duration-[240ms] ease-[var(--ease-out)]",
                  isOpen && "rotate-45",
                )}
                strokeWidth={1.75}
              />
            </button>

            <div id={panelId} className="accordion-panel" data-open={isOpen}>
              <div>
                <div className="px-4 pb-5 sm:px-5 sm:pl-[4.25rem]">
                  <p className="t-small text-[var(--color-body)]">{d.description}</p>

                  {d.images && d.images.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {d.images.slice(0, 3).map((src) => (
                        <span
                          key={src}
                          className="relative size-16 overflow-hidden rounded-lg ring-1 ring-[var(--color-line)]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    <div className="flex items-center gap-1.5">
                      <Utensils
                        className="size-3.5 text-[var(--color-teal-700)]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <dt className="sr-only">Meals</dt>
                      <dd className="t-small text-[var(--color-body-soft)]">
                        {d.meals || "No meals included"}
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble
                        className="size-3.5 text-[var(--color-teal-700)]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <dt className="sr-only">Stay</dt>
                      <dd className="t-small text-[var(--color-body-soft)]">{d.stay}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
