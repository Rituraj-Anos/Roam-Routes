"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Trash2, Loader2 } from "lucide-react";
import { AdminCard } from "./AdminShell";
import { api, withToast } from "@/lib/client-api";
import { seatsLeft, cn } from "@/lib/utils";
import type { Departure } from "@/lib/types";

/**
 * Departure dates and seat counts for one package.
 *
 * Seat counts drive the "N seats left" badge on the public trip page, so booked
 * seats are editable inline and the sold-out state is derived rather than
 * tracked separately.
 */
export function DepartureManager({
  slug,
  departures,
}: {
  slug: string;
  departures: Departure[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState(12);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const add = async () => {
    if (!date) return;
    setBusy("new");
    const done = await withToast(
      () =>
        api(`/api/admin/packages/${slug}/departures`, {
          method: "POST",
          json: { date, totalSeats: seats },
        }),
      { loading: "Adding date", success: "Departure added" },
    );
    setBusy(null);
    if (done) {
      setDate("");
      refresh();
    }
  };

  const patch = async (dep: Departure, body: Partial<Departure>, label: string) => {
    setBusy(dep.id);
    const done = await withToast(
      () =>
        api(`/api/admin/packages/${slug}/departures/${dep.id}`, {
          method: "PATCH",
          json: body,
        }),
      { loading: "Updating", success: label },
    );
    setBusy(null);
    if (done) refresh();
  };

  const remove = async (dep: Departure) => {
    setBusy(dep.id);
    const done = await withToast(
      () =>
        api(`/api/admin/packages/${slug}/departures/${dep.id}`, {
          method: "DELETE",
        }),
      { loading: "Removing", success: "Departure removed" },
    );
    setBusy(null);
    if (done) refresh();
  };

  const field =
    "rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors focus:border-[var(--color-teal-600)]";

  return (
    <AdminCard>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display text-[1.0625rem] font-semibold">Departures</h2>
      </div>
      <p className="mb-5 text-xs text-white/40">
        Seat counts drive the scarcity badge travellers see. Sold-out dates stop
        showing a booking prompt.
      </p>

      {/* Add a date */}
      <div className="mb-5 flex flex-wrap items-end gap-2.5">
        <div>
          <label
            htmlFor="dep-date"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40"
          >
            Date
          </label>
          <input
            id="dep-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cn(field, "[color-scheme:dark]")}
          />
        </div>
        <div>
          <label
            htmlFor="dep-seats"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40"
          >
            Total seats
          </label>
          <input
            id="dep-seats"
            type="number"
            min={1}
            max={200}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className={cn(field, "w-28")}
          />
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!date || busy === "new"}
          className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-50"
        >
          {busy === "new" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <CalendarPlus className="size-4" aria-hidden />
          )}
          Add date
        </button>
      </div>

      {departures.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-white/40">
          No fixed dates yet. Trips without dates show &ldquo;on request&rdquo;.
        </p>
      ) : (
        <ul className="divide-y divide-white/5">
          {departures.map((d) => {
            const left = seatsLeft(d.totalSeats, d.bookedSeats);
            const rowBusy = busy === d.id;
            return (
              <li
                key={d.id}
                className={cn(
                  "flex flex-wrap items-center gap-3 py-3",
                  rowBusy && "pointer-events-none opacity-50",
                )}
              >
                <span className="min-w-[7.5rem] text-sm font-medium tabular-nums">
                  {new Date(d.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <label className="flex items-center gap-1.5 text-xs text-white/50">
                  Booked
                  <input
                    type="number"
                    min={0}
                    max={d.totalSeats}
                    value={d.bookedSeats}
                    onChange={(e) =>
                      patch(d, { bookedSeats: Number(e.target.value) }, "Seats updated")
                    }
                    aria-label={`Seats booked on ${d.date}`}
                    className={cn(field, "w-20 px-2 py-1.5 tabular-nums")}
                  />
                  <span className="text-white/35">of {d.totalSeats}</span>
                </label>

                <span
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    left === 0
                      ? "text-white/40"
                      : left <= 3
                        ? "text-[var(--color-accent-soft)]"
                        : "text-white/50",
                  )}
                >
                  {left} left
                </span>

                <button
                  type="button"
                  onClick={() =>
                    patch(
                      d,
                      { status: d.status === "open" ? "sold_out" : "open" },
                      d.status === "open" ? "Marked sold out" : "Reopened",
                    )
                  }
                  className={cn(
                    "pressable rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    d.status === "open"
                      ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                      : "bg-white/10 text-white/50 hover:bg-white/15",
                  )}
                >
                  {d.status === "open" ? "Open" : "Sold out"}
                </button>

                <button
                  type="button"
                  onClick={() => remove(d)}
                  aria-label={`Remove departure on ${d.date}`}
                  className="pressable ml-auto grid size-9 place-items-center rounded-lg text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AdminCard>
  );
}
