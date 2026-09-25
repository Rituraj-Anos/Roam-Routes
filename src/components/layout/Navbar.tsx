"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { PillArrow } from "@/components/ui/PillArrow";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { EASE_OUT, DUR } from "@/lib/motion";

/**
 * Site header.
 *
 * Scroll state comes from Motion's `useScroll` rather than a raw
 * `window.addEventListener("scroll")` — the listener fires on every scroll
 * frame with no batching and is a known jank source.
 *
 * The bar is a translucent material layer that content scrolls *under*, with a
 * soft scroll edge instead of a hard 1px divider.
 */
export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== lifted) setLifted(next);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-[240ms] ease-[var(--ease-out)]",
        lifted ? "material-dark scroll-edge" : "bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8"
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-[var(--radius-pill)] px-3.5 py-2 text-sm transition-colors duration-[180ms]",
                    active
                      ? "text-[var(--color-cream)]"
                      : "text-white/65 hover:text-[var(--color-cream)]",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-[var(--radius-pill)] bg-white/10"
                      transition={{ duration: DUR.base, ease: EASE_OUT }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <PillArrow label="Book a Trip" href="/contact" variant="onDark" size="sm" />
        </div>

        <button
          className="pressable -mr-1 grid size-10 place-items-center rounded-full text-[var(--color-cream)] md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0,-8px,0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translate3d(0,0,0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0,-8px,0)" }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
            className="fixed inset-0 z-50 bg-[var(--color-ink)] md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-3.5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="pressable grid size-10 place-items-center rounded-full text-[var(--color-cream)]"
              >
                <X className="size-5" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-col px-5 pt-8">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, transform: "translate3d(0,12px,0)" }}
                  animate={reduce ? undefined : { opacity: 1, transform: "translate3d(0,0,0)" }}
                  transition={{ duration: DUR.slow, delay: 0.04 * i, ease: EASE_OUT }}
                  className="border-b border-white/8"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display block py-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-cream)]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-8">
                <PillArrow label="Book a Trip" href="/contact" variant="onDark" />
              </div>

              <p className="mt-8 text-[0.8125rem] leading-relaxed text-white/45">
                {site.tagline}. Based in Siliguri, on WhatsApp daily 8am to 9pm.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
