"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * Counts a number up when it scrolls into view.
 *
 * Accepts the display string straight from content ("4.9", "2,400+", "11") and
 * splits off any prefix/suffix, so the data stays human-readable. The tween
 * writes to the DOM node directly rather than through state, so the React tree
 * does not re-render on every frame.
 *
 * Under reduced motion the final value renders immediately.
 */
export function CountUp({
  value,
  className,
  duration = 1.1,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [done, setDone] = useState(false);

  // "2,400+" -> prefix "", digits "2,400", suffix "+"
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? value;
  const suffix = match?.[3] ?? "";

  const target = Number(digits.replace(/,/g, ""));
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  const grouped = digits.includes(",");

  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    if (!grouped) return fixed;
    return Number(fixed).toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  useEffect(() => {
    if (reduce || done || !inView || Number.isNaN(target)) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = `${prefix}${format(v)}${suffix}`;
      },
      onComplete: () => setDone(true),
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, done, target, duration]);

  // Non-numeric or reduced motion: render as-is.
  if (reduce || Number.isNaN(target)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={cnTabular(className)}>
      {/* Start at zero so there is no flash of the final value */}
      {`${prefix}${format(0)}${suffix}`}
    </span>
  );
}

function cnTabular(className?: string) {
  return ["tabular-nums", className].filter(Boolean).join(" ");
}
