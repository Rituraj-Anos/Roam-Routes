"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Reading-progress bar pinned to the top of the viewport.
 *
 * Driven by `useScroll` and smoothed with a spring, so it tracks continuously
 * rather than snapping between values. It animates `scaleX` only, which stays
 * on the compositor. Hidden under reduced motion since it is a continuously
 * moving element and carries no information the page doesn't already give.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[var(--color-accent)]"
    />
  );
}
