import { MessageSquare, Map, FileCheck, Plane } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

/**
 * Four-step process. A numbered sequence rather than four identical cards, with
 * a connecting rule that makes the order read as a path.
 */
const steps = [
  {
    icon: MessageSquare,
    title: "Tell us your dates",
    text: "A WhatsApp message is enough. Rough dates, how many of you, and what you want out of the trip.",
  },
  {
    icon: Map,
    title: "We draft the route",
    text: "A day-by-day plan with real stays named, sent back usually within a few hours.",
  },
  {
    icon: FileCheck,
    title: "Permits and bookings",
    text: "We file Tsomgo, Nathula and North Sikkim permits, and hold your rooms and safari slots.",
  },
  {
    icon: Plane,
    title: "You travel, we stay on call",
    text: "Airport pickup onward, with the same person reachable on WhatsApp throughout the trip.",
  },
];

export function HowItWorks() {
  return (
    <RevealGroup className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {/* Connecting rule, desktop only */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-line)] to-transparent lg:block"
      />

      {steps.map((s, i) => (
        <RevealItem key={s.title} className="relative">
          <div className="flex items-center gap-3">
            <span className="relative z-10 grid size-10 place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-teal-800)] ring-1 ring-[var(--color-line)]">
              <s.icon className="size-[1.125rem]" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="font-display text-[0.8125rem] font-semibold tabular-nums text-[var(--color-body-soft)]">
              0{i + 1}
            </span>
          </div>
          <h3 className="t-h3 mt-4">{s.title}</h3>
          <p className="t-small mt-2 max-w-[18rem] text-[var(--color-body)]">{s.text}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
