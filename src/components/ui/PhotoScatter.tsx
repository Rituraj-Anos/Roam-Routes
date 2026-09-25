"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

export interface ScatterPhoto {
  src: string;
  alt: string;
  className: string;
  rotate: number;
  /** Parallax depth. Background layers move least, foreground most. */
  depth: number;
}

/**
 * Tilted photo composition with three motion layers:
 *
 *  1. A staggered settle on load, each card rotating into its resting angle.
 *  2. Scroll parallax, per-layer, so the stack has depth as the page moves.
 *  3. A cursor-reactive lean, where nearer layers respond more strongly.
 *
 * Parallax and lean apply only to these decorative layers, never to text or
 * controls. Deltas stay small so foreground and background never visibly
 * desync. Pointer values live in motion values rather than state, so nothing
 * re-renders per frame, and the whole thing degrades to a static composition
 * under reduced motion.
 */
export function PhotoScatter({
  photos,
  className,
  priority,
}: {
  photos: ScatterPhoto[];
  className?: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scroll = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Cursor lean, normalised to -1..1 across the composition.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const leanSpring = { stiffness: 150, damping: 20, restDelta: 0.001 };
  const leanX = useSpring(mx, leanSpring);
  const leanY = useSpring(my, leanSpring);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) || 0);
    my.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) || 0);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {photos.map((p, i) => (
        <ScatterCard
          key={p.src}
          photo={p}
          index={i}
          scroll={scroll}
          leanX={leanX}
          leanY={leanY}
          reduce={Boolean(reduce)}
          priority={priority && i === 0}
        />
      ))}
    </div>
  );
}

function ScatterCard({
  photo,
  index,
  scroll,
  leanX,
  leanY,
  reduce,
  priority,
}: {
  photo: ScatterPhoto;
  index: number;
  scroll: MotionValue<number>;
  leanX: MotionValue<number>;
  leanY: MotionValue<number>;
  reduce: boolean;
  priority?: boolean;
}) {
  // Scroll drift, capped around 30px at the deepest layer.
  const driftY = useTransform(scroll, [0, 1], [photo.depth * 18, photo.depth * -18]);
  // Cursor lean, nearer layers move further.
  const leanPx = useTransform(leanX, (v) => v * photo.depth * 9);
  const leanPy = useTransform(leanY, (v) => v * photo.depth * 7);
  const x = useTransform([leanPx], ([v]) => v as number);
  const y = useTransform([driftY, leanPy], ([a, b]) => (a as number) + (b as number));

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26, rotate: 0, scale: 0.96 }}
      animate={reduce ? undefined : { opacity: 1, y: 0, rotate: photo.rotate, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.1 + index * 0.1, ease: EASE_OUT }}
      style={
        reduce
          ? { rotate: `${photo.rotate}deg` }
          : { x, y, rotate: photo.rotate }
      }
      whileHover={reduce ? undefined : { scale: 1.035, zIndex: 40 }}
      className={cn(
        "absolute overflow-hidden rounded-[var(--radius-xl2)] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55)] ring-1 ring-white/10 will-change-transform",
        photo.className,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 45vw, 24vw"
        className="object-cover"
      />
      {/* Inner edge highlight: light catching a physical print */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl2)] ring-1 ring-inset ring-white/15"
      />
    </motion.div>
  );
}
