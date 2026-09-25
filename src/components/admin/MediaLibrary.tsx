"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Link2,
  Trash2,
  Loader2,
  Instagram,
  Copy,
  Check,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "./AdminShell";
import { ConfirmDialog } from "./ConfirmDialog";
import { api, withToast } from "@/lib/client-api";
import { cn } from "@/lib/utils";
import type { MediaAsset, Package } from "@/lib/types";

/**
 * Media library.
 *
 * Handles both real file uploads and Instagram reel links, filed against a
 * package when one is chosen. Copying an asset URL is a first-class action,
 * since that is how photos get pasted into a package's gallery.
 */
export function MediaLibrary({
  assets,
  packages,
}: {
  assets: MediaAsset[];
  packages: Pick<Package, "slug" | "title">[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [pkgSlug, setPkgSlug] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<MediaAsset | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const upload = async (files: FileList | File[] | null) => {
    const list = files ? Array.from(files).filter((f) => f.type.startsWith("image/")) : [];
    if (list.length === 0) {
      toast.error("Pick an image file (JPG, PNG, WebP or AVIF)");
      return;
    }

    setUploading(true);
    let done = 0;
    for (const file of list) {
      const form = new FormData();
      form.append("file", file);
      if (pkgSlug) form.append("packageSlug", pkgSlug);
      try {
        await api("/api/admin/media", { method: "POST", body: form });
        done += 1;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : `Could not upload ${file.name}`);
      }
    }
    setUploading(false);

    if (done > 0) {
      toast.success(done === 1 ? "Image uploaded" : `${done} images uploaded`);
      refresh();
    }
  };

  const attachReel = async () => {
    if (!reelUrl.trim()) return;
    const done = await withToast(
      () =>
        api("/api/admin/media", {
          method: "POST",
          json: { url: reelUrl.trim(), type: "reel", packageSlug: pkgSlug || undefined },
        }),
      { loading: "Attaching reel", success: "Reel attached" },
    );
    if (done) {
      setReelUrl("");
      refresh();
    }
  };

  const copy = async (url: string) => {
    const absolute = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(url);
      toast.success("URL copied");
      setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(toDelete.id);
    const done = await withToast(
      () => api(`/api/admin/media/${toDelete.id}`, { method: "DELETE" }),
      { loading: "Deleting", success: "Asset deleted" },
    );
    setBusy(null);
    setToDelete(null);
    if (done) refresh();
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-teal-600)]";

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Media Library</h1>
        <p className="mt-1 text-sm text-white/50">
          {assets.filter((a) => a.type === "photo").length} photos ·{" "}
          {assets.filter((a) => a.type === "reel").length} reels
        </p>
      </div>

      {/* File to attach against */}
      <AdminCard className="mb-5">
        <label
          htmlFor="media-pkg"
          className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40"
        >
          File new uploads under
        </label>
        <select
          id="media-pkg"
          value={pkgSlug}
          onChange={(e) => setPkgSlug(e.target.value)}
          className={cn(field, "sm:max-w-sm")}
        >
          <option value="">No particular trip</option>
          {packages.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </select>
      </AdminCard>

      {/* Dropzone */}
      <AdminCard
        className={cn(
          "mb-5 border-dashed transition-colors",
          dragging && "border-[var(--color-teal-600)] bg-[var(--color-teal-800)]/10",
        )}
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            upload(e.dataTransfer.files);
          }}
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          {uploading ? (
            <Loader2 className="size-7 animate-spin text-[var(--color-accent-soft)]" aria-hidden />
          ) : (
            <Upload className="size-7 text-white/30" strokeWidth={1.5} aria-hidden />
          )}
          <p className="mt-3 text-sm text-white/60">
            {uploading ? "Uploading" : "Drag images here, or"}{" "}
            {!uploading && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="font-medium text-[var(--color-accent-soft)] underline-offset-2 hover:underline"
              >
                browse your files
              </button>
            )}
          </p>
          <p className="mt-1 text-xs text-white/30">
            JPG, PNG, WebP or AVIF · up to 8 MB each
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </AdminCard>

      {/* Reel attach */}
      <AdminCard className="mb-5">
        <h2 className="font-display mb-3 text-[1.0625rem] font-semibold">
          Attach an Instagram reel
        </h2>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Link2
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30"
              aria-hidden
            />
            <input
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  attachReel();
                }
              }}
              placeholder="https://instagram.com/reel/..."
              aria-label="Instagram reel URL"
              className={cn(field, "pl-9")}
            />
          </div>
          <button
            type="button"
            onClick={attachReel}
            disabled={!reelUrl.trim()}
            className="pressable inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-50"
          >
            <Instagram className="size-4" aria-hidden /> Attach
          </button>
        </div>
      </AdminCard>

      {/* Grid */}
      {assets.length === 0 ? (
        <AdminCard>
          <div className="py-12 text-center">
            <ImageOff className="mx-auto size-7 text-white/25" strokeWidth={1.5} aria-hidden />
            <p className="mt-3 text-sm text-white/50">
              Nothing here yet. Upload a photo to get started.
            </p>
          </div>
        </AdminCard>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => {
            const pkg = packages.find((p) => p.slug === a.packageSlug);
            const rowBusy = busy === a.id;

            return (
              <li
                key={a.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-white/10 bg-black/20",
                  rowBusy && "pointer-events-none opacity-50",
                )}
              >
                <div className="relative aspect-square">
                  {a.type === "reel" ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-full place-items-center bg-[var(--color-teal-950)] text-[var(--color-cream)]"
                    >
                      <Instagram className="size-7" strokeWidth={1.5} aria-hidden />
                      <span className="mt-1.5 px-2 text-center text-xs text-white/60">
                        Instagram reel
                      </span>
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.url}
                      alt={a.caption ?? ""}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  )}
                </div>

                {pkg && (
                  <span className="absolute left-2 top-2 max-w-[80%] truncate rounded-full bg-black/60 px-2 py-0.5 text-[0.6875rem] text-white/85 backdrop-blur-sm">
                    {pkg.title}
                  </span>
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/85 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => copy(a.url)}
                    aria-label="Copy URL"
                    title="Copy URL"
                    className="grid size-8 place-items-center rounded-md text-white/75 hover:bg-white/15 hover:text-white"
                  >
                    {copied === a.url ? (
                      <Check className="size-3.5 text-emerald-300" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setToDelete(a)}
                    aria-label="Delete asset"
                    title="Delete asset"
                    className="grid size-8 place-items-center rounded-md text-white/75 hover:bg-red-500/25 hover:text-red-300"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this asset?"
        body="It is removed from the library and the file is deleted. Any package still pointing at this URL will show a broken image."
        confirmLabel="Delete asset"
        busy={busy === toDelete?.id}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
