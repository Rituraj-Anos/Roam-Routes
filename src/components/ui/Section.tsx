import { cn } from "@/lib/utils";

/**
 * Section shell. `tone` drives the dark → light → dark rhythm.
 *
 * Vertical rhythm is generous and consistent; spacing uses rem so it scales
 * with the reader's text-size preference instead of breaking.
 */
type Tone = "dark" | "deep" | "light" | "cream";

const tones: Record<Tone, string> = {
  dark: "bg-[var(--color-ink)] text-[var(--color-cream)]",
  deep: "bg-[var(--color-teal-950)] text-[var(--color-cream)]",
  light: "bg-[var(--color-paper)] text-[var(--color-ink)]",
  cream: "bg-[var(--color-cream)] text-[var(--color-ink)]",
};

/**
 * `size` controls vertical rhythm. Bands that hold a single row of content use
 * `band` so they don't read as an empty stripe between two real sections.
 */
const sizes = {
  full: "py-20 sm:py-24 lg:py-28",
  band: "py-10 sm:py-12",
  flush: "py-0",
} as const;

export function Section({
  tone = "cream",
  className,
  children,
  id,
  size = "full",
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  id?: string;
  size?: keyof typeof sizes;
}) {
  return (
    <section id={id} className={cn("w-full", tones[tone], className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", sizes[size])}>
        {children}
      </div>
    </section>
  );
}

/**
 * Section heading. One focused message, stacked vertically and capped at a
 * readable measure.
 *
 * `eyebrow` is deliberately opt-in and used sparingly — a small-caps label above
 * every single heading is a template tell, not hierarchy.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-white/60" : "text-[var(--color-body)]";

  return (
    <div
      className={cn(
        "max-w-[34rem]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-3 block text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
            tone === "dark"
              ? "text-[var(--color-accent-soft)]"
              : "text-[var(--color-accent)]",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="t-h2 text-balance">{title}</h2>
      {intro && <p className={cn("t-body mt-4 text-pretty", muted)}>{intro}</p>}
    </div>
  );
}
