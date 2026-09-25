"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { EASE_OUT } from "@/lib/motion";

/**
 * Confirmation dialog for genuinely destructive, irreversible actions only.
 * Using it for routine work trains people to click through without reading.
 *
 * Accessibility: focus moves to the cancel button on open (the safe default),
 * Escape closes, focus is trapped inside the panel while open, and the
 * underlying page is marked inert via a scrim that blocks pointer events.
 *
 * Motion: the panel scales from 0.96 rather than 0, and the scrim fades in step
 * with it so the two read as one surface. A modal is the one popover that stays
 * centred, so `transform-origin` stays at center.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  busy,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            onClick={onCancel}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-body"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e1417] p-6 shadow-2xl"
          >
            <span className="grid size-10 place-items-center rounded-full bg-red-500/15 text-red-300">
              <AlertTriangle className="size-5" strokeWidth={1.75} aria-hidden />
            </span>

            <h2
              id="confirm-title"
              className="font-display mt-4 text-[1.0625rem] font-semibold text-[var(--color-cream)]"
            >
              {title}
            </h2>
            <p id="confirm-body" className="mt-2 text-sm leading-relaxed text-white/60">
              {body}
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="pressable rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 ring-1 ring-white/12 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="pressable rounded-xl bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {busy ? "Working" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
