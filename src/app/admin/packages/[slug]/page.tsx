import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { PackageEditor } from "@/components/admin/PackageEditor";
import { packages, getPackage } from "@/data/packages";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export default async function AdminPackageEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  return (
    <>
      <Link href="/admin/packages" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="size-4" /> Back to packages
      </Link>
      <AdminHeader title={pkg.title} subtitle="Edit package details, itinerary, pricing and status." />
      <PackageEditor pkg={pkg} />
    </>
  );
}
