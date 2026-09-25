"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  Save,
} from "lucide-react";
import { AdminCard } from "./AdminShell";
import { ConfirmDialog } from "./ConfirmDialog";
import { ImageManager, type ManagedImage } from "./ImageManager";
import { api, withToast } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

/**
 * Blog manager with inline editing.
 *
 * Posts expand in place rather than routing to a separate screen: the list is
 * short and the edit surface is small, so a round trip would cost more than it
 * gives. Publishing is a single toggle that sets the timestamp the public site
 * filters on.
 */
export function BlogManager({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<BlogPost | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const create = async () => {
    setBusy("new");
    const post = await withToast(
      () => api<BlogPost>("/api/admin/blog", { method: "POST", json: {} }),
      { loading: "Creating post", success: "Draft created" },
    );
    setBusy(null);
    if (post) {
      setOpen(post.slug);
      refresh();
    }
  };

  const togglePublish = async (p: BlogPost) => {
    setBusy(p.slug);
    const isPublished = Boolean(p.publishedAt);
    const done = await withToast(
      () =>
        api(`/api/admin/blog/${p.slug}`, {
          method: "PATCH",
          json: { published: !isPublished },
        }),
      { loading: "Updating", success: isPublished ? "Moved to draft" : "Published" },
    );
    setBusy(null);
    if (done) refresh();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(toDelete.slug);
    const done = await withToast(
      () => api(`/api/admin/blog/${toDelete.slug}`, { method: "DELETE" }),
      { loading: "Deleting", success: "Post deleted" },
    );
    setBusy(null);
    setToDelete(null);
    if (done) refresh();
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Blog & Guides</h1>
          <p className="mt-1 text-sm text-white/50">
            {posts.filter((p) => p.publishedAt).length} published ·{" "}
            {posts.filter((p) => !p.publishedAt).length} drafts
          </p>
        </div>
        <button
          type="button"
          onClick={create}
          disabled={busy === "new"}
          className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-60"
        >
          {busy === "new" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          New post
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((p) => {
          const isOpen = open === p.slug;
          const published = Boolean(p.publishedAt);
          const rowBusy = busy === p.slug;

          return (
            <AdminCard key={p.slug} className={cn("p-0", rowBusy && "opacity-50")}>
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                  aria-expanded={isOpen}
                  className="flex min-w-[12rem] flex-1 items-center gap-3 text-left"
                >
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "size-4 shrink-0 text-white/40 transition-transform duration-[240ms] ease-[var(--ease-out)]",
                      isOpen && "rotate-180",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.title}</span>
                    <span className="mt-0.5 block text-xs text-white/40">
                      {p.tag} · {p.readMinutes} min
                      {published &&
                        ` · ${new Date(p.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`}
                    </span>
                  </span>
                </button>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    published
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-amber-500/15 text-amber-300",
                  )}
                >
                  {published ? "published" : "draft"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => togglePublish(p)}
                    aria-label={published ? "Move to draft" : "Publish"}
                    title={published ? "Move to draft" : "Publish"}
                    className="pressable grid size-9 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>

                  {published && (
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      aria-label="View on site"
                      title="View on site"
                      className="grid size-9 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => setToDelete(p)}
                    aria-label="Delete post"
                    title="Delete post"
                    className="pressable grid size-9 place-items-center rounded-lg text-white/45 transition-colors hover:bg-red-500/20 hover:text-red-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="accordion-panel" data-open={isOpen}>
                <div>
                  <PostEditor post={p} onSaved={refresh} />
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {posts.length === 0 && (
        <AdminCard>
          <p className="py-10 text-center text-sm text-white/50">
            No guides yet. This is the area every competitor is weakest on.
          </p>
        </AdminCard>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete "${toDelete?.title}"?`}
        body="The post and its content are removed permanently. To take it off the site but keep it, move it to draft instead."
        confirmLabel="Delete post"
        busy={busy === toDelete?.slug}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

function PostEditor({ post, onSaved }: { post: BlogPost; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: post.title,
    tag: post.tag,
    excerpt: post.excerpt,
    body: post.body,
    readMinutes: post.readMinutes,
  });
  const [cover, setCover] = useState<ManagedImage[]>(
    post.coverImage ? [{ url: post.coverImage }] : [],
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const done = await withToast(
      () =>
        api(`/api/admin/blog/${post.slug}`, {
          method: "PATCH",
          json: { ...form, coverImage: cover[0]?.url ?? "" },
        }),
      { loading: "Saving post", success: "Post saved" },
    );
    setSaving(false);
    if (done) onSaved();
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-teal-600)]";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40";

  return (
    <div className="border-t border-white/8 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`t-${post.slug}`}>Title</label>
          <input
            id={`t-${post.slug}`}
            className={field}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className={label} htmlFor={`g-${post.slug}`}>Tag</label>
          <input
            id={`g-${post.slug}`}
            className={field}
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            placeholder="Sikkim, Permits, Darjeeling"
          />
        </div>
        <div>
          <label className={label} htmlFor={`m-${post.slug}`}>Read time (minutes)</label>
          <input
            id={`m-${post.slug}`}
            type="number"
            min={1}
            max={60}
            className={field}
            value={form.readMinutes}
            onChange={(e) => setForm({ ...form, readMinutes: Number(e.target.value) })}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`e-${post.slug}`}>Excerpt</label>
          <textarea
            id={`e-${post.slug}`}
            rows={2}
            className={field}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="One or two lines shown on the guides index."
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`b-${post.slug}`}>Body</label>
          <textarea
            id={`b-${post.slug}`}
            rows={8}
            className={field}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Leave a blank line between paragraphs."
          />
          <p className="mt-1.5 text-xs text-white/35">
            Separate paragraphs with a blank line.
          </p>
        </div>
        <div className="sm:col-span-2">
          <ImageManager
            single
            label="Cover image"
            images={cover}
            onChange={setCover}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="pressable mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Save className="size-4" aria-hidden />
        )}
        {saving ? "Saving" : "Save post"}
      </button>
    </div>
  );
}
