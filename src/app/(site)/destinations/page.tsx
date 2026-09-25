import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SeasonCalendar } from "@/components/sections/SeasonCalendar";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { DestinationSpotlight } from "@/components/cards/DestinationSpotlight";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Darjeeling, Sikkim, Dooars and Kalimpong. Four North Bengal regions, each with its own season, permits and character.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        title="Four regions of North Bengal"
        intro="Each has its own best season, permit rules and gateway. Most good trips combine two of them."
        image={destinations[1].heroImage}
      />

      <Section tone="cream">
        <RevealGroup className="grid gap-5 sm:grid-cols-2">
          {destinations.map((dest) => (
            <RevealItem key={dest.slug} className="min-h-[19rem]">
              <DestinationSpotlight dest={dest} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <Section tone="light">
        <SectionHeading
          title="Which month suits which region"
          intro="The same trip can be superb in October and pointless in July. Plan against this before you book flights."
        />
        <div className="mt-12">
          <SeasonCalendar />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
