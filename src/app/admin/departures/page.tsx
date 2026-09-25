import { Plus } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { packages } from "@/data/packages";
import { seatsLeft } from "@/lib/utils";

export default function AdminDepartures() {
  return (
    <>
      <AdminHeader
        title="Departures"
        subtitle="Fixed dates and live seat counts. Sold-out dates hide their booking CTA on the site."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]">
            <Plus className="size-4" /> New departure
          </button>
        }
      />
      <div className="space-y-6">
        {packages.map((p) => (
          <AdminCard key={p.id}>
            <h2 className="font-display mb-4 text-base font-semibold">{p.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-white/40">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Seats</th>
                    <th className="pb-3 font-medium">Left</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {p.departures.map((d) => {
                    const left = seatsLeft(d.totalSeats, d.bookedSeats);
                    return (
                      <tr key={d.id}>
                        <td className="py-3">
                          {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-3 text-white/60">{d.bookedSeats} / {d.totalSeats}</td>
                        <td className="py-3">
                          <span className={left <= 3 && left > 0 ? "text-[var(--color-amber)]" : "text-white/60"}>
                            {left} left
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${d.status === "open" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>
                            {d.status === "open" ? "Open" : "Sold out"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
