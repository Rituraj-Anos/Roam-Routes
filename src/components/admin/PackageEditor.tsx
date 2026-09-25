"use client";

import { useState } from "react";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Check } from "lucide-react";
import type { Package, ItineraryDay } from "@/lib/types";
import { AdminCard } from "./AdminShell";
import { ImageManager, type ManagedImage } from "./ImageManager";

/**
 * Package and itinerary editor.
 *
 * Images are managed in three places, matching how they are used on the public
 * site: one hero image, an ordered gallery, and optional photos per itinerary
 * day. `onSave` is the single seam to a Supabase upsert of `packages` plus
 * `itinerary_days`.
 */
const REGIONS: Package["region"][] = ["Darjeeling", "Sikkim", "Dooars", "Kalimpong"];
const TYPES: Package["type"][] = ["Trekking", "Wildlife", "Cultural", "Leisure", "Homestay"];
const STATUSES: Package["status"][] = ["published", "draft", "archived"];

const toManaged = (urls: string[]): ManagedImage[] => urls.map((url) => ({ url }));

export function PackageEditor({ pkg }: { pkg: Package }) {
  const [form, setForm] = useState({
    title: pkg.title,
    region: pkg.region,
    type: pkg.type,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    priceFrom: pkg.priceFrom,
    summary: pkg.summary,
    featured: pkg.featured,
    status: pkg.status,
    permitNote: pkg.permitNote ?? "",
  });

  const [hero, setHero] = useState<ManagedImage[]>(
    pkg.heroImage ? [{ url: pkg.heroImage }] : [],
  );
  const [gallery, setGallery] = useState<ManagedImage[]>(toManaged(pkg.gallery));
  const [days, setDays] = useState<ItineraryDay[]>(pkg.itinerary);
  const [saved, setSaved] = useState(false);

  const touch = () => setSaved(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    touch();
  };

  const setDay = (idx: number, patch: Partial<ItineraryDay>) => {
    setDays((d) => d.map((day, i) => (i === idx ? { ...day, ...patch } : day)));
    touch();
  };

  const addDay = () => {
    setDays((d) => [
      ...d,
      { day: d.length + 1, title: "", description: "", meals: "", stay: "", images: [] },
    ]);
    touch();
  };

  const removeDay = (idx: number) => {
    setDays((d) => d.filter((_, i) => i !== idx).map((day, i) => ({ ...day, day: i + 1 })));
    touch();
  };

  const moveDay = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= days.length) return;
    const next = [...days];
    [next[idx], next[j]] = [next[j], next[idx]];
    setDays(next.map((day, i) => ({ ...day, day: i + 1 })));
    touch();
  };

  const pendingCount =
    [...hero, ...gallery].filter((i) => i.pending).length +
    days.reduce((n, d) => n + (d.images?.length ?? 0), 0) * 0;

  const onSave = () => {
    // TODO: upload any pending files to R2, then upsert packages +
    // itinerary_days via the Supabase admin client.
    console.info("Saving package", {
      slug: pkg.slug,
      form,
      heroImage: hero[0]?.url ?? null,
      gallery: gallery.map((g) => g.url),
      days,
    });
    setSaved(true);
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-teal-600)]";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40";

  return (
    <div className="space-y-5 pb-4">
      {/* Media */}
      <AdminCard>
        <h2 className="font-display mb-1 text-[1.0625rem] font-semibold">Photos</h2>
        <p className="mb-5 text-xs text-white/40">
          The hero image heads the trip page and its card. Gallery order is the
          order travellers see.
        </p>

        <div className="space-y-6">
          <ImageManager
            single
            label="Hero image"
            hint="Landscape works best. Shown full-bleed at the top of the trip page."
            images={hero}
            onChange={(next) => {
              setHero(next);
              touch();
            }}
          />

          <ImageManager
            markFirstAsCover
            label="Gallery"
            hint="Up to 8 photos. The first one leads the gallery grid."
            max={8}
            images={gallery}
            onChange={(next) => {
              setGallery(next);
              touch();
            }}
          />
        </div>
      </AdminCard>

      {/* Details */}
      <AdminCard>
        <h2 className="font-display mb-5 text-[1.0625rem] font-semibold">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="pkg-title">Title</label>
            <input
              id="pkg-title"
              className={field}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div>
            <label className={label} htmlFor="pkg-region">Region</label>
            <select
              id="pkg-region"
              className={field}
              value={form.region}
              onChange={(e) => set("region", e.target.value as Package["region"])}
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} htmlFor="pkg-type">Type</label>
            <select
              id="pkg-type"
              className={field}
              value={form.type}
              onChange={(e) => set("type", e.target.value as Package["type"])}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} htmlFor="pkg-nights">Nights</label>
            <input
              id="pkg-nights"
              type="number"
              min={1}
              className={field}
              value={form.durationNights}
              onChange={(e) => set("durationNights", Number(e.target.value))}
            />
          </div>

          <div>
            <label className={label} htmlFor="pkg-days">Days</label>
            <input
              id="pkg-days"
              type="number"
              min={1}
              className={field}
              value={form.durationDays}
              onChange={(e) => set("durationDays", Number(e.target.value))}
            />
          </div>

          <div>
            <label className={label} htmlFor="pkg-price">Price from (₹)</label>
            <input
              id="pkg-price"
              type="number"
              min={0}
              step={500}
              className={field}
              value={form.priceFrom}
              onChange={(e) => set("priceFrom", Number(e.target.value))}
            />
          </div>

          <div>
            <label className={label} htmlFor="pkg-status">Status</label>
            <select
              id="pkg-status"
              className={field}
              value={form.status}
              onChange={(e) => set("status", e.target.value as Package["status"])}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="pkg-summary">Summary</label>
            <textarea
              id="pkg-summary"
              rows={3}
              className={field}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={label} htmlFor="pkg-permit">Permit and advisory note</label>
            <textarea
              id="pkg-permit"
              rows={2}
              className={field}
              value={form.permitNote}
              onChange={(e) => set("permitNote", e.target.value)}
              placeholder="Shown prominently on the trip page."
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="size-4 rounded accent-[var(--color-teal-600)]"
            />
            Feature on the homepage
          </label>
        </div>
      </AdminCard>

      {/* Itinerary */}
      <AdminCard>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[1.0625rem] font-semibold">Itinerary</h2>
            <p className="mt-1 text-xs text-white/40">
              {days.length} {days.length === 1 ? "day" : "days"}. Photos here appear
              inside the expanded day on the trip page.
            </p>
          </div>
          <button
            type="button"
            onClick={addDay}
            className="pressable inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/5"
          >
            <Plus className="size-3.5" aria-hidden /> Add day
          </button>
        </div>

        <ol className="space-y-3">
          {days.map((d, i) => (
            <li key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-3.5 flex items-center gap-2">
                <span className="font-display grid size-7 place-items-center rounded-full bg-[var(--color-teal-800)] text-xs font-semibold">
                  {d.day}
                </span>
                <span className="text-sm font-semibold">Day {d.day}</span>

                <div className="ml-auto flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveDay(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move day ${d.day} earlier`}
                    className="grid size-8 place-items-center rounded-md text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-25"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDay(i, 1)}
                    disabled={i === days.length - 1}
                    aria-label={`Move day ${d.day} later`}
                    className="grid size-8 place-items-center rounded-md text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-25"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDay(i)}
                    aria-label={`Remove day ${d.day}`}
                    className="grid size-8 place-items-center rounded-md text-white/40 hover:bg-red-500/20 hover:text-red-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={field}
                  placeholder="Day title"
                  aria-label={`Day ${d.day} title`}
                  value={d.title}
                  onChange={(e) => setDay(i, { title: e.target.value })}
                />
                <input
                  className={field}
                  placeholder="Stay, e.g. Gangtok hotel"
                  aria-label={`Day ${d.day} stay`}
                  value={d.stay}
                  onChange={(e) => setDay(i, { stay: e.target.value })}
                />
                <input
                  className={`${field} sm:col-span-2`}
                  placeholder="Meals, e.g. Breakfast, Dinner"
                  aria-label={`Day ${d.day} meals`}
                  value={d.meals}
                  onChange={(e) => setDay(i, { meals: e.target.value })}
                />
                <textarea
                  rows={2}
                  className={`${field} sm:col-span-2`}
                  placeholder="What happens on this day"
                  aria-label={`Day ${d.day} description`}
                  value={d.description}
                  onChange={(e) => setDay(i, { description: e.target.value })}
                />
              </div>

              <div className="mt-4 border-t border-white/8 pt-4">
                <ImageManager
                  label={`Day ${d.day} photos`}
                  max={3}
                  images={toManaged(d.images ?? [])}
                  onChange={(next) => setDay(i, { images: next.map((n) => n.url) })}
                />
              </div>
            </li>
          ))}
        </ol>

        {days.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-white/40">
            No days yet. Add the first one to start the itinerary.
          </p>
        )}
      </AdminCard>

      {/* Save bar */}
      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-3 border-t border-white/10 bg-[#0e1417]/85 px-1 py-4 backdrop-blur-lg">
        <button
          type="button"
          onClick={onSave}
          className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)]"
        >
          <Save className="size-4" aria-hidden /> Save changes
        </button>

        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
            <Check className="size-4" aria-hidden />
            Saved. Connect Supabase to persist.
          </span>
        )}

        {pendingCount > 0 && !saved && (
          <span className="text-sm text-amber-300">
            {pendingCount} {pendingCount === 1 ? "photo" : "photos"} not uploaded yet.
          </span>
        )}
      </div>
    </div>
  );
}
