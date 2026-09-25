import { ReviewManager } from "@/components/admin/ReviewManager";
import { listReviews, listPackages } from "@/lib/store/repo";

export const dynamic = "force-dynamic";

export default async function AdminReviews() {
  const [reviews, packages] = await Promise.all([listReviews(), listPackages()]);
  return (
    <ReviewManager
      reviews={reviews}
      packages={packages.map((p) => ({ slug: p.slug, title: p.title }))}
    />
  );
}
