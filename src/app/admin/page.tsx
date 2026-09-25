import Link from "next/link";
import { Package, Inbox, Star, CalendarClock, TrendingUp, ArrowUpRight } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { packages } from "@/data/packages";
import { reviews, seedInquiries } from "@/data/content";

export default function AdminDashboard() {
  const published = packages.filter((p) => p.status === "published").length;
  const newInquiries = seedInquiries.filter((i) => i.status === "New").length;
  const openDepartures = packages.flatMap((p) => p.departures).filter((d) => d.status === "open").length;
  const visibleReviews = reviews.filter((r) => r.visible).length;

  const stats = [
    { label: "Published packages", value: published, icon: Package, href: "/admin/packages" },
    { label: "New inquiries", value: newInquiries, icon: Inbox, href: "/admin/inquiries", highlight: true },
    { label: "Open departures", value: openDepartures, icon: CalendarClock, href: "/admin/departures" },
    { label: "Visible reviews", value: visibleReviews, icon: Star, href: "/admin/reviews" },
  ];

  const recent = seedInquiries.slice(0, 4);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="A quick pulse on the business." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <AdminCard className="transition-colors hover:border-white/25">
              <div className="flex items-center justify-between">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--color-teal-800)]/40 text-[var(--color-amber)]">
                  <s.icon className="size-5" strokeWidth={1.5} />
                </span>
                {s.highlight && s.value > 0 && (
                  <span className="rounded-full bg-[var(--color-amber)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--color-amber)]">
                    action needed
                  </span>
                )}
              </div>
              <p className="font-display mt-4 text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent inquiries</h2>
            <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-[var(--color-amber)]">
              View all <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recent.map((i) => (
              <div key={i.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{i.name}</p>
                  <p className="text-xs text-white/40">{i.travelDates} · {i.pax} pax</p>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/70">{i.status}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display mb-4 text-lg font-semibold">This season</h2>
          <div className="flex items-start gap-3 rounded-xl bg-[var(--color-amber)]/10 p-4">
            <TrendingUp className="mt-0.5 size-5 shrink-0 text-[var(--color-amber)]" strokeWidth={1.5} />
            <p className="text-sm text-white/70">
              Sandakphu and Sikkim departures are filling fast for Oct–Nov. Consider adding a new Sikkim date and posting the current road-status note in Settings.
            </p>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
