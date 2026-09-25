import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms RoamAndRoutes operates under: what we commit to, what we need from you, and where responsibility sits.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="September 2026"
      intro="The short version: we will plan and run your trip honestly, and we need you to give us accurate information and travel sensibly."
      sections={[
        {
          heading: "Booking and payment",
          paras: [
            "A trip is confirmed when we have received your advance and sent you written confirmation. Until then, dates, rooms and safari slots are not held for you.",
            "We send a full price breakdown before you pay anything, showing what is included and what is not. The balance is due before departure, on the date stated in your confirmation.",
            "Homestay room rates are usually paid directly to the host family on arrival. We will tell you clearly which parts of your trip work that way.",
          ],
        },
        {
          heading: "Prices",
          paras: [
            "Quoted prices hold for the dates and group size in your confirmation. If the group size changes, the per-person price will usually change with it, and we will requote before anything is committed.",
            "Prices can move for reasons outside our control, such as a change in government permit fees or fuel costs. If that happens before you have paid, we will tell you and requote. Once you are confirmed and paid, we absorb the difference.",
          ],
        },
        {
          heading: "Permits and eligibility",
          paras: [
            "Some areas require protected-area permits, which are issued by government authorities and not by us. We prepare and file the paperwork, but we cannot guarantee an outcome we do not control.",
            "You are responsible for telling us your nationality accurately and early. Rules differ for Indian citizens and foreign nationals, and Nathula Pass is generally not open to foreign nationals. Giving us wrong information here can invalidate a permit on the day.",
            "You are responsible for carrying valid photo ID matching the details on your permit.",
          ],
        },
        {
          heading: "Weather, roads and changes",
          paras: [
            "These are mountains. Landslides, snow and closures happen, and safety comes first. If a route becomes unsafe or a pass closes, we will reroute to the best available alternative at no extra cost to you.",
            "Where a closure means a genuinely included element cannot run at all and cannot be substituted, we refund the cost of that element. We cannot refund weather itself: a cloudy morning at a viewpoint is not a service failure.",
            "We may make small itinerary changes for safety or logistics. Anything material, we will discuss with you first.",
          ],
        },
        {
          heading: "Your responsibilities",
          paras: [
            "Tell us about medical conditions, dietary needs and mobility limits before you book, not on arrival. Some of our trips reach high altitude and a few involve multi-day walking, and we need to know you can do them safely.",
            "Travel insurance is your responsibility and we strongly recommend it, particularly for trekking itineraries. It is not included in any of our prices.",
            "We ask you to treat hosts, guides, drivers and the environment with respect. We reserve the right to end a trip, without refund, in cases of behaviour that endangers or seriously disrupts others.",
          ],
        },
        {
          heading: "Liability",
          paras: [
            "We are responsible for arranging your trip with reasonable care and for the services we provide directly.",
            "Adventure travel carries inherent risk, particularly at altitude and in wildlife areas. We are not liable for loss or injury arising from risks inherent to the activity, from your own actions against guidance given, or from events outside our reasonable control.",
            "Nothing in these terms limits liability where the law does not allow it to be limited.",
          ],
        },
        {
          heading: "Governing law",
          paras: [
            "These terms are governed by Indian law, and disputes fall to the courts of West Bengal.",
          ],
        },
      ]}
    />
  );
}
