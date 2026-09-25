import { ok, fail, jsonBody, str, num, strList } from "@/lib/api";
import { findPackage, updatePackage, deletePackage } from "@/lib/store/repo";
import type { ItineraryDay, Package } from "@/lib/types";

const REGIONS = ["Darjeeling", "Sikkim", "Dooars", "Kalimpong"];
const TYPES = ["Trekking", "Wildlife", "Cultural", "Leisure", "Homestay"];
const STATUSES = ["published", "draft", "archived"];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pkg = await findPackage(slug);
  return pkg ? ok(pkg) : fail("Package not found", 404);
}

/** Patch a package. Only known fields are accepted, each validated. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const patch: Partial<Package> = {};

  const title = str(body.title);
  if (title) patch.title = title;

  if (typeof body.summary === "string") patch.summary = body.summary.trim();
  if (typeof body.permitNote === "string") patch.permitNote = body.permitNote.trim();
  if (typeof body.heroImage === "string") patch.heroImage = body.heroImage.trim();
  if (typeof body.mapEmbed === "string") patch.mapEmbed = body.mapEmbed.trim();

  const region = str(body.region);
  if (region) {
    if (!REGIONS.includes(region)) return fail(`region must be one of: ${REGIONS.join(", ")}`, 422);
    patch.region = region as Package["region"];
  }

  const type = str(body.type);
  if (type) {
    if (!TYPES.includes(type)) return fail(`type must be one of: ${TYPES.join(", ")}`, 422);
    patch.type = type as Package["type"];
  }

  const status = str(body.status);
  if (status) {
    if (!STATUSES.includes(status)) return fail(`status must be one of: ${STATUSES.join(", ")}`, 422);
    patch.status = status as Package["status"];
  }

  const days = num(body.durationDays, { min: 1, max: 60 });
  if (days !== undefined) patch.durationDays = Math.round(days);

  const nights = num(body.durationNights, { min: 0, max: 60 });
  if (nights !== undefined) patch.durationNights = Math.round(nights);

  const price = num(body.priceFrom, { min: 0, max: 10_000_000 });
  if (price !== undefined) patch.priceFrom = Math.round(price);

  if (typeof body.featured === "boolean") patch.featured = body.featured;

  const gallery = strList(body.gallery);
  if (gallery) patch.gallery = gallery;

  const highlights = strList(body.highlights);
  if (highlights) patch.highlights = highlights;

  const inclusions = strList(body.inclusions);
  if (inclusions) patch.inclusions = inclusions;

  const exclusions = strList(body.exclusions);
  if (exclusions) patch.exclusions = exclusions;

  const reelUrls = strList(body.reelUrls);
  if (reelUrls) patch.reelUrls = reelUrls;

  if (Array.isArray(body.itinerary)) {
    patch.itinerary = (body.itinerary as unknown[])
      .filter((d): d is Record<string, unknown> => typeof d === "object" && d !== null)
      .map((d, i): ItineraryDay => ({
        day: i + 1,
        title: str(d.title) ?? `Day ${i + 1}`,
        description: typeof d.description === "string" ? d.description.trim() : "",
        meals: typeof d.meals === "string" ? d.meals.trim() : "",
        stay: typeof d.stay === "string" ? d.stay.trim() : "",
        images: strList(d.images) ?? [],
      }));
  }

  if (Object.keys(patch).length === 0) return fail("No recognised fields to update", 422);

  const updated = await updatePackage(slug, patch);
  return updated ? ok(updated) : fail("Package not found", 404);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const done = await deletePackage(slug);
  return done ? ok({ slug }) : fail("Package not found", 404);
}
