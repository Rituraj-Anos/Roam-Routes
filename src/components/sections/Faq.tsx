"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * FAQ. Answers the questions people actually send on WhatsApp, which also
 * earns the long-tail search traffic competitors leave on the table.
 */
const faqs = [
  {
    q: "Do I need a permit for Sikkim?",
    a: "Indian citizens do not need a permit for Sikkim generally, but Tsomgo (Changu) Lake, Nathula Pass and North Sikkim each require a protected-area permit arranged in advance through a registered operator. We file these for you. Foreign nationals face different rules and Nathula is usually not permitted, so tell us your nationality early.",
  },
  {
    q: "Which airport and station should I book?",
    a: "Bagdogra (IXB) is the airport for all four regions, and New Jalpaiguri (NJP) is the railhead. From either, Darjeeling and Kalimpong are around 3 hours, Gangtok 4 to 5 hours, and the Dooars about 2 hours by road. Book arrivals before midday so you reach the hills in daylight.",
  },
  {
    q: "Is the monsoon really a bad time to come?",
    a: "It depends on the region. The Dooars closes its core forest zones roughly mid-June to mid-September, so safaris genuinely cannot run. The hills stay open but cloud cover hides the peaks and landslides can delay road transfers. If your dates are fixed in July or August we will tell you honestly what you will and will not see.",
  },
  {
    q: "How fit do I need to be for Sandakphu?",
    a: "It is a moderate trek rather than a technical one, but you are walking several hours a day and topping out at 3,636 m. If you can manage a brisk hour of walking on a slope without difficulty you will be fine. We build in an acclimatisation night and brief you on gear before you travel.",
  },
  {
    q: "Can you customise a package?",
    a: "Yes, and most of our trips end up adjusted. Extra nights, a different stay, skipping a viewpoint, adding a homestay. Send us the itinerary you like and tell us what to change.",
  },
  {
    q: "How do payments work?",
    a: "An advance confirms your rooms, permits and safari slots, with the balance due before departure. Homestay room rates are paid directly to the host family. We will put the full breakdown in writing before you pay anything.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;

        return (
          <li key={f.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-start gap-4 py-5 text-left"
            >
              <span className="font-display flex-1 text-[1.0625rem] font-semibold tracking-[-0.015em]">
                {f.q}
              </span>
              <Plus
                aria-hidden
                strokeWidth={1.75}
                className={cn(
                  "mt-0.5 size-5 shrink-0 text-[var(--color-teal-700)] transition-transform duration-[240ms] ease-[var(--ease-out)]",
                  isOpen && "rotate-45",
                )}
              />
            </button>

            <div id={panelId} className="accordion-panel" data-open={isOpen}>
              <div>
                <p className="t-body max-w-[46rem] pb-6 pr-8 text-[var(--color-body)]">
                  {f.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
