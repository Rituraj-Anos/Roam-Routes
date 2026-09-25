"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { Package, Region, PackageType } from "@/lib/types";
import { PackageCard } from "@/components/cards/PackageCard";
import { PillArrow } from "@/components/ui/PillArrow";
import { cn } from "@/lib/utils";
import { EASE_OUT, DUR } from "@/lib/motion";

/**
 * Filterable trip grid.
 *
 * Each filter group is a labelled radio set rather than a row of anonymous
 * chips, so the control's purpose is clear without a legend. Counts update live
 * and the empty state offers a way forward instead of a dead end.
 */
const REGIONS = ["All", "Darjeeling", "Sikkim", "Dooars", "Kalimpong"] as const;
const TYPES = ["All", "Trekking", "Wildlife", "Cultural", "Homestay", "Leisure"] as const;
const LENGTHS = [
  { label: "Any", value: "all" },
  { label: "Up to 4 days", value: "short" },
  { label: "5 to 7 days", value: "mid" },
  { label: "8 days or more", value: "long" },
] as const;

function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  labels,
}: {
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<string, string>;
}) {
  return (
    <fieldset>
      <legend className="t-small mb-2 font-semibold uppercase tracking-[0.14em] text-[var(--color-body-soft)]">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              aria-pressed={active}
              className={cn(
                "pressable rounded-[var(--radius-pill)] px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-[180ms]",
                active
                  ? "bg-[var(--color-teal-800)] text-[var(--color-cream)]"
                  : "bg-[var(--color-paper)] text-[var(--color-body)] ring-1 ring-[var(--color-line)] hover:ring-[var(--color-teal-600)]",
              )}
            >
              {labels?.[o] ?? o}
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

  const filtered = useMemo(
    () =>
      packages.filter((p) => {
        if (region !== "All" && p.region !== (region as Region)) return false;
        if (type !== "All" && p.type !== (type as PackageType)) return false;
        if (length === "short" && p.durationDays > 4) return false;
        if (length === "mid" && (p.durationDays < 5 || p.durationDays > 7)) return false;
        if (length === "long" && p.durationDays < 8) return false;
        return true;
      }),
    [packages, region, type, length],
  );

  const dirty = region !== "All" || type !== "All" || length !== "all";

  const reset = () => {
    setRegion("All");
    setType("All");
    setLength("all");
  };

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ChipGroup legend="Region" options={REGIONS} value={region} onChange={setRegion} />
        <ChipGroup legend="Trip style" options={TYPES} value={type} onChange={setType} />
        <ChipGroup
          legend="Length"
          options={LENGTHS.map((l) => l.value)}
          value={length}
          onChange={setLength}
          labels={Object.fromEntries(LENGTHS.map((l) => [l.value, l.label]))}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-5">
        <p className="t-small text-[var(--color-body-soft)]" aria-live="polite">
          Showing {filtered.length} of {packages.length} trips
        </p>
        {dirty && (
          <button
            type="button"
            onClick={reset}
            className="pressable inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-[var(--color-teal-700)]"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Clear filters
          </button>
        )}
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
