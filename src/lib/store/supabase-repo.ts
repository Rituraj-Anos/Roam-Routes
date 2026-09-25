import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
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
import type { SiteSettings } from "./db";
import { slugify } from "./slug";
import {
  rowToPackage,
  packageToRow,
  rowToDay,
  dayToRow,
  rowToDeparture,
  rowToReview,
  reviewToRow,
  rowToPost,
  postToRow,
  rowToInquiry,
  rowToMedia,
  rowToSettings,
  settingsToRow,
} from "./map";

/**
 * Supabase implementation of the repository.
 *
 * Uses the service-role client, so it bypasses RLS by design — these functions
 * only ever run on the server behind the admin middleware, and the public site
 * reads through the same trusted path. Nothing here is reachable from a browser.
 *
 * Errors are thrown rather than swallowed: a failed admin save must surface to
 * the user, not silently no-op.
 */

type Row = Record<string, unknown>;

function db(): SupabaseClient {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Supabase is not configured");
  return client;
}

function must<T>(data: T | null, error: { message: string } | null, what: string): T {
  if (error) throw new Error(`${what}: ${error.message}`);
  if (data === null) throw new Error(`${what}: no data returned`);
  return data;
}

/* ------------------------------------------------------------ assembling */

/** Packages need their itinerary and departures stitched in. */
async function hydrate(rows: Row[]): Promise<Package[]> {
  if (rows.length === 0) return [];
  const slugs = rows.map((r) => String(r.slug));

  const [daysRes, depsRes] = await Promise.all([
    db().from("itinerary_days").select("*").in("package_slug", slugs),
    db().from("departures").select("*").in("package_slug", slugs),
  ]);

  if (daysRes.error) throw new Error(`Loading itineraries: ${daysRes.error.message}`);
  if (depsRes.error) throw new Error(`Loading departures: ${depsRes.error.message}`);

  const daysBySlug = new Map<string, ItineraryDay[]>();
  for (const d of daysRes.data ?? []) {
    const key = String((d as Row).package_slug);
    if (!daysBySlug.has(key)) daysBySlug.set(key, []);
    daysBySlug.get(key)!.push(rowToDay(d as Row));
  }

  const depsBySlug = new Map<string, Departure[]>();
  for (const d of depsRes.data ?? []) {
    const key = String((d as Row).package_slug);
    if (!depsBySlug.has(key)) depsBySlug.set(key, []);
    depsBySlug.get(key)!.push(rowToDeparture(d as Row));
  }

  return rows.map((r) =>
    rowToPackage(
      r,
      daysBySlug.get(String(r.slug)) ?? [],
      depsBySlug.get(String(r.slug)) ?? [],
    ),
  );
}

/* ----------------------------------------------------------------- reads */

export async function listPackages(): Promise<Package[]> {
  const { data, error } = await db()
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });
  return hydrate(must(data, error, "Loading packages") as Row[]);
}

export async function listPublishedPackages(): Promise<Package[]> {
  const { data, error } = await db()
    .from("packages")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return hydrate(must(data, error, "Loading packages") as Row[]);
}

export async function findPackage(slug: string): Promise<Package | null> {
  const { data, error } = await db()
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Loading package: ${error.message}`);
  if (!data) return null;
  const [pkg] = await hydrate([data as Row]);
  return pkg ?? null;
}

export async function listReviews(): Promise<Review[]> {
  const { data, error } = await db()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  return (must(data, error, "Loading reviews") as Row[]).map(rowToReview);
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await db()
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: true });
  return (must(data, error, "Loading posts") as Row[]).map(rowToPost);
}

export async function listInquiries(): Promise<Inquiry[]> {
  const { data, error } = await db()
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  return (must(data, error, "Loading inquiries") as Row[]).map(rowToInquiry);
}

export async function listMedia(): Promise<MediaAsset[]> {
  const { data, error } = await db()
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  return (must(data, error, "Loading media") as Row[]).map(rowToMedia);
}

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await db()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(`Loading settings: ${error.message}`);
  return rowToSettings((data ?? {}) as Row);
}

export async function getStats() {
  const [pkgs, inquiries, reviews, posts, deps] = await Promise.all([
    db().from("packages").select("status"),
    db().from("inquiries").select("status"),
    db().from("reviews").select("visible"),
    db().from("blog_posts").select("id"),
    db().from("departures").select("status"),
  ]);

  const packages = (pkgs.data ?? []) as Row[];
  return {
    published: packages.filter((p) => p.status === "published").length,
    drafts: packages.filter((p) => p.status === "draft").length,
    newInquiries: ((inquiries.data ?? []) as Row[]).filter((i) => i.status === "New").length,
    openDepartures: ((deps.data ?? []) as Row[]).filter((d) => d.status === "open").length,
    visibleReviews: ((reviews.data ?? []) as Row[]).filter((r) => r.visible !== false).length,
    posts: (posts.data ?? []).length,
  };
}

/* -------------------------------------------------------------- packages */

async function takenSlugs(table: "packages" | "blog_posts"): Promise<string[]> {
  const { data } = await db().from(table).select("slug");
  return ((data ?? []) as Row[]).map((r) => String(r.slug));
}

export async function createPackage(input: { title?: string } = {}): Promise<Package> {
  const title = input.title?.trim() || "Untitled trip";
  const slug = slugify(title, await takenSlugs("packages"));

  const { data, error } = await db()
    .from("packages")
    .insert({
      slug,
      title,
      region: "Darjeeling",
      type: "Cultural",
      duration_days: 4,
      duration_nights: 3,
      price_from: 12000,
      status: "draft",
      featured: false,
      gallery: [],
      highlights: [],
      inclusions: [],
      exclusions: [],
      reel_urls: [],
    })
    .select("*")
    .single();

  const row = must(data, error, "Creating package") as Row;

  await db()
    .from("itinerary_days")
    .insert(
      dayToRow(slug, {
        day: 1,
        title: "Arrival and orientation",
        description: "",
        meals: "Dinner",
        stay: "",
        images: [],
      }),
    );

  const [pkg] = await hydrate([row]);
  return pkg;
}

export async function updatePackage(
  slug: string,
  patch: Partial<Package>,
): Promise<Package | null> {
  const row = packageToRow(patch);

  if (Object.keys(row).length > 0) {
    const { error } = await db().from("packages").update(row).eq("slug", slug);
    if (error) throw new Error(`Saving package: ${error.message}`);
  }

  // Itinerary is replaced wholesale: day numbering is positional, so a diff
  // would be more fragile than a clean rewrite.
  if (patch.itinerary) {
    const del = await db().from("itinerary_days").delete().eq("package_slug", slug);
    if (del.error) throw new Error(`Clearing itinerary: ${del.error.message}`);

    if (patch.itinerary.length > 0) {
      const ins = await db()
        .from("itinerary_days")
        .insert(patch.itinerary.map((d, i) => dayToRow(slug, { ...d, day: i + 1 })));
      if (ins.error) throw new Error(`Saving itinerary: ${ins.error.message}`);
    }
  }

  return findPackage(slug);
}

export async function deletePackage(slug: string): Promise<boolean> {
  // Detach reviews rather than destroying a traveller's words.
  await db().from("reviews").update({ package_slug: null }).eq("package_slug", slug);
  await db().from("itinerary_days").delete().eq("package_slug", slug);
  await db().from("departures").delete().eq("package_slug", slug);

  const { error, count } = await db()
    .from("packages")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) throw new Error(`Deleting package: ${error.message}`);
  return (count ?? 0) > 0;
}

export async function duplicatePackage(slug: string): Promise<Package | null> {
  const src = await findPackage(slug);
  if (!src) return null;

  const title = `${src.title} (copy)`;
  const newSlug = slugify(title, await takenSlugs("packages"));

  const { data, error } = await db()
    .from("packages")
    .insert({
      ...packageToRow({ ...src, title, status: "draft", featured: false }),
      slug: newSlug,
    })
    .select("*")
    .single();

  const row = must(data, error, "Duplicating package") as Row;

  if (src.itinerary.length > 0) {
    await db()
      .from("itinerary_days")
      .insert(src.itinerary.map((d) => dayToRow(newSlug, d)));
  }

  const [pkg] = await hydrate([row]);
  return pkg;
}

/* ------------------------------------------------------------ departures */

export async function createDeparture(
  slug: string,
  input: { date: string; totalSeats: number },
): Promise<Departure | null> {
  const pkg = await findPackage(slug);
  if (!pkg) return null;

  const { data, error } = await db()
    .from("departures")
    .insert({
      package_slug: slug,
      date: input.date,
      total_seats: Math.max(1, input.totalSeats),
      booked_seats: 0,
      status: "open",
    })
    .select("*")
    .single();

  return rowToDeparture(must(data, error, "Adding departure") as Row);
}

export async function updateDeparture(
  slug: string,
  depId: string,
  patch: Partial<Departure>,
): Promise<Departure | null> {
  const { data: existing } = await db()
    .from("departures")
    .select("*")
    .eq("id", depId)
    .eq("package_slug", slug)
    .maybeSingle();
  if (!existing) return null;

  const current = rowToDeparture(existing as Row);
  const total = patch.totalSeats ?? current.totalSeats;
  const booked = Math.min(Math.max(0, patch.bookedSeats ?? current.bookedSeats), total);
  const status =
    booked >= total ? "sold_out" : (patch.status ?? current.status) === "sold_out" && patch.status === "sold_out" ? "sold_out" : "open";

  const { data, error } = await db()
    .from("departures")
    .update({
      date: patch.date ?? current.date,
      total_seats: total,
      booked_seats: booked,
      status,
    })
    .eq("id", depId)
    .select("*")
    .single();

  return rowToDeparture(must(data, error, "Updating departure") as Row);
}

export async function deleteDeparture(slug: string, depId: string): Promise<boolean> {
  const { error, count } = await db()
    .from("departures")
    .delete({ count: "exact" })
    .eq("id", depId)
    .eq("package_slug", slug);
  if (error) throw new Error(`Removing departure: ${error.message}`);
  return (count ?? 0) > 0;
}

/* --------------------------------------------------------------- reviews */

export async function createReview(input: Omit<Review, "id">): Promise<Review> {
  const { data, error } = await db()
    .from("reviews")
    .insert(reviewToRow(input))
    .select("*")
    .single();
  return rowToReview(must(data, error, "Adding review") as Row);
}

export async function updateReview(
  reviewId: string,
  patch: Partial<Review>,
): Promise<Review | null> {
  const { data, error } = await db()
    .from("reviews")
    .update(reviewToRow(patch))
    .eq("id", reviewId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Updating review: ${error.message}`);
  return data ? rowToReview(data as Row) : null;
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  const { error, count } = await db()
    .from("reviews")
    .delete({ count: "exact" })
    .eq("id", reviewId);
  if (error) throw new Error(`Deleting review: ${error.message}`);
  return (count ?? 0) > 0;
}

/* ------------------------------------------------------------------ blog */

export async function createBlogPost(input: { title?: string } = {}): Promise<BlogPost> {
  const title = input.title?.trim() || "Untitled guide";
  const slug = slugify(title, await takenSlugs("blog_posts"));

  const { data, error } = await db()
    .from("blog_posts")
    .insert({ slug, title, tag: "Guide", read_minutes: 3, published_at: null })
    .select("*")
    .single();

  return rowToPost(must(data, error, "Creating post") as Row);
}

export async function updateBlogPost(
  slug: string,
  patch: Partial<BlogPost>,
): Promise<BlogPost | null> {
  const { data, error } = await db()
    .from("blog_posts")
    .update(postToRow(patch))
    .eq("slug", slug)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Saving post: ${error.message}`);
  return data ? rowToPost(data as Row) : null;
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const { error, count } = await db()
    .from("blog_posts")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) throw new Error(`Deleting post: ${error.message}`);
  return (count ?? 0) > 0;
}

/* ------------------------------------------------------------- inquiries */

export async function createInquiry(
  input: Omit<Inquiry, "id" | "status" | "createdAt">,
): Promise<Inquiry> {
  const { data, error } = await db()
    .from("inquiries")
    .insert({
      name: input.name,
      whatsapp: input.whatsapp,
      travel_dates: input.travelDates,
      pax: input.pax,
      package_slug: input.packageSlug ?? null,
      message: input.message ?? null,
      status: "New",
    })
    .select("*")
    .single();

  return rowToInquiry(must(data, error, "Saving inquiry") as Row);
}

export async function updateInquiry(
  inquiryId: string,
  patch: { status?: InquiryStatus; notes?: string },
): Promise<Inquiry | null> {
  const row: Row = {};
  if (patch.status) row.status = patch.status;
  if (patch.notes !== undefined) row.notes = patch.notes;

  const { data, error } = await db()
    .from("inquiries")
    .update(row)
    .eq("id", inquiryId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Updating inquiry: ${error.message}`);
  return data ? rowToInquiry(data as Row) : null;
}

export async function deleteInquiry(inquiryId: string): Promise<boolean> {
  const { error, count } = await db()
    .from("inquiries")
    .delete({ count: "exact" })
    .eq("id", inquiryId);
  if (error) throw new Error(`Deleting inquiry: ${error.message}`);
  return (count ?? 0) > 0;
}

/* ----------------------------------------------------------------- media */

export async function createMedia(
  input: Omit<MediaAsset, "id" | "createdAt">,
): Promise<MediaAsset> {
  const { data, error } = await db()
    .from("media_assets")
    .insert({
      url: input.url,
      type: input.type,
      caption: input.caption ?? null,
      package_slug: input.packageSlug ?? null,
    })
    .select("*")
    .single();

  return rowToMedia(must(data, error, "Saving asset") as Row);
}

export async function deleteMedia(assetId: string): Promise<boolean> {
  const { error, count } = await db()
    .from("media_assets")
    .delete({ count: "exact" })
    .eq("id", assetId);
  if (error) throw new Error(`Deleting asset: ${error.message}`);
  return (count ?? 0) > 0;
}

/* -------------------------------------------------------------- settings */

export async function updateSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await getSettings();
  const { data, error } = await db()
    .from("site_settings")
    .upsert(settingsToRow(patch, current), { onConflict: "id" })
    .select("*")
    .single();

  return rowToSettings(must(data, error, "Saving settings") as Row);
}
