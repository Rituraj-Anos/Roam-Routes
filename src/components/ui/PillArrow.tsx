"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Signature "Pill-Arrow" CTA: a pill label fused with a circular arrow button,
 * colour-flipped by section.
 *
 * Motion, in layers:
 *  - Press feedback on pointer-down via `:active`, never on release.
 *  - A magnetic pull toward the cursor, driven by motion values through springs
 *    so nothing re-renders per frame. The arrow leans further than the pill,
 *    which hints the direction of travel.
 *  - Springs are critically damped by default; the pull is small (max ~6px) so
 *    it reads as responsiveness rather than a gimmick.
 *
 * All of it is skipped under reduced motion and on coarse pointers.
 */
type Variant = "onLight" | "onDark" | "outline";

const variants: Record<Variant, string> = {
  onLight: "bg-[var(--color-teal-800)] text-[var(--color-cream)]",
  onDark: "bg-[var(--color-cream)] text-[var(--color-ink)]",
  outline:
    "bg-transparent text-[var(--color-cream)] ring-1 ring-inset ring-white/25",
};

const PULL = 6;

export function PillArrow({
  label,
  href,
  variant = "onLight",
  external,
  className,
  size = "md",
}: {
  label: string;
  href: string;
  variant?: Variant;
  external?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 260, damping: 22, restDelta: 0.001 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // The arrow trails further than the pill, telegraphing direction.
  const ax = useTransform(sx, (v) => v * 1.9);
  const ay = useTransform(sy, (v) => v * 1.9);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    px.set(Math.max(-1, Math.min(1, dx)) * PULL);
    py.set(Math.max(-1, Math.min(1, dy)) * PULL);
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const skin = variants[variant];
  const pad = size === "sm" ? "px-4 py-2.5 text-[0.8125rem]" : "px-5 py-3 text-sm";
  const dot = size === "sm" ? "size-9" : "size-11";

  const inner = (
    <>
      <motion.span
        style={reduce ? undefined : { x: sx, y: sy }}
        className={cn(
          "inline-flex items-center rounded-[var(--radius-pill)] font-medium tracking-[-0.01em]",
          pad,
          skin,
        )}
      >
        {label}
      </motion.span>
      <motion.span
        style={reduce ? undefined : { x: ax, y: ay }}
        className={cn(
          "grid place-items-center rounded-full transition-transform duration-[240ms] ease-[var(--ease-out)] group-hover:rotate-45",
          dot,
          skin,
        )}
        aria-hidden
      >
        <ArrowUpRight
          className={size === "sm" ? "size-4" : "size-[1.125rem]"}
          strokeWidth={1.75}
        />
      </motion.span>
    </>
  );

  const classes = cn(
    "pressable group inline-flex items-center gap-1.5 align-middle",
    className,
  );

  const handlers = {
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    onPointerDown: onLeave,
  };

  return (
    <span ref={ref} className="inline-flex" {...handlers}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={classes}>
          {inner}
        </Link>
      )}
    </span>
  );
}
