"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One button, used everywhere, so press feel and focus are consistent.
 *
 * Every variant gets:
 *  - press feedback on pointer-down (`.pressable`, scale 0.97 on :active),
 *  - a specified transition (never `transition: all`),
 *  - a visible, branded focus ring from globals.css.
 *
 * `whatsapp` is a first-class variant because it is the product's core action.
 */
type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "pressable inline-flex select-none items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold tracking-[-0.01em] transition-[background-color,color,box-shadow,opacity] duration-[180ms] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-teal-800)] text-[var(--color-cream)] hover:bg-[var(--color-teal-700)] shadow-sm",
  secondary:
    "bg-[var(--color-cream)] text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-line)] hover:bg-white",
  ghost:
    "bg-transparent text-current ring-1 ring-inset ring-current/20 hover:ring-current/40",
  whatsapp: "bg-[#1faa53] text-white hover:bg-[#1c9c4d] shadow-sm",
  danger: "bg-red-500/90 text-white hover:bg-red-500",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[0.8125rem]",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-[0.9375rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** As a real <button>. */
export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  { variant = "primary", size = "md", loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});

/** As a Next link (internal) or anchor (external). */
export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string; external?: boolean }) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
