import Image from "next/image";
import { Upload, Link as LinkIcon, Instagram } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { packages } from "@/data/packages";

export default function AdminMedia() {
  const assets = packages.flatMap((p) =>
    p.gallery.map((url, i) => ({ url, caption: `${p.title} — ${i + 1}`, key: `${p.id}-${i}` })),
  );

  return (
    <>
      <AdminHeader
        title="Media Library"
        subtitle="Upload photos to Cloudflare R2 and attach Instagram Reel links per package."
        action={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
              <LinkIcon className="size-4" /> Paste Reel URL
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]">
              <Upload className="size-4" /> Upload
            </button>
          </div>
        }
      />

      <AdminCard className="mb-6 border-dashed">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Upload className="size-8 text-white/30" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-white/60">Drag photos here, or click Upload</p>
          <p className="mt-1 text-xs text-white/30">Stored on Cloudflare R2 · optimized via Images Transformations</p>
        </div>
      </AdminCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <div className="flex aspect-square flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-center">
          <Instagram className="size-6 text-white/40" strokeWidth={1.5} />
          <span className="mt-2 px-3 text-xs text-white/40">Reel links attach here</span>
        </div>
        {assets.map((a) => (
          <div key={a.key} className="group relative aspect-square overflow-hidden rounded-xl">
            <Image src={a.url} alt={a.caption} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate text-xs text-white">{a.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
