"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  Link2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Star,
  AlertCircle,
  Upload,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/client-api";
import { cn } from "@/lib/utils";

/**
 * Image manager for package media.
 *
 * Two ways in: paste a URL, or pick files. File picks are held as local object
 * URLs and marked pending so it is obvious they are not yet on the CDN — the
 * upload handler is the single seam to wire to Cloudflare R2.
 *
 * Reorder is explicit left/right rather than drag-only, so it works with a
 * keyboard and on touch.
 */
export interface ManagedImage {
  url: string;
  /** True while the file exists only in the browser, before upload. */
  pending?: boolean;
}

export function ImageManager({
  label,
  hint,
  images,
  onChange,
  max,
  single,
  markFirstAsCover,
}: {
  label: string;
  hint?: string;
  images: ManagedImage[];
  onChange: (next: ManagedImage[]) => void;
  max?: number;
  single?: boolean;
  markFirstAsCover?: boolean;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const atLimit = max !== undefined && images.length >= max;

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      const parsed = new URL(trimmed);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("protocol");
    } catch {
      setError("That does not look like a valid http(s) image URL.");
      return;
    }
    if (images.some((i) => i.url === trimmed)) {
      setError("That image is already attached.");
      return;
    }
    setError(null);
    onChange(single ? [{ url: trimmed }] : [...images, { url: trimmed }]);
    setUrl("");
  };

  /**
   * Uploads immediately rather than holding a local object URL, so what you see
   * in the editor is the real stored asset. The endpoint writes to disk in
   * development and is the single seam to swap for Cloudflare R2.
   */
  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = max === undefined ? files.length : Math.max(0, max - images.length);
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, single ? 1 : room);

    if (picked.length === 0) {
      setError("Pick an image file (JPG, PNG, WebP or AVIF).");
      return;
    }
    setError(null);
    setUploading(true);

    const uploaded: ManagedImage[] = [];
    for (const file of picked) {
      const form = new FormData();
      form.append("file", file);
      try {
        const asset = await api<{ url: string }>("/api/admin/media", {
          method: "POST",
          body: form,
        });
        uploaded.push({ url: asset.url });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      }
    }

    setUploading(false);
    if (uploaded.length === 0) return;

    toast.success(
      uploaded.length === 1 ? "Image uploaded" : `${uploaded.length} images uploaded`,
    );
    onChange(single ? uploaded.slice(0, 1) : [...images, ...uploaded]);
  };

  const remove = (i: number) => {
    const target = images[i];
    if (target.pending) URL.revokeObjectURL(target.url);
    onChange(images.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-teal-600)]";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <label className="block text-xs font-medium uppercase tracking-[0.14em] text-white/40">
          {label}
        </label>
        {max !== undefined && (
          <span className="text-xs tabular-nums text-white/30">
            {images.length} / {max}
          </span>
        )}
      </div>
      {hint && <p className="mb-3 text-xs text-white/40">{hint}</p>}

      {/* Existing images */}
      {images.length > 0 && (
        <ul
          className={cn(
            "mb-3 grid gap-2.5",
            single ? "grid-cols-1 sm:max-w-xs" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {images.map((img, i) => (
            <li
              key={`${img.url}-${i}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
            >
              <div className={cn("relative w-full", single ? "aspect-[16/10]" : "aspect-square")}>
                {/* Local object URLs and arbitrary CDN hosts bypass next/image
                    on purpose: remotePatterns cannot cover unknown hosts. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0.25";
                  }}
                />
              </div>

              {markFirstAsCover && i === 0 && !single && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-teal-800)] px-2 py-0.5 text-[0.6875rem] font-semibold text-[var(--color-cream)]">
                  <Star className="size-3 fill-current" aria-hidden />
                  Cover
                </span>
              )}
              {img.pending && (
                <span className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-2 py-0.5 text-[0.6875rem] font-semibold text-black">
                  Not uploaded
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/85 to-transparent p-1.5">
                <div className="flex gap-0.5">
                  {!single && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="Move image earlier"
                        className="grid size-7 place-items-center rounded-md text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-25"
                      >
                        <ArrowLeft className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === images.length - 1}
                        aria-label="Move image later"
                        className="grid size-7 place-items-center rounded-md text-white/70 hover:bg-white/15 hover:text-white disabled:opacity-25"
                      >
                        <ArrowRight className="size-3.5" />
                      </button>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Remove image"
                  className="grid size-7 place-items-center rounded-md text-white/70 hover:bg-red-500/25 hover:text-red-300"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add controls */}
      {!atLimit && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30"
              aria-hidden
            />
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="Paste an image URL"
              aria-label={`${label}: paste an image URL`}
              className={cn(field, "pl-9")}
            />
          </div>

          <button
            type="button"
            onClick={addUrl}
            className="pressable inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]"
          >
            <ImagePlus className="size-4" aria-hidden />
            Add
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="pressable inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            {uploading ? "Uploading" : "Upload"}
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple={!single}
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {atLimit && (
        <p className="text-xs text-white/40">
          Limit reached. Remove an image to add another.
        </p>
      )}

      {error && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-300">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
