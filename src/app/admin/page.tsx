import Link from "next/link";
import {
  Package as PackageIcon,
  Inbox,
  Star,
  CalendarClock,
  FileText,
  ArrowUpRight,
  TriangleAlert,
} from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { getStats, listInquiries, listPackages } from "@/lib/store/repo";
import { seatsLeft } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, inquiries, packages] = await Promise.all([
    getStats(),
    listInquiries(),
    listPackages(),
  ]);

  const cards = [
    {
      label: "Published trips",
      value: stats.published,
      hint: stats.drafts > 0 ? `${stats.drafts} in draft` : undefined,
      icon: PackageIcon,
      href: "/admin/packages",
    },
    {
      label: "New inquiries",
      value: stats.newInquiries,
      icon: Inbox,
      href: "/admin/inquiries",
      urgent: stats.newInquiries > 0,
    },
    {
      label: "Open departures",
      value: stats.openDepartures,
      icon: CalendarClock,
      href: "/admin/departures",
    },
    {
      label: "Visible reviews",
      value: stats.visibleReviews,
      icon: Star,
      href: "/admin/reviews",
    },
    { label: "Guides", value: stats.posts, icon: FileText, href: "/admin/blog" },
  ];

  const recent = inquiries.slice(0, 5);

  // Anything with three or fewer seats left is worth surfacing.
  const tight = packages
    .flatMap((p) =>
      p.departures
        .filter((d) => d.status === "open" && seatsLeft(d.totalSeats, d.bookedSeats) <= 3)
        .map((d) => ({ pkg: p, dep: d, left: seatsLeft(d.totalSeats, d.bookedSeats) })),
    )
    .sort((a, b) => a.left - b.left)
    .slice(0, 4);

  const missingHero = packages.filter((p) => p.status === "published" && !p.heroImage);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="A quick pulse on the business." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <AdminCard className="h-full transition-colors hover:border-white/25">
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--color-teal-800)]/40 text-[var(--color-accent-soft)]">
                  <c.icon className="size-5" strokeWidth={1.5} aria-hidden />
                </span>
                {c.urgent && (
                  <span className="rounded-full bg-[var(--color-accent)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--color-accent-soft)]">
                    action
                  </span>
                )}
              </div>
              <p className="font-display mt-4 text-3xl font-semibold tabular-nums">
                {c.value}
              </p>
              <p className="mt-1 text-sm text-white/50">{c.label}</p>
              {c.hint && <p className="mt-0.5 text-xs text-white/30">{c.hint}</p>}
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[1.0625rem] font-semibold">Recent inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-accent-soft)]"
            >
              View all <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recent.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-white/40">
                      {i.travelDates || "Dates open"} · {i.pax} pax
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/70">
                    {i.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <div className="space-y-5">
          <AdminCard>
            <h2 className="font-display mb-4 text-[1.0625rem] font-semibold">
              Filling up
            </h2>
            {tight.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/40">
                Nothing close to selling out.
              </p>
            ) : (
              <ul className="space-y-3">
                {tight.map(({ pkg, dep, left }) => (
                  <li key={dep.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{pkg.title}</p>
                      <p className="text-xs text-white/40">
                        {new Date(dep.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--color-accent)]/20 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-soft)]">
                      {left} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          {missingHero.length > 0 && (
            <AdminCard>
              <div className="flex gap-3">
                <TriangleAlert
                  className="mt-0.5 size-5 shrink-0 text-amber-300"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <h2 className="font-display text-sm font-semibold">Needs a photo</h2>
                  <p className="mt-1 text-sm text-white/55">
                    {missingHero.length}{" "}
                    {missingHero.length === 1 ? "live trip has" : "live trips have"} no
                    hero image, so their cards look empty.
                  </p>
                  <ul className="mt-2.5 space-y-1">
                    {missingHero.slice(0, 3).map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/admin/packages/${p.slug}`}
                          className="text-sm text-[var(--color-accent-soft)] hover:underline"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AdminCard>
          )}
        </div>
      </div>
    </>
  );
}
