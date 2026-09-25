import Image from "next/image";
import { SiWhatsapp } from "react-icons/si";
import { PillArrow } from "@/components/ui/PillArrow";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { waLink } from "@/lib/utils";

/**
 * Closing CTA band. Full-width photographic section that breaks the
 * image-and-text split rhythm rather than repeating it a third time.
 */
export function ClosingCta({
  title = "Start with a message, not a form",
  body = "Tell us your dates and who is travelling. You will get a real reply from the person who will plan your trip.",
  context,
}: {
  title?: string;
  body?: string;
  context?: string;
}) {
  const message = context
    ? `Hi ${site.name}, I'm interested in ${context}.`
    : `Hi ${site.name}, I'd like to plan a North Bengal trip.`;

  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-ink)]">
      <Image
        src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=82"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/85 via-[var(--color-ink)]/70 to-[var(--color-ink)]/90"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="t-h2 text-balance text-[var(--color-cream)]">{title}</h2>
          <p className="t-body-lg mt-4 text-pretty text-white/70">{body}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <PillArrow label="Book a Trip" href="/contact" variant="onDark" />
            <a
              href={waLink(site.whatsapp, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-[#1faa53] px-5 py-3 text-sm font-semibold text-white"
            >
              <SiWhatsapp className="size-[1.0625rem]" aria-hidden />
              WhatsApp us
            </a>
          </div>

          <p className="t-small mt-6 text-white/45">
            {site.hours} · Based in {site.base}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
