"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, Loader2 } from "lucide-react";
import { AdminCard } from "./AdminShell";
import { api, withToast } from "@/lib/client-api";
import type { SiteSettings } from "@/lib/store/db";

/**
 * Site settings. These drive the public site directly: the WhatsApp number
 * behind every CTA, the footer contact block, and the seasonal road-status note.
 */
export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    const done = await withToast(
      () => api<SiteSettings>("/api/admin/settings", { method: "PATCH", json: form }),
      { loading: "Saving settings", success: "Settings saved" },
    );
    setSaving(false);
    if (done) {
      setSaved(true);
      startTransition(() => router.refresh());
    }
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[var(--color-cream)] outline-none transition-colors placeholder:text-white/30 focus:border-[var(--color-teal-600)]";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-white/40";

  return (
    <div className="space-y-5">
      <AdminCard>
        <h2 className="font-display mb-1 text-[1.0625rem] font-semibold">Contact</h2>
        <p className="mb-5 text-xs text-white/40">
          The WhatsApp number here is used by every chat button on the site.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="s-wa">WhatsApp number</label>
            <input
              id="s-wa"
              className={field}
              value={form.whatsapp}
              onChange={set("whatsapp")}
              inputMode="tel"
              placeholder="919000000000"
            />
            <p className="mt-1.5 text-xs text-white/35">
              Country code, no spaces or plus sign.
            </p>
          </div>
          <div>
            <label className={label} htmlFor="s-email">Contact email</label>
            <input id="s-email" type="email" className={field} value={form.email} onChange={set("email")} />
          </div>
          <div>
            <label className={label} htmlFor="s-base">Based in</label>
            <input id="s-base" className={field} value={form.base} onChange={set("base")} />
          </div>
          <div>
            <label className={label} htmlFor="s-hours">Hours</label>
            <input id="s-hours" className={field} value={form.hours} onChange={set("hours")} />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display mb-5 text-[1.0625rem] font-semibold">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["instagram", "facebook", "youtube"] as const).map((k) => (
            <div key={k}>
              <label className={label} htmlFor={`s-${k}`}>{k}</label>
              <input
                id={`s-${k}`}
                type="url"
                className={field}
                value={form[k]}
                onChange={set(k)}
                placeholder="https://"
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="font-display mb-1 text-[1.0625rem] font-semibold">Seasonal and SEO</h2>
        <p className="mb-5 text-xs text-white/40">
          Update the road-status note when conditions change. It is the kind of
          detail travellers remember you for.
        </p>
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="s-road">Current road-status note</label>
            <textarea id="s-road" rows={2} className={field} value={form.roadStatus} onChange={set("roadStatus")} />
          </div>
          <div>
            <label className={label} htmlFor="s-seo">Default SEO title</label>
            <input id="s-seo" className={field} value={form.seoTitle} onChange={set("seoTitle")} />
          </div>
        </div>
      </AdminCard>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="pressable inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {saving ? "Saving" : "Save settings"}
        </button>
        {saved && !saving && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300">
            <Check className="size-4" aria-hidden /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
