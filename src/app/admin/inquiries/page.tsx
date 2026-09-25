import { AdminHeader } from "@/components/admin/AdminShell";
import { InquiryKanban } from "@/components/admin/InquiryKanban";
import { seedInquiries } from "@/data/content";

export default function AdminInquiries() {
  return (
    <>
      <AdminHeader title="Inquiries" subtitle="Move leads through the pipeline. One-click WhatsApp reply on each card." />
      <InquiryKanban initial={seedInquiries} />
    </>
  );
}
