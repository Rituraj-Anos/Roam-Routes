"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { site } from "@/lib/site";

export default function AdminSettings() {
  const [form, setForm] = useState({
    whatsapp: site.whatsapp,
    email: site.email,
    instagram: site.socials.instagram,
    facebook: site.socials.facebook,
    youtube: site.socials.youtube,
    roadStatus: "Hill roads clear as of season start. Monsoon advisory Jun–Sep.",
    seoTitle: `${site.name} — ${site.tagline}`,
  });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[var(--color-cream)] outline-none focus:border-[var(--color-teal-600)]";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/40";

  return (
    <>
      <AdminHeader title="Site Settings" subtitle="WhatsApp number, contact details, social links and seasonal road status." />
      <div className="space-y-6">
        <AdminCard>
          <h2 className="font-display mb-4 text-lg font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>WhatsApp number</label>
              <input className={field} value={form.whatsapp} onChange={set("whatsapp")} />
            </div>
            <div>
              <label className={label}>Contact email</label>
              <input className={field} value={form.email} onChange={set("email")} />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display mb-4 text-lg font-semibold">Social links</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>Instagram</label>
              <input className={field} value={form.instagram} onChange={set("instagram")} />
            </div>
            <div>
              <label className={label}>Facebook</label>
              <input className={field} value={form.facebook} onChange={set("facebook")} />
            </div>
            <div>
              <label className={label}>YouTube</label>
              <input className={field} value={form.youtube} onChange={set("youtube")} />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="font-display mb-4 text-lg font-semibold">Seasonal & SEO</h2>
          <div className="space-y-4">
            <div>
              <label className={label}>Current road-status note</label>
              <textarea rows={2} className={field} value={form.roadStatus} onChange={set("roadStatus")} />
            </div>
            <div>
              <label className={label}>Default SEO title</label>
              <input className={field} value={form.seoTitle} onChange={set("seoTitle")} />
            </div>
          </div>
        </AdminCard>

        <div className="flex items-center gap-3">
          <button onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)]">
            <Save className="size-4" /> Save settings
          </button>
          {saved && <span className="text-sm text-emerald-300">Saved (demo — connect Supabase to persist)</span>}
        </div>
      </div>
    </>
  );
}
