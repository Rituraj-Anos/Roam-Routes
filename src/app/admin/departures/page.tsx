import Link from "next/link";
import { CalendarClock, ArrowUpRight } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { DepartureManager } from "@/components/admin/DepartureManager";
import { listPackages } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminDepartures() {
  const packages = await listPackages();
  const withDates = packages.filter((p) => p.status !== "archived");
  const total = packages.flatMap((p) => p.departures).length;
  const open = packages
    .flatMap((p) => p.departures)
    .filter((d) => d.status === "open").length;

  return (
    <>
      <AdminHeader
        title="Departures"
        subtitle={`${total} dates across ${withDates.length} trips · ${open} still open`}
      />

      {withDates.length === 0 ? (
        <AdminCard>
          <div className="py-12 text-center">
            <CalendarClock
              className="mx-auto size-7 text-white/30"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="mt-3 text-sm text-white/50">
              No active packages to schedule yet.
            </p>
            <Link
              href="/admin/packages"
              className="pressable mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-soft)]"
            >
              Go to packages <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-5">
          {withDates.map((p) => (
            <div key={p.id}>
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <h2 className="font-display text-sm font-semibold text-white/70">
                  {p.title}
                </h2>
                <Link
                  href={`/admin/packages/${p.slug}`}
                  className="text-xs text-white/40 transition-colors hover:text-white"
                >
                  Edit trip
                </Link>
              </div>
              <DepartureManager slug={p.slug} departures={p.departures} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
