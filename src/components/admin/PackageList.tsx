"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Star,
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ImageOff,
  ExternalLink,
} from "lucide-react";
import { AdminCard } from "./AdminShell";
import { ConfirmDialog } from "./ConfirmDialog";
import { api, withToast } from "@/lib/client-api";
import { formatPrice, cn } from "@/lib/utils";
import type { Package } from "@/lib/types";

/**
 * Package list with working row actions.
 *
 * After every mutation the server components are refreshed through
 * `router.refresh()`, so the list, the dashboard counts and the public site all
 * reflect the change without a manual reload.
 */
export function PackageList({ packages }: { packages: Package[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyRow, setBusyRow] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Package | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const create = async () => {
    const pkg = await withToast(
      () => api<Package>("/api/admin/packages", { method: "POST", json: {} }),
      { loading: "Creating package", success: "Draft created" },
    );
    if (pkg) {
      refresh();
      router.push(`/admin/packages/${pkg.slug}`);
    }
  };

  const duplicate = async (pkg: Package) => {
    setBusyRow(pkg.slug);
    const copy = await withToast(
      () =>
        api<Package>("/api/admin/packages", {
          method: "POST",
          json: { duplicateOf: pkg.slug },
        }),
      { loading: "Duplicating", success: (c) => `Created "${c.title}"` },
    );
    setBusyRow(null);
    if (copy) refresh();
  };

  const patch = async (pkg: Package, body: Partial<Package>, label: string) => {
    setBusyRow(pkg.slug);
    const done = await withToast(
      () =>
        api<Package>(`/api/admin/packages/${pkg.slug}`, {
          method: "PATCH",
          json: body,
        }),
      { loading: "Saving", success: label },
    );
    setBusyRow(null);
    if (done) refresh();
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const slug = toDelete.slug;
    setBusyRow(slug);
    const done = await withToast(
      () => api(`/api/admin/packages/${slug}`, { method: "DELETE" }),
      { loading: "Deleting", success: "Package deleted" },
    );
    setBusyRow(null);
    setToDelete(null);
    if (done) refresh();
  };

  const statusStyle = (status: Package["status"]) =>
    status === "published"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "draft"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-white/10 text-white/50";

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Packages</h1>
          <p className="mt-1 text-sm text-white/50">
            {packages.length} total ·{" "}
            {packages.filter((p) => p.status === "published").length} live
          </p>
        </div>
        <button
          type="button"
          onClick={create}
          className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]"
        >
          <Plus className="size-4" aria-hidden /> New package
        </button>
      </div>

      <AdminCard className={cn("p-0", pending && "opacity-70")}>
        <ul className="divide-y divide-white/5">
          {packages.map((p) => {
            const rowBusy = busyRow === p.slug;
            return (
              <li
                key={p.id}
                className={cn(
                  "flex flex-wrap items-center gap-4 p-4 transition-opacity",
                  rowBusy && "pointer-events-none opacity-50",
                )}
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
                  {p.heroImage ? (
                    // Arbitrary hosts and local uploads bypass next/image here.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.heroImage}
                      alt=""
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="grid size-full place-items-center text-white/25">
                      <ImageOff className="size-5" strokeWidth={1.5} aria-hidden />
                    </span>
                  )}
                </div>

                <div className="min-w-[12rem] flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{p.title}</p>
                    {p.featured && (
                      <Star
                        className="size-3.5 shrink-0 fill-[var(--color-accent-soft)] text-[var(--color-accent-soft)]"
                        aria-label="Featured"
                      />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">
                    {p.region} · {p.type} · {p.durationNights}N/{p.durationDays}D ·{" "}
                    {formatPrice(p.priceFrom)} · {p.departures.length} dates
                  </p>
                </div>

                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    statusStyle(p.status),
                  )}
                >
                  {p.status}
                </span>

                <div className="flex items-center gap-1">
                  <IconButton
                    label={p.featured ? "Unfeature" : "Feature on homepage"}
                    onClick={() =>
                      patch(
                        p,
                        { featured: !p.featured },
                        p.featured ? "Removed from homepage" : "Featured on homepage",
                      )
                    }
                    active={p.featured}
                  >
                    <Star className={cn("size-4", p.featured && "fill-current")} />
                  </IconButton>

                  <IconButton
                    label={p.status === "published" ? "Unpublish" : "Publish"}
                    onClick={() =>
                      patch(
                        p,
                        { status: p.status === "published" ? "draft" : "published" },
                        p.status === "published" ? "Moved to draft" : "Published",
                      )
                    }
                  >
                    {p.status === "published" ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeOff className="size-4" />
                    )}
                  </IconButton>

                  <IconButton label="Duplicate" onClick={() => duplicate(p)}>
                    <Copy className="size-4" />
                  </IconButton>

                  {p.status === "published" && (
                    <Link
                      href={`/tours/${p.slug}`}
                      target="_blank"
                      aria-label="View on site"
                      title="View on site"
                      className="grid size-9 place-items-center rounded-lg text-white/45 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}

                  <IconButton
                    label="Delete"
                    onClick={() => setToDelete(p)}
                    danger
                  >
                    <Trash2 className="size-4" />
                  </IconButton>

                  <Link
                    href={`/admin/packages/${p.slug}`}
                    className="pressable ml-1 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5"
                  >
                    <Pencil className="size-3.5" aria-hidden /> Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        {packages.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-white/50">No packages yet.</p>
            <button
              type="button"
              onClick={create}
              className="pressable mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-4 py-2.5 text-sm font-semibold text-[var(--color-cream)]"
            >
              <Plus className="size-4" aria-hidden /> Create the first one
            </button>
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete "${toDelete?.title}"?`}
        body="This removes the package, its itinerary and its departure dates. Reviews are kept but unlinked. This cannot be undone."
        confirmLabel="Delete package"
        busy={busyRow === toDelete?.slug}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
  danger,
  active,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "pressable grid size-9 place-items-center rounded-lg transition-colors",
        danger
          ? "text-white/45 hover:bg-red-500/20 hover:text-red-300"
          : active
            ? "text-[var(--color-accent-soft)] hover:bg-white/5"
            : "text-white/45 hover:bg-white/5 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
