"use client";

import { useState } from "react";
import { MessageCircle, ChevronRight, ChevronLeft, StickyNote } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/types";
import { site } from "@/lib/site";
import { waLink } from "@/lib/utils";
import { getPackage } from "@/data/packages";

/**
 * Inquiry kanban (PRD §7 Booking/Inquiry Manager) — New → Contacted →
 * Confirmed → Closed. Local-state moves; wire to Supabase update to persist.
 */
const columns: InquiryStatus[] = ["New", "Contacted", "Confirmed", "Closed"];
const order = (s: InquiryStatus) => columns.indexOf(s);

export function InquiryKanban({ initial }: { initial: Inquiry[] }) {
  const [items, setItems] = useState(initial);

  const move = (id: string, dir: 1 | -1) => {
    setItems((list) =>
      list.map((i) => {
        if (i.id !== id) return i;
        const next = Math.min(columns.length - 1, Math.max(0, order(i.status) + dir));
        return { ...i, status: columns[next] };
      }),
    );
    // TODO: await supabase.from('inquiries').update({ status }).eq('id', id)
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((col) => {
        const cards = items.filter((i) => i.status === col);
        return (
          <div key={col} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-display text-sm font-semibold">{col}</h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/50">{cards.length}</span>
            </div>
            <div className="space-y-3">
              {cards.map((i) => {
                const pkg = i.packageSlug ? getPackage(i.packageSlug) : null;
                const waMsg = `Hi ${i.name.split(" ")[0]}, thanks for your enquiry with ${site.name}! `;
                return (
                  <div key={i.id} className="rounded-xl border border-white/10 bg-[var(--color-ink)] p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{i.name}</p>
                        <p className="text-xs text-white/40">{i.travelDates} · {i.pax} pax</p>
                      </div>
                    </div>
                    {pkg && <p className="mt-2 text-xs text-[var(--color-amber)]">{pkg.title}</p>}
                    {i.message && <p className="mt-2 line-clamp-2 text-xs text-white/50">{i.message}</p>}
                    {i.notes && (
                      <p className="mt-2 flex gap-1.5 rounded-lg bg-white/5 p-2 text-xs text-white/60">
                        <StickyNote className="mt-0.5 size-3 shrink-0 text-white/40" aria-hidden />
                        {i.notes}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                      <a
                        href={waLink(i.whatsapp, waMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/15 px-2.5 py-1.5 text-xs font-medium text-[#25D366]"
                      >
                        <MessageCircle className="size-3.5" /> Reply
                      </a>
                      <div className="flex items-center gap-1">
                        <button onClick={() => move(i.id, -1)} disabled={order(i.status) === 0} className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Move left">
                          <ChevronLeft className="size-4" />
                        </button>
                        <button onClick={() => move(i.id, 1)} disabled={order(i.status) === columns.length - 1} className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-30" aria-label="Move right">
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {cards.length === 0 && <p className="px-1 py-6 text-center text-xs text-white/30">No leads here</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
