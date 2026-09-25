"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Editorial image with two layered effects:
 *
 *  1. A clip-path wipe on first scroll into view, so the photograph arrives as
 *     a material rather than fading in from nothing.
 *  2. A slow vertical drift tied to scroll position, applied to the image
 *     *inside* an overflow-hidden frame. The image is deliberately taller than
 *     its frame so the drift never exposes an edge.
 *
 * Both are skipped under reduced motion, which renders the final framed state.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  strength = 24,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Peak drift in px, applied symmetrically. Keep it small. */
  strength?: number;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });
  const y = useTransform(smooth, [0, 1], [-strength, strength]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? false : { clipPath: "inset(14% 8% 14% 8% round 1.75rem)" }}
      whileInView={
        reduce ? undefined : { clipPath: "inset(0% 0% 0% 0% round 1.75rem)" }
      }
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Oversized so the drift cannot reveal a gap */}
      <motion.div
        className="absolute -inset-y-[6%] inset-x-0"
        style={reduce ? undefined : { y }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
