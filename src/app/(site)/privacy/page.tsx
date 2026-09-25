import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What RoamAndRoutes collects when you enquire, why we need it, and how long we keep it.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="September 2026"
      intro="We collect the least we can get away with, use it only to plan your trip, and never sell it."
      sections={[
        {
          heading: "What we collect",
          paras: [
            "When you send an enquiry we collect your name, WhatsApp number, rough travel dates, the number of travellers, and anything else you choose to tell us. That is it. We do not ask for your address, date of birth or identity documents at the enquiry stage.",
            "If you go on to book, we will need the details required for permits and stays, such as full names as they appear on ID and nationality. We ask for those only once a booking is going ahead, and we tell you why each one is needed.",
          ],
        },
        {
          heading: "Why we need it",
          paras: [
            "Your contact details let us reply. Your dates and group size let us check availability and quote accurately. Permit applications for Tsomgo Lake, Nathula Pass and North Sikkim are filed with government authorities and legally require identity details, so if your trip includes those areas we have to pass them on.",
          ],
        },
        {
          heading: "Who sees it",
          paras: [
            "Our own team, and only the specific partners your trip requires: the hotels or homestays you are staying in, your transport operator, and the permit authority where applicable. Each one receives only what it needs.",
            "We use a small number of service providers to run the business, including email delivery and website hosting. They process data on our behalf and are not permitted to use it for anything else.",
            "We do not sell your data, share it with advertisers, or add you to marketing lists you did not ask for.",
          ],
        },
        {
          heading: "How long we keep it",
          paras: [
            "Enquiries that do not become bookings are deleted within twelve months. Booking records are kept for as long as we are required to for tax and accounting purposes, then deleted.",
          ],
        },
        {
          heading: "WhatsApp and Instagram",
          paras: [
            "Most conversations happen on WhatsApp, which is operated by Meta under its own privacy terms. The message content is between you and us, but Meta handles the delivery. If you would rather not use WhatsApp, email works just as well.",
            "Reels embedded on trip pages are served by Instagram. Opening one takes you to Instagram, where their terms apply.",
          ],
        },
        {
          heading: "Your choices",
          paras: [
            "You can ask us what we hold about you, ask for a correction, or ask us to delete it. Email us and we will action it, usually within a few days. Deleting data tied to an active booking may mean we can no longer run that booking, and we will tell you if that is the case before doing anything.",
          ],
        },
      ]}
    />
  );
}
