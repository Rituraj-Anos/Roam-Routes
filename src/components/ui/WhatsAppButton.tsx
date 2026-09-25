"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import { site } from "@/lib/site";
import { waLink } from "@/lib/utils";
import { SPRING_UI, EASE_OUT } from "@/lib/motion";

/**
 * Sticky WhatsApp entry point, present on every public page.
 *
 * Uses the Simple Icons brand glyph rather than a hand-drawn path. Collapses to
 * a circle on scroll so it stops competing with page content, and expands on
 * hover — the label is always available to assistive tech.
 */
export function WhatsAppButton({ context }: { context?: string }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 700);
    return () => clearTimeout(t);
  }, []);

  const message = context
    ? `Hi ${site.name}, I'm interested in ${context}.`
    : `Hi ${site.name}, I'd like to plan a North Bengal trip.`;

  return (
    <AnimatePresence>
      {mounted && (
        <motion.a
          href={waLink(site.whatsapp, message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0,16px,0) scale(0.92)" }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translate3d(0,0,0) scale(1)" }}
          exit={{ opacity: 0 }}
          transition={reduce ? { duration: 0.2, ease: EASE_OUT } : SPRING_UI}
          className="pressable group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-[var(--radius-pill)] bg-[#1faa53] py-3.5 pl-4 pr-4 text-sm font-semibold text-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.45)] sm:pr-5"
        >
          <SiWhatsapp className="size-[1.125rem] shrink-0" aria-hidden />
          <span className="hidden sm:inline">WhatsApp us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
