import { Plus, Pencil } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { blogPosts } from "@/data/content";

export default function AdminBlog() {
  return (
    <>
      <AdminHeader
        title="Blog & Guides"
        subtitle="Write SEO destination guides — the area every competitor is weak on."
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]">
            <Plus className="size-4" /> New post
          </button>
        }
      />
      <AdminCard className="p-0">
        <div className="divide-y divide-white/5">
          {blogPosts.map((p) => (
            <div key={p.slug} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="text-xs text-white/40">
                  {p.tag} · {p.readMinutes} min · published{" "}
                  {new Date(p.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">Published</span>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 hover:bg-white/5">
                <Pencil className="size-3.5" /> Edit
              </button>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}
