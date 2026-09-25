import Link from "next/link";
import Image from "next/image";
import { Plus, Star, Pencil } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { packages } from "@/data/packages";
import { formatPrice } from "@/lib/utils";

export default function AdminPackages() {
  return (
    <>
      <AdminHeader
        title="Packages"
        subtitle="Create, edit and feature your tour packages."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]">
            <Plus className="size-4" /> New package
          </button>
        }
      />

      <AdminCard className="p-0">
        <div className="divide-y divide-white/5">
          {packages.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={p.heroImage} alt={p.title} fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  {p.featured && <Star className="size-3.5 fill-[var(--color-amber)] text-[var(--color-amber)]" />}
                </div>
                <p className="text-xs text-white/40">
                  {p.region} · {p.type} · {p.durationNights}N/{p.durationDays}D · {formatPrice(p.priceFrom)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  p.status === "published"
                    ? "bg-emerald-500/15 text-emerald-300"
                    : p.status === "draft"
                      ? "bg-amber-500/15 text-amber-300"
                      : "bg-white/10 text-white/50"
                }`}
              >
                {p.status}
              </span>
              <Link href={`/admin/packages/${p.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 hover:bg-white/5">
                <Pencil className="size-3.5" /> Edit
              </Link>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
