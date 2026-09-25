"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, DUR, STAGGER } from "@/lib/motion";

/**
 * Scroll reveal.
 *
 * Animates the full `transform` string rather than Framer's `y` shorthand —
 * the shorthand runs on the main thread and drops frames under load, while a
 * full transform string is hardware accelerated.
 *
 * Under reduced motion this renders the final state immediately; comprehension
 * is never gated behind movement.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 16,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: `translate3d(0,${distance}px,0)` }}
      whileInView={{ opacity: 1, transform: "translate3d(0,0,0)" }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: DUR.reveal, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered container. Pair with RevealItem children. */
export function RevealGroup({
  children,
  className,
  stagger = STAGGER,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-48px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  distance = 14,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, transform: `translate3d(0,${distance}px,0)` },
        show: {
          opacity: 1,
          transform: "translate3d(0,0,0)",
          transition: { duration: DUR.reveal, ease: EASE_OUT },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word headline reveal. Kept to headline length only — splitting long
 * paragraphs balloons the DOM and hurts screen readers.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((w, i) => (
        // The word gap is a right margin, not a text space: a space placed
        // inside an overflow-hidden inline-block gets clipped away, which
        // silently runs words together.
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ marginRight: i < words.length - 1 ? "0.26em" : undefined }}
        >
          <motion.span
            className="inline-block will-change-transform"
            aria-hidden
            variants={{
              hidden: { transform: "translate3d(0,105%,0)" },
              show: {
                transform: "translate3d(0,0,0)",
                transition: { duration: 0.62, ease: EASE_OUT },
              },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
