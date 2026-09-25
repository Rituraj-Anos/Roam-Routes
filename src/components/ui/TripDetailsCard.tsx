"use client";

import {
  Clock,
  CalendarDays,
  Users,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Package } from "@/lib/types";
import { formatPrice, seatsLeft, waLink } from "@/lib/utils";
import { site } from "@/lib/site";
import { PillArrow } from "./PillArrow";

/**
 * Trip details panel: sticky on scroll, with the two ways to act anchored at
 * the bottom. Scarcity is only shown when it is real, taken from the seat
 * counts the admin maintains.
 */
export function TripDetailsCard({ pkg }: { pkg: Package }) {
  const openDepartures = pkg.departures.filter((d) => d.status === "open");
  const next = openDepartures[0];
  const left = next ? seatsLeft(next.totalSeats, next.bookedSeats) : null;

  const waMsg = `Hi ${site.name}, I'd like to book "${pkg.title}" (${pkg.durationNights}N/${pkg.durationDays}D). Could you share available dates?`;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const rows = [
    {
      icon: Clock,
      label: "Duration",
      value: `${pkg.durationNights} nights, ${pkg.durationDays} days`,
    },
    {
      icon: CalendarDays,
      label: "Next departure",
      value: next ? fmt(next.date) : "On request",
    },
    {
      icon: Users,
      label: "Group size",
      value: next ? `Up to ${next.totalSeats}` : "Small group",
    },
    { icon: IndianRupee, label: "From", value: `${formatPrice(pkg.priceFrom)} pp` },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl2)] bg-[var(--color-cream)] ring-1 ring-[var(--color-line)]">
      <div className="border-b border-[var(--color-line)] px-6 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="t-h3">Trip details</h2>
          {left !== null && left > 0 && left <= 5 && (
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-2.5 py-1 text-[0.75rem] font-semibold text-white">
              {left} seats left
            </span>
          )}
        </div>
      </div>

      <dl className="divide-y divide-[var(--color-line)] px-6">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 py-3.5">
            <r.icon
              className="size-4 shrink-0 text-[var(--color-teal-700)]"
              strokeWidth={1.5}
              aria-hidden
            />
            <dt className="t-small flex-1 text-[var(--color-body)]">{r.label}</dt>
            <dd className="font-display text-[0.875rem] font-semibold tracking-[-0.012em]">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* All open dates, not just the next one */}
      {openDepartures.length > 1 && (
        <div className="border-t border-[var(--color-line)] px-6 py-5">
          <h3 className="t-small font-semibold uppercase tracking-[0.14em] text-[var(--color-body-soft)]">
            Open dates
          </h3>
          <ul className="mt-3 space-y-2">
            {openDepartures.map((d) => {
              const n = seatsLeft(d.totalSeats, d.bookedSeats);
              return (
                <li key={d.id} className="flex items-center justify-between gap-3">
                  <span className="t-small">{fmt(d.date)}</span>
                  <span
                    className={`t-small font-medium ${
                      n <= 3 ? "text-[var(--color-accent)]" : "text-[var(--color-body-soft)]"
                    }`}
                  >
                    {n} left
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)] px-6 py-5">
        <h3 className="t-small font-semibold uppercase tracking-[0.14em] text-[var(--color-body-soft)]">
          Includes
        </h3>
        <ul className="mt-3 space-y-2">
          {pkg.inclusions.slice(0, 4).map((inc) => (
            <li key={inc} className="t-small flex items-start gap-2 text-[var(--color-body)]">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-[var(--color-teal-700)]"
                strokeWidth={1.5}
                aria-hidden
              />
              {inc}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-[var(--color-line)] p-6">
        <a
          href={waLink(site.whatsapp, waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[#1faa53] px-5 py-3.5 text-sm font-semibold text-white"
        >
          <SiWhatsapp className="size-[1.0625rem]" aria-hidden />
          Ask about this trip
        </a>
        <PillArrow
          label="Book a Trip"
          href={`/contact?package=${pkg.slug}`}
          variant="onLight"
          className="justify-center"
        />
        <p className="t-small mt-1 text-center text-[var(--color-body-soft)]">
          No payment now. We confirm details first.
        </p>
      </div>
    </div>
  );
}
