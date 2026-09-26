"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, ArrowUpDown } from "lucide-react";
import type { Package, Region, PackageType } from "@/lib/types";
import { PackageCard } from "@/components/cards/PackageCard";
import { PillArrow } from "@/components/ui/PillArrow";
import { cn } from "@/lib/utils";
import { EASE_OUT, DUR } from "@/lib/motion";

/**
 * Filterable, sortable trip grid.
 *
 * Filters are labelled radio sets rather than anonymous chips, so each control's
 * purpose is clear without a legend. Counts update live, the filter rail sticks
 * while a long grid scrolls, and the empty state offers a way forward instead of
 * a dead end.
 */
const REGIONS = ["All", "Darjeeling", "Sikkim", "Dooars", "Kalimpong"] as const;
const TYPES = ["All", "Trekking", "Wildlife", "Cultural", "Homestay", "Leisure"] as const;

const LENGTHS = [
  { label: "Any", value: "all" },
  { label: "Up to 4 days", value: "short" },
  { label: "5 to 7 days", value: "mid" },
  { label: "8 days or more", value: "long" },
] as const;

const SORTS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Shortest first", value: "days-asc" },
  { label: "Longest first", value: "days-desc" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  labels,
  counts,
}: {
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<string, string>;
  /** Optional result count per option, so a dead filter is visible up front. */
  counts?: Record<string, number>;
}) {
  return (
    <fieldset>
      <legend className="t-small mb-2 font-semibold uppercase tracking-[0.14em] text-[var(--color-body-soft)]">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          const count = counts?.[o];
          const empty = count === 0 && !active;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              aria-pressed={active}
              disabled={empty}
              className={cn(
                "pressable rounded-[var(--radius-pill)] px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-[180ms]",
                active
                  ? "bg-[var(--color-teal-800)] text-[var(--color-cream)]"
                  : empty
                    ? "cursor-not-allowed bg-[var(--color-paper)] text-[var(--color-body-soft)]/45 ring-1 ring-[var(--color-line)]"
                    : "bg-[var(--color-paper)] text-[var(--color-body)] ring-1 ring-[var(--color-line)] hover:ring-[var(--color-teal-600)]",
              )}
            >
              {labels?.[o] ?? o}
              {count !== undefined && (
                <span className="nums ml-1.5 opacity-55">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function TourFilter({ packages }: { packages: Package[] }) {
  const reduce = useReducedMotion();
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [length, setLength] = useState<string>("all");
  const [sort, setSort] = useState<SortValue>("recommended");

  const matchesLength = (p: Package, value: string) => {
    if (value === "short") return p.durationDays <= 4;
    if (value === "mid") return p.durationDays >= 5 && p.durationDays <= 7;
    if (value === "long") return p.durationDays >= 8;
    return true;
  };

  const filtered = useMemo(() => {
    const result = packages.filter(
      (p) =>
        (region === "All" || p.region === (region as Region)) &&
        (type === "All" || p.type === (type as PackageType)) &&
        matchesLength(p, length),
    );

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "days-asc":
        sorted.sort((a, b) => a.durationDays - b.durationDays);
        break;
      case "days-desc":
        sorted.sort((a, b) => b.durationDays - a.durationDays);
        break;
      default:
        // Recommended: featured first, then the cheaper entry point.
        sorted.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) || a.priceFrom - b.priceFrom,
        );
    }
    return sorted;
  }, [packages, region, type, length, sort]);

  /** Counts respect the other active filters, so they never mislead. */
  const regionCounts = useMemo(() => {
    const base = packages.filter(
      (p) => (type === "All" || p.type === (type as PackageType)) && matchesLength(p, length),
    );
    return Object.fromEntries(
      REGIONS.map((r) => [
        r,
        r === "All" ? base.length : base.filter((p) => p.region === (r as Region)).length,
      ]),
    );
  }, [packages, type, length]);

  const typeCounts = useMemo(() => {
    const base = packages.filter(
      (p) => (region === "All" || p.region === (region as Region)) && matchesLength(p, length),
    );
    return Object.fromEntries(
      TYPES.map((t) => [
        t,
        t === "All" ? base.length : base.filter((p) => p.type === (t as PackageType)).length,
      ]),
    );
  }, [packages, region, length]);

  const dirty = region !== "All" || type !== "All" || length !== "all";

  const reset = () => {
    setRegion("All");
    setType("All");
    setLength("all");
  };

  return (
    <div>
      {/* Filter rail. Sticks below the header so it stays reachable. */}
      <div className="sticky top-16 z-20 -mx-5 mb-2 border-b border-[var(--color-line)] bg-[var(--color-cream)]/90 px-5 py-5 backdrop-blur-lg sm:-mx-8 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <ChipGroup
            legend="Region"
            options={REGIONS}
            value={region}
            onChange={setRegion}
            counts={regionCounts}
          />
          <ChipGroup
            legend="Trip style"
            options={TYPES}
            value={type}
            onChange={setType}
            counts={typeCounts}
          />
          <ChipGroup
            legend="Length"
            options={LENGTHS.map((l) => l.value)}
            value={length}
            onChange={setLength}
            labels={Object.fromEntries(LENGTHS.map((l) => [l.value, l.label]))}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-4">
          <p className="t-small text-[var(--color-body-soft)]" aria-live="polite">
            Showing <span className="nums font-semibold text-[var(--color-ink)]">{filtered.length}</span>{" "}
            of <span className="nums">{packages.length}</span> trips
          </p>

          <div className="flex items-center gap-3">
            {dirty && (
              <button
                type="button"
                onClick={reset}
                className="pressable inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-[var(--color-teal-700)]"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Clear
              </button>
            )}

            <label className="inline-flex items-center gap-2">
              <ArrowUpDown
                className="size-3.5 text-[var(--color-body-soft)]"
                aria-hidden
              />
              <span className="sr-only">Sort trips by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortValue)}
                className="rounded-[var(--radius-pill)] bg-[var(--color-paper)] py-2 pl-3 pr-8 text-[0.8125rem] font-medium text-[var(--color-body)] ring-1 ring-[var(--color-line)] outline-none focus:ring-[var(--color-teal-600)]"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pkg) => (
            <motion.div
              key={pkg.id}
              layout={!reduce}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.base, ease: EASE_OUT }}
            >
              <PackageCard pkg={pkg} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[var(--radius-xl2)] bg-[var(--color-paper)] p-10 text-center ring-1 ring-[var(--color-line)]">
          <h3 className="t-h3">No trips match that combination</h3>
          <p className="t-small mx-auto mt-2 max-w-sm text-[var(--color-body)]">
            We build custom routes constantly. Tell us what you had in mind and we
            will put one together.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PillArrow label="Book a Trip" href="/contact" variant="onLight" size="sm" />
            <button
              type="button"
              onClick={reset}
              className="pressable rounded-[var(--radius-pill)] px-4 py-2.5 text-[0.8125rem] font-medium text-[var(--color-teal-700)] ring-1 ring-[var(--color-line)]"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
