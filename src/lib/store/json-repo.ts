import { randomUUID } from "node:crypto";
import { readDb, mutateDb, type SiteSettings } from "./db";
import { slugify } from "./slug";
import type {
  Package,
  Departure,
  Review,
  BlogPost,
  Inquiry,
  InquiryStatus,
  MediaAsset,
  ItineraryDay,
} from "@/lib/types";

/**
 * Local JSON implementation of the repository, used when Supabase is not
 * configured so the app works on a fresh clone with no setup.
 *
 * Server-only.
 */

const id = () => randomUUID();
const now = () => new Date().toISOString();

/* ------------------------------------------------------------------ reads */

export async function listPackages() {
  return (await readDb()).packages;
}

export async function listPublishedPackages() {
  return (await readDb()).packages.filter((p) => p.status === "published");
}

export async function findPackage(slug: string) {
  return (await readDb()).packages.find((p) => p.slug === slug) ?? null;
}

export async function listReviews() {
  return (await readDb()).reviews;
}

export async function listBlogPosts() {
  return (await readDb()).blogPosts;
}

export async function listInquiries() {
  return (await readDb()).inquiries;
}

export async function listMedia() {
  return (await readDb()).media;
}

export async function getSettings() {
  return (await readDb()).settings;
}

export async function getStats() {
  const db = await readDb();
  return {
    published: db.packages.filter((p) => p.status === "published").length,
    drafts: db.packages.filter((p) => p.status === "draft").length,
    newInquiries: db.inquiries.filter((i) => i.status === "New").length,
    openDepartures: db.packages
      .flatMap((p) => p.departures)
      .filter((d) => d.status === "open").length,
    visibleReviews: db.reviews.filter((r) => r.visible).length,
    posts: db.blogPosts.length,
  };
}

/* --------------------------------------------------------------- packages */

const BLANK_DAY: ItineraryDay = {
  day: 1,
  title: "Arrival and orientation",
  description: "",
  meals: "Dinner",
  stay: "",
  images: [],
};

export async function createPackage(input: { title?: string } = {}) {
  return mutateDb((db) => {
    const title = input.title?.trim() || "Untitled trip";
    const slug = slugify(title, db.packages.map((p) => p.slug));

    const pkg: Package = {
      id: id(),
      slug,
      title,
      region: "Darjeeling",
      type: "Cultural",
      durationDays: 4,
      durationNights: 3,
      priceFrom: 12000,
      heroImage: "",
      gallery: [],
      summary: "",
      highlights: [],
      inclusions: [],
      exclusions: [],
      itinerary: [structuredClone(BLANK_DAY)],
      reelUrls: [],
      featured: false,
      status: "draft",
      departures: [],
    };

    db.packages.unshift(pkg);
    return pkg;
  });
}

export async function updatePackage(slug: string, patch: Partial<Package>) {
  return mutateDb((db) => {
    const i = db.packages.findIndex((p) => p.slug === slug);
    if (i === -1) return null;

    // Slug and id are identity, never patched from the client.
    const { slug: _s, id: _i, ...safe } = patch;
    db.packages[i] = { ...db.packages[i], ...safe };
    return db.packages[i];
  });
}

export async function deletePackage(slug: string) {
  return mutateDb((db) => {
    const i = db.packages.findIndex((p) => p.slug === slug);
    if (i === -1) return false;
    db.packages.splice(i, 1);
    // Detach reviews rather than deleting a traveller's words.
    db.reviews.forEach((r) => {
      if (r.packageSlug === slug) delete r.packageSlug;
    });
    return true;
  });
}

export async function duplicatePackage(slug: string) {
  return mutateDb((db) => {
    const src = db.packages.find((p) => p.slug === slug);
    if (!src) return null;

    const copy: Package = structuredClone(src);
    copy.id = id();
    copy.title = `${src.title} (copy)`;
    copy.slug = slugify(copy.title, db.packages.map((p) => p.slug));
    copy.status = "draft";
    copy.featured = false;
    copy.departures = [];

    db.packages.splice(db.packages.indexOf(src) + 1, 0, copy);
    return copy;
  });
}

/* ------------------------------------------------------------- departures */

export async function createDeparture(
  slug: string,
  input: { date: string; totalSeats: number },
) {
  return mutateDb((db) => {
    const pkg = db.packages.find((p) => p.slug === slug);
    if (!pkg) return null;

    const dep: Departure = {
      id: id(),
      date: input.date,
      totalSeats: Math.max(1, input.totalSeats),
      bookedSeats: 0,
      status: "open",
    };

    pkg.departures.push(dep);
    pkg.departures.sort((a, b) => a.date.localeCompare(b.date));
    return dep;
  });
}

export async function updateDeparture(
  slug: string,
  depId: string,
  patch: Partial<Departure>,
) {
  return mutateDb((db) => {
    const pkg = db.packages.find((p) => p.slug === slug);
    const dep = pkg?.departures.find((d) => d.id === depId);
    if (!pkg || !dep) return null;

    Object.assign(dep, { ...patch, id: dep.id });
    dep.bookedSeats = Math.min(Math.max(0, dep.bookedSeats), dep.totalSeats);
    // Keep status honest against the seat count.
    if (dep.bookedSeats >= dep.totalSeats) dep.status = "sold_out";
    else if (patch.status !== "sold_out") dep.status = "open";
    return dep;
  });
}

export async function deleteDeparture(slug: string, depId: string) {
  return mutateDb((db) => {
    const pkg = db.packages.find((p) => p.slug === slug);
    if (!pkg) return false;
    const i = pkg.departures.findIndex((d) => d.id === depId);
    if (i === -1) return false;
    pkg.departures.splice(i, 1);
    return true;
  });
}

/* ---------------------------------------------------------------- reviews */

export async function createReview(input: Omit<Review, "id">) {
  return mutateDb((db) => {
    const review: Review = { ...input, id: id() };
    db.reviews.unshift(review);
    return review;
  });
}

export async function updateReview(reviewId: string, patch: Partial<Review>) {
  return mutateDb((db) => {
    const r = db.reviews.find((x) => x.id === reviewId);
    if (!r) return null;
    Object.assign(r, { ...patch, id: r.id });
    return r;
  });
}

export async function deleteReview(reviewId: string) {
  return mutateDb((db) => {
    const i = db.reviews.findIndex((r) => r.id === reviewId);
    if (i === -1) return false;
    db.reviews.splice(i, 1);
    return true;
  });
}

/* ------------------------------------------------------------------- blog */

export async function createBlogPost(input: { title?: string } = {}) {
  return mutateDb((db) => {
    const title = input.title?.trim() || "Untitled guide";
    const post: BlogPost = {
      slug: slugify(title, db.blogPosts.map((p) => p.slug)),
      title,
      excerpt: "",
      body: "",
      coverImage: "",
      tag: "Guide",
      publishedAt: "",
      readMinutes: 3,
    };
    db.blogPosts.unshift(post);
    return post;
  });
}

export async function updateBlogPost(slug: string, patch: Partial<BlogPost>) {
  return mutateDb((db) => {
    const i = db.blogPosts.findIndex((p) => p.slug === slug);
    if (i === -1) return null;
    const { slug: _s, ...safe } = patch;
    db.blogPosts[i] = { ...db.blogPosts[i], ...safe };
    return db.blogPosts[i];
  });
}

export async function deleteBlogPost(slug: string) {
  return mutateDb((db) => {
    const i = db.blogPosts.findIndex((p) => p.slug === slug);
    if (i === -1) return false;
    db.blogPosts.splice(i, 1);
    return true;
  });
}

/* -------------------------------------------------------------- inquiries */

export async function createInquiry(
  input: Omit<Inquiry, "id" | "status" | "createdAt">,
) {
  return mutateDb((db) => {
    const inq: Inquiry = {
      ...input,
      id: id(),
      status: "New",
      createdAt: now(),
    };
    db.inquiries.unshift(inq);
    return inq;
  });
}

export async function updateInquiry(
  inquiryId: string,
  patch: { status?: InquiryStatus; notes?: string },
) {
  return mutateDb((db) => {
    const i = db.inquiries.find((x) => x.id === inquiryId);
    if (!i) return null;
    if (patch.status) i.status = patch.status;
    if (patch.notes !== undefined) i.notes = patch.notes;
    return i;
  });
}

export async function deleteInquiry(inquiryId: string) {
  return mutateDb((db) => {
    const i = db.inquiries.findIndex((x) => x.id === inquiryId);
    if (i === -1) return false;
    db.inquiries.splice(i, 1);
    return true;
  });
}

/* ------------------------------------------------------------------ media */

export async function createMedia(
  input: Omit<MediaAsset, "id" | "createdAt">,
) {
  return mutateDb((db) => {
    const asset: MediaAsset = { ...input, id: id(), createdAt: now() };
    db.media.unshift(asset);
    return asset;
  });
}

export async function deleteMedia(assetId: string) {
  return mutateDb((db) => {
    const i = db.media.findIndex((m) => m.id === assetId);
    if (i === -1) return false;
    db.media.splice(i, 1);
    return true;
  });
}

/* --------------------------------------------------------------- settings */

export async function updateSettings(patch: Partial<SiteSettings>) {
  return mutateDb((db) => {
    db.settings = { ...db.settings, ...patch };
    return db.settings;
  });
}
