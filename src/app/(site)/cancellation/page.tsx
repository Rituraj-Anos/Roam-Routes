import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation policy",
  description:
    "RoamAndRoutes cancellation and refund terms, including what happens when weather or road closures force a change.",
};

export default function CancellationPage() {
  return (
    <LegalPage
      title="Cancellation policy"
      updated="September 2026"
      intro="Cancel early and you lose very little. Cancel late and we are already committed to hotels, permits and drivers on your behalf."
      sections={[
        {
          heading: "If you cancel",
          paras: [
            "More than 30 days before departure: your advance is refunded in full, less any permit fees already paid to government authorities and any non-refundable deposit a specific property required. We will show you the exact figures.",
            "15 to 30 days before departure: 75 percent of the total is refunded.",
            "7 to 14 days before departure: 50 percent of the total is refunded.",
            "Less than 7 days before departure, or no-show: no refund is available. By this point rooms, safari permits and vehicles are paid for and cannot be released.",
          ],
        },
        {
          heading: "Moving your dates instead",
          paras: [
            "If you need to move rather than cancel, tell us as early as you can. More than 15 days out we will usually move you to another date in the same season at no charge, subject to availability and any difference in cost.",
            "Inside 15 days a date change depends on whether our partners will release the booking, and we will be straight with you about what is possible.",
          ],
        },
        {
          heading: "If we cancel",
          paras: [
            "If we cancel a fixed departure for any reason, including not reaching minimum numbers, you choose: a full refund, or a transfer to another date or trip of equivalent value.",
            "If a trip cannot run safely because of landslides, snow, flooding or a government closure, we will first try to reroute to an equivalent alternative. Where that is genuinely not possible, we refund the portion of your trip that could not be delivered.",
          ],
        },
        {
          heading: "Weather is not a cancellation",
          paras: [
            "We will not refund a trip because the peaks stayed behind cloud, or because it rained. Mountain weather is not something any operator can promise, and honest scheduling advice is the most we can offer, which is why we publish a month-by-month guide and will talk you out of a poor window.",
            "Where an included activity genuinely cannot run, such as a forest zone closed by the department, that element is refunded or substituted.",
          ],
        },
        {
          heading: "Refund timing",
          paras: [
            "Approved refunds are sent back to the original payment method within 7 to 10 working days of agreement. Bank processing can add a few days beyond that.",
            "Amounts paid directly to a homestay host are settled with that household, and we will help you arrange it.",
          ],
        },
        {
          heading: "How to cancel",
          paras: [
            "Message us on WhatsApp or email. We will confirm in writing, with the exact refund figure and the reasoning, before anything is processed.",
          ],
        },
      ]}
    />
  );
}
