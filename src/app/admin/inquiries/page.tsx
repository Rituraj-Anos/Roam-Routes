import { AdminHeader } from "@/components/admin/AdminShell";
import { InquiryKanban } from "@/components/admin/InquiryKanban";
import { listInquiries, listPackages } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminInquiries() {
  const [inquiries, packages] = await Promise.all([listInquiries(), listPackages()]);

  return (
    <>
      <AdminHeader
        title="Inquiries"
        subtitle={`${inquiries.filter((i) => i.status === "New").length} new · move leads through the pipeline, reply on WhatsApp in one tap.`}
      />
      <InquiryKanban
        initial={inquiries}
        packages={packages.map((p) => ({ slug: p.slug, title: p.title }))}
      />
    </>
  );
}
