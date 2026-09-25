import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { TourFilter } from "@/components/sections/TourFilter";
import { Faq } from "@/components/sections/Faq";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { publishedPackages } from "@/data/packages";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "North Bengal tour packages. Treks, wildlife safaris, cultural circuits and homestays across Darjeeling, Sikkim, Dooars and Kalimpong.",
};

export default function ToursPage() {
  return (
    <>
      <PageHero
        title="Find your North Bengal trip"
        intro="Filter by region, style or length. Every itinerary is adjustable, so treat these as strong starting points."
        image="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=82"
      />

      <Section tone="cream">
        <TourFilter packages={publishedPackages()} />
      </Section>

      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            title="Before you book"
            intro="The things worth settling first."
          />
          <Faq />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
