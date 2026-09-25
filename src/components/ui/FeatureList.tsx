import { Sparkles, Compass, BedDouble, Ticket, type LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "./Reveal";
import { cn } from "@/lib/utils";

/**
 * Feature list: thin outline icon, heading, supporting line, separated by hair
 * rules. Icons are never filled, and never emoji.
 */
const icons: LucideIcon[] = [Sparkles, Compass, BedDouble, Ticket];

export function FeatureList({
  items,
  tone = "dark",
}: {
  items: { title: string; text: string }[];
  tone?: "dark" | "light";
}) {
  const rule = tone === "dark" ? "divide-white/10" : "divide-[var(--color-line)]";
  const heading = tone === "dark" ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]";
  const body = tone === "dark" ? "text-white/60" : "text-[var(--color-body)]";
  const ring = tone === "dark" ? "ring-white/15" : "ring-[var(--color-line)]";

  return (
    <RevealGroup className={cn("divide-y", rule)}>
      {items.map((item, i) => {
        const Icon = icons[i % icons.length];
        return (
          <RevealItem key={item.title}>
            <div className="flex gap-4 py-5">
              <span
                className={cn(
                  "mt-0.5 grid size-10 shrink-0 place-items-center rounded-full ring-1",
                  ring,
                  tone === "dark"
                    ? "text-[var(--color-accent-soft)]"
                    : "text-[var(--color-teal-700)]",
                )}
              >
                <Icon className="size-[1.0625rem]" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <h3 className={cn("t-h3", heading)}>{item.title}</h3>
                <p className={cn("t-small mt-1.5 max-w-[30rem]", body)}>{item.text}</p>
              </div>
            </div>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
