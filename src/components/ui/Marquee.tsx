import {
  Car,
  Route,
  Mountain,
  Home,
  FileCheck,
  Binoculars,
  Leaf,
} from "lucide-react";

/**
 * Service marquee.
 *
 * Uses thin outline icons rather than emoji: emoji render inconsistently across
 * platforms, carry their own colour that fights the palette, and read as
 * placeholder. Constant motion uses linear timing; hovering pauses it so the
 * text is actually readable, and it holds still under reduced motion.
 */
const items = [
  { icon: Car, label: "Airport & rail transfers" },
  { icon: Route, label: "Custom itineraries" },
  { icon: Mountain, label: "Himalayan treks" },
  { icon: Binoculars, label: "Dooars jeep safaris" },
  { icon: Home, label: "Village homestays" },
  { icon: FileCheck, label: "Permit assistance" },
  { icon: Leaf, label: "Tea estate stays" },
];

export function Marquee() {
  const strip = [...items, ...items];

  return (
    <div className="marquee-host marquee-mask relative w-full overflow-hidden border-y border-[var(--color-line-dark)] bg-[var(--color-teal-950)] py-3.5">
      <ul className="flex w-max animate-marquee items-center">
        {strip.map((item, i) => (
          <li
            key={i}
            className="flex shrink-0 items-center gap-2.5 px-5"
            aria-hidden={i >= items.length}
          >
            <item.icon
              className="size-4 shrink-0 text-[var(--color-accent-soft)]"
              strokeWidth={1.5}
            />
            <span className="whitespace-nowrap text-[0.8125rem] font-medium tracking-[0.01em] text-[var(--color-cream)]/85">
              {item.label}
            </span>
            <span
              className="ml-3 size-1 rounded-full bg-white/25"
              aria-hidden
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
