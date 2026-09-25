"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  StickyNote,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Inquiry, InquiryStatus, Package } from "@/lib/types";
import { ConfirmDialog } from "./ConfirmDialog";
import { api, withToast } from "@/lib/client-api";
import { waLink, cn } from "@/lib/utils";
import { EASE_OUT, DUR } from "@/lib/motion";
import { site } from "@/lib/site";

/**
 * Lead pipeline: New → Contacted → Confirmed → Closed.
 *
 * Status moves persist immediately and are applied optimistically, so the card
 * animates to its new column without waiting on the round trip. A failure rolls
 * the card back and says why.
 */
const COLUMNS: InquiryStatus[] = ["New", "Contacted", "Confirmed", "Closed"];
const order = (s: InquiryStatus) => COLUMNS.indexOf(s);

export function InquiryKanban({
  initial,
  packages,
}: {
  initial: Inquiry[];
  packages: Pick<Package, "slug" | "title">[];
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [, startTransition] = useTransition();
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Inquiry | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const move = async (inq: Inquiry, dir: 1 | -1) => {
    const next = COLUMNS[Math.min(COLUMNS.length - 1, Math.max(0, order(inq.status) + dir))];
    if (next === inq.status) return;

    const previous = items;
    setItems((list) => list.map((i) => (i.id === inq.id ? { ...i, status: next } : i)));

    try {
      await api(`/api/admin/inquiries/${inq.id}`, {
        method: "PATCH",
        json: { status: next },
      });
      startTransition(() => router.refresh());
    } catch (e) {
      setItems(previous);
      const { toast } = await import("sonner");
      toast.error(e instanceof Error ? e.message : "Could not move that lead");
    }
  };

  const saveNote = async (inq: Inquiry) => {
    setBusy(inq.id);
    const done = await withToast(
      () =>
        api(`/api/admin/inquiries/${inq.id}`, {
          method: "PATCH",
          json: { notes: noteText },
        }),
      { loading: "Saving note", success: "Note saved" },
    );
    setBusy(null);
    if (done) {
      setItems((list) =>
        list.map((i) => (i.id === inq.id ? { ...i, notes: noteText } : i)),
      );
      setNoteFor(null);
      startTransition(() => router.refresh());
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(toDelete.id);
    const done = await withToast(
      () => api(`/api/admin/inquiries/${toDelete.id}`, { method: "DELETE" }),
      { loading: "Deleting", success: "Lead deleted" },
    );
    setBusy(null);
    if (done) {
      setItems((list) => list.filter((i) => i.id !== toDelete.id));
      startTransition(() => router.refresh());
    }
    setToDelete(null);
  };

  const field =
    "w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-[var(--color-cream)] outline-none focus:border-[var(--color-teal-600)]";

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const cards = items.filter((i) => i.status === col);
          return (
            <section
              key={col}
              aria-label={col}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-3"
            >
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="font-display text-sm font-semibold">{col}</h2>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs tabular-nums text-white/50">
                  {cards.length}
                </span>
              </header>

              <ul className="space-y-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  {cards.map((i) => {
                    const pkg = packages.find((p) => p.slug === i.packageSlug);
                    const rowBusy = busy === i.id;
                    const editing = noteFor === i.id;

                    return (
                      <motion.li
                        key={i.id}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                        transition={{ duration: DUR.base, ease: EASE_OUT }}
                        className={cn(
                          "rounded-xl border border-white/10 bg-[var(--color-ink)] p-3.5",
                          rowBusy && "pointer-events-none opacity-50",
                        )}
                      >
                        <p className="text-sm font-semibold">{i.name}</p>
                        <p className="mt-0.5 text-xs text-white/40">
                          {i.travelDates || "Dates open"} · {i.pax} pax
                        </p>
                        {pkg && (
                          <p className="mt-2 text-xs text-[var(--color-accent-soft)]">
                            {pkg.title}
                          </p>
                        )}
                        {i.message && (
                          <p className="mt-2 line-clamp-3 text-xs text-white/50">{i.message}</p>
                        )}

                        {editing ? (
                          <div className="mt-2.5">
                            <textarea
                              rows={2}
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Internal note"
                              aria-label={`Note for ${i.name}`}
                              className={field}
                            />
                            <div className="mt-1.5 flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => saveNote(i)}
                                className="pressable inline-flex items-center gap-1 rounded-md bg-[var(--color-teal-800)] px-2.5 py-1.5 text-xs font-semibold"
                              >
                                {rowBusy ? (
                                  <Loader2 className="size-3 animate-spin" aria-hidden />
                                ) : (
                                  <Check className="size-3" aria-hidden />
                                )}
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setNoteFor(null)}
                                className="pressable rounded-md px-2.5 py-1.5 text-xs text-white/50 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          i.notes && (
                            <button
                              type="button"
                              onClick={() => {
                                setNoteFor(i.id);
                                setNoteText(i.notes ?? "");
                              }}
                              className="mt-2 flex w-full gap-1.5 rounded-lg bg-white/5 p-2 text-left text-xs text-white/60 hover:bg-white/8"
                            >
                              <StickyNote
                                className="mt-0.5 size-3 shrink-0 text-white/40"
                                aria-hidden
                              />
                              {i.notes}
                            </button>
                          )
                        )}

                        <div className="mt-3 flex items-center gap-1 border-t border-white/5 pt-3">
                          <a
                            href={waLink(
                              i.whatsapp,
                              `Hi ${i.name.split(" ")[0]}, thanks for your enquiry with ${site.name}. `,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pressable inline-flex items-center gap-1.5 rounded-lg bg-[#1faa53]/15 px-2.5 py-1.5 text-xs font-medium text-[#3ddc79]"
                          >
                            <SiWhatsapp className="size-3" aria-hidden /> Reply
                          </a>

                          {!editing && !i.notes && (
                            <button
                              type="button"
                              onClick={() => {
                                setNoteFor(i.id);
                                setNoteText("");
                              }}
                              aria-label="Add note"
                              title="Add note"
                              className="pressable grid size-8 place-items-center rounded-md text-white/40 hover:bg-white/5 hover:text-white"
                            >
                              <StickyNote className="size-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setToDelete(i)}
                            aria-label={`Delete lead from ${i.name}`}
                            title="Delete lead"
                            className="pressable grid size-8 place-items-center rounded-md text-white/40 hover:bg-red-500/20 hover:text-red-300"
                          >
                            <Trash2 className="size-3.5" />
                          </button>

                          <div className="ml-auto flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => move(i, -1)}
                              disabled={order(i.status) === 0}
                              aria-label={`Move ${i.name} back a stage`}
                              className="grid size-8 place-items-center rounded-md text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-25"
                            >
                              <ChevronLeft className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => move(i, 1)}
                              disabled={order(i.status) === COLUMNS.length - 1}
                              aria-label={`Move ${i.name} forward a stage`}
                              className="grid size-8 place-items-center rounded-md text-white/40 hover:bg-white/5 hover:text-white disabled:opacity-25"
                            >
                              <ChevronRight className="size-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>

              {cards.length === 0 && (
                <p className="px-1 py-6 text-center text-xs text-white/30">No leads here</p>
              )}
            </section>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete the lead from ${toDelete?.name}?`}
        body="This permanently removes the enquiry and your notes on it. Consider moving it to Closed instead."
        confirmLabel="Delete lead"
        busy={busy === toDelete?.id}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
