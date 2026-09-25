import { cn } from "@/lib/utils";

/**
 * Small status pill. `scarcity` is styled with the one accent colour and should
 * only ever reflect real, current data (seats actually left).
 */
type Tone = "neutral" | "onPhoto" | "scarcity" | "success" | "muted";

const tones: Record<Tone, string> = {
  neutral:
    "bg-[var(--color-cream)] text-[var(--color-ink)] ring-1 ring-inset ring-[var(--color-line)]",
  onPhoto: "bg-black/45 text-white backdrop-blur-md",
  scarcity: "bg-[var(--color-accent)] text-white",
  success: "bg-emerald-500/15 text-emerald-700",
  muted: "bg-white/10 text-white/60",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[0.75rem] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
