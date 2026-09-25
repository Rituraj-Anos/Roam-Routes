import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { listMedia, listPackages } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminMedia() {
  const [assets, packages] = await Promise.all([listMedia(), listPackages()]);
  return (
    <MediaLibrary
      assets={assets}
      packages={packages.map((p) => ({ slug: p.slug, title: p.title }))}
    />
  );
}
