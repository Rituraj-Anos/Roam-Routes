import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PackageEditor } from "@/components/admin/PackageEditor";
import { findPackage } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminPackageEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await findPackage(slug);
  if (!pkg) notFound();

  return (
    <>
      <Link
        href="/admin/packages"
        className="pressable mb-5 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden /> All packages
      </Link>
      <PackageEditor pkg={pkg} />
    </>
  );
}
