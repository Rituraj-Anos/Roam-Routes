import { Plus, Star, Eye, EyeOff } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { reviews } from "@/data/content";
import { getPackage } from "@/data/packages";

export default function AdminReviews() {
  return (
    <>
      <AdminHeader
        title="Reviews"
        subtitle="Add, feature or hide reviews. Featured reviews show on the homepage."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]">
            <Plus className="size-4" /> Add review
          </button>
        }
      />
      <AdminCard className="p-0">
        <div className="divide-y divide-white/5">
          {reviews.map((r) => {
            const pkg = r.packageSlug ? getPackage(r.packageSlug) : null;
            return (
              <div key={r.id} className="flex items-start gap-4 p-4">
                <span className="font-display inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-teal-800)] text-sm font-bold">
                  {r.author.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{r.author}</p>
                    <span className="flex items-center gap-0.5 text-[var(--color-amber)]">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="size-3 fill-current" />
                      ))}
                    </span>
                    <span className="text-xs text-white/30">· {r.source}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{r.text}</p>
                  {pkg && <p className="mt-1 text-xs text-[var(--color-amber)]">{pkg.title}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.featured && <span className="rounded-full bg-[var(--color-amber)]/15 px-2 py-0.5 text-xs text-[var(--color-amber)]">Featured</span>}
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${r.visible ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/40"}`}>
                    {r.visible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                    {r.visible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </>
  );
}
