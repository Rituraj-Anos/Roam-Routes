import { PackageList } from "@/components/admin/PackageList";
import { listPackages } from "@/lib/store/repo";

// Admin always reads live data, never a cached snapshot.
export const dynamic = "force-dynamic";

export default async function AdminPackages() {
  const packages = await listPackages();
  return <PackageList packages={packages} />;
}
