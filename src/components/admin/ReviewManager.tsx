"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Eye, EyeOff, Trash2, Loader2, X } from "lucide-react";
import { AdminCard } from "./AdminShell";
import { ConfirmDialog } from "./ConfirmDialog";
import { api, withToast } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import type { Review, Package } from "@/lib/types";

/**
 * Reviews manager. Featured reviews appear on the homepage, hidden ones vanish
 * from the public site entirely but are kept on record.
 */
export function ReviewManager({
  reviews,
  packages,
}: {
  reviews: Review[];
  packages: Pick<Package, "slug" | "title">[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Review | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    author: "",
    rating: 5,
    text: "",
    source: "Google",
    packageSlug: "",
    featured: false,
  });

  const refresh = () => startTransition(() => router.refresh());

  const create = async () => {
    if (!draft.author.trim() || !draft.text.trim()) return;
    setBusy("new");
    const done = await withToast(
      () => api("/api/admin/reviews", { method: "POST", json: draft }),
      { loading: "Adding review", success: "Review added" },
    );
    setBusy(null);
    if (done) {
      setDraft({ author: "", rating: 5, text: "", source: "Google", packageSlug: "", featured: false });
      setAdding(false);
      refresh();
    }
  };

  const patch = async (r: Review, body: Partial<Review>, label: string) => {
    setBusy(r.id);
    const done = await withToast(
      () => api(`/api/admin/reviews/${r.id}`, { method: "PATCH", json: body }),
      { loading: "Updating", success: label },
    );
    setBusy(null);
    if (done) refresh();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(toDelete.id);
    const done = await withToast(
      () => api(`/api/admin/reviews/${toDelete.id}`, { method: "DELETE" }),
      { loading: "Deleting", success: "Review deleted" },
    );
    setBusy(null);
    setToDelete(null);
    if (done) refresh();
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-teal-600)]";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40";

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="mt-1 text-sm text-white/50">
            {reviews.filter((r) => r.visible).length} visible ·{" "}
            {reviews.filter((r) => r.featured).length} on the homepage
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]"
        >
          {adding ? <X className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          {adding ? "Cancel" : "Add review"}
        </button>
      </div>

      {adding && (
        <AdminCard className="mb-5">
          <h2 className="font-display mb-4 text-[1.0625rem] font-semibold">New review</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="rv-author">Reviewer name</label>
              <input
                id="rv-author"
                className={field}
                value={draft.author}
                onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                placeholder="Ananya Sen"
              />
            </div>
            <div>
              <label className={label} htmlFor="rv-rating">Rating</label>
              <select
                id="rv-rating"
                className={field}
                value={draft.rating}
                onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="rv-source">Source</label>
              <select
                id="rv-source"
                className={field}
                value={draft.source}
                onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              >
                <option value="Google">Google</option>
                <option value="Manual">Added manually</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="rv-pkg">Trip taken</label>
              <select
                id="rv-pkg"
                className={field}
                value={draft.packageSlug}
                onChange={(e) => setDraft({ ...draft, packageSlug: e.target.value })}
              >
                <option value="">Not trip-specific</option>
                {packages.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.title}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="rv-text">Review</label>
              <textarea
                id="rv-text"
                rows={3}
                className={field}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                placeholder="Keep it to a couple of sentences."
              />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-white/70">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                className="size-4 rounded accent-[var(--color-teal-600)]"
              />
              Show on the homepage
            </label>
          </div>
          <button
            type="button"
            onClick={create}
            disabled={busy === "new" || !draft.author.trim() || !draft.text.trim()}
            className="pressable mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-50"
          >
            {busy === "new" && <Loader2 className="size-4 animate-spin" aria-hidden />}
            Save review
          </button>
        </AdminCard>
      )}

      <AdminCard className="p-0">
        <ul className="divide-y divide-white/5">
          {reviews.map((r) => {
            const pkg = packages.find((p) => p.slug === r.packageSlug);
            const rowBusy = busy === r.id;
            return (
              <li
                key={r.id}
                className={cn(
                  "flex flex-wrap items-start gap-4 p-4",
                  rowBusy && "pointer-events-none opacity-50",
                  !r.visible && "opacity-60",
                )}
              >
                <span
                  aria-hidden
                  className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-teal-800)] text-sm font-semibold"
                >
                  {r.author.charAt(0)}
                </span>

                <div className="min-w-[14rem] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{r.author}</p>
                    <span
                      className="flex items-center gap-0.5 text-[var(--color-accent-soft)]"
                      role="img"
                      aria-label={`${r.rating} of 5`}
                    >
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="size-3 fill-current" aria-hidden />
                      ))}
                    </span>
                    <span className="text-xs text-white/30">via {r.source}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{r.text}</p>
                  {pkg && (
                    <p className="mt-1 text-xs text-[var(--color-accent-soft)]">{pkg.title}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      patch(
                        r,
                        { featured: !r.featured },
                        r.featured ? "Removed from homepage" : "Featured on homepage",
                      )
                    }
                    aria-label={r.featured ? "Remove from homepage" : "Feature on homepage"}
                    title={r.featured ? "Remove from homepage" : "Feature on homepage"}
                    className={cn(
                      "pressable grid size-9 place-items-center rounded-lg transition-colors hover:bg-white/5",
                      r.featured ? "text-[var(--color-accent-soft)]" : "text-white/40 hover:text-white",
                    )}
                  >
                    <Star className={cn("size-4", r.featured && "fill-current")} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      patch(r, { visible: !r.visible }, r.visible ? "Hidden" : "Now visible")
                    }
                    aria-label={r.visible ? "Hide review" : "Show review"}
                    title={r.visible ? "Hide review" : "Show review"}
                    className="pressable grid size-9 place-items-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {r.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setToDelete(r)}
                    aria-label="Delete review"
                    title="Delete review"
                    className="pressable grid size-9 place-items-center rounded-lg text-white/40 transition-colors hover:bg-red-500/20 hover:text-red-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {reviews.length === 0 && (
          <p className="p-12 text-center text-sm text-white/50">No reviews yet.</p>
        )}
      </AdminCard>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this review?"
        body={`"${toDelete?.text.slice(0, 80)}${(toDelete?.text.length ?? 0) > 80 ? "…" : ""}" will be removed permanently. To keep it on record, hide it instead.`}
        confirmLabel="Delete review"
        busy={busy === toDelete?.id}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
