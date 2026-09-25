import {
  listPublishedPackages,
  listReviews,
  listBlogPosts,
  findPackage,
} from "./repo";
import type { Package, Review, BlogPost, Region } from "@/lib/types";

/**
 * Derived reads for the public site.
 *
 * Composed on top of the repository facade rather than implemented per backend,
 * so there is exactly one definition of "featured" or "published" and both
 * storage backends inherit it.
 *
 * Server-only.
 */

/** Homepage package rail. Falls back to the newest trips if none are featured. */
export async function getFeaturedPackages(limit = 3): Promise<Package[]> {
  const published = await listPublishedPackages();
  const featured = published.filter((p) => p.featured);
  const chosen = featured.length > 0 ? featured : published;
  return chosen.slice(0, limit);
}

/** Every published trip, for listings and filters. */
export async function getPublishedPackages(): Promise<Package[]> {
  return listPublishedPackages();
}

/** A single published trip. Drafts return null so a stale link cannot leak one. */
export async function getPublicPackage(slug: string): Promise<Package | null> {
  const pkg = await findPackage(slug);
  if (!pkg || pkg.status !== "published") return null;
  return pkg;
}

/** Trips in one region, excluding the one being viewed. */
export async function getRelatedPackages(
  slug: string,
  region: Region,
  limit = 3,
): Promise<Package[]> {
  const published = await listPublishedPackages();
  return published.filter((p) => p.slug !== slug && p.region === region).slice(0, limit);
}

/** Trips in a region, for destination pages. */
export async function getPackagesByRegion(region: Region): Promise<Package[]> {
  const published = await listPublishedPackages();
  return published.filter((p) => p.region === region);
}

/** Homepage testimonials: visible and marked featured. */
export async function getFeaturedReviews(limit = 3): Promise<Review[]> {
  const all = await listReviews();
  const visible = all.filter((r) => r.visible);
  const featured = visible.filter((r) => r.featured);
  const chosen = featured.length > 0 ? featured : visible;
  return chosen.slice(0, limit);
}

/** Visible reviews attached to one trip. */
export async function getReviewsForPackage(slug: string): Promise<Review[]> {
  const all = await listReviews();
  return all.filter((r) => r.visible && r.packageSlug === slug);
}

/** Average rating across visible reviews, for the proof band. */
export async function getRatingSummary(): Promise<{ average: string; count: number }> {
  const visible = (await listReviews()).filter((r) => r.visible);
  if (visible.length === 0) return { average: "—", count: 0 };
  const sum = visible.reduce((n, r) => n + r.rating, 0);
  return { average: (sum / visible.length).toFixed(1), count: visible.length };
}

/** Published guides, newest first. Drafts have no publishedAt. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const all = await listBlogPosts();
  return all
    .filter((p) => Boolean(p.publishedAt))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** A single published guide. */
export async function getPublicPost(slug: string): Promise<BlogPost | null> {
  const all = await listBlogPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post || !post.publishedAt) return null;
  return post;
}
