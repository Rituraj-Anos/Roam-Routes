import type {
  Package,
  ItineraryDay,
  Departure,
  Review,
  BlogPost,
  Inquiry,
  MediaAsset,
} from "@/lib/types";
import type { SiteSettings } from "./db";

/**
 * Row mappers between Postgres (snake_case, jsonb) and the app's domain types
 * (camelCase). Kept in one place so a column rename is a single edit.
 */

type Row = Record<string, unknown>;

const list = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

const text = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

const int = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/* ------------------------------------------------------------ itinerary */

export const rowToDay = (r: Row): ItineraryDay => ({
  day: int(r.day_number, 1),
  title: text(r.title),
  description: text(r.description),
  meals: text(r.meals),
  stay: text(r.stay),
  images: list(r.images),
});

export const dayToRow = (slug: string, d: ItineraryDay): Row => ({
  package_slug: slug,
  day_number: d.day,
  title: d.title,
  description: d.description,
  meals: d.meals,
  stay: d.stay,
  images: d.images ?? [],
});

/* ----------------------------------------------------------- departures */

export const rowToDeparture = (r: Row): Departure => ({
  id: text(r.id),
  date: text(r.date),
  totalSeats: int(r.total_seats),
  bookedSeats: int(r.booked_seats),
  status: r.status === "sold_out" ? "sold_out" : "open",
});

/* ------------------------------------------------------------- packages */

/** Packages are stored flat; itinerary and departures arrive as joined rows. */
export const rowToPackage = (
  r: Row,
  days: ItineraryDay[] = [],
  departures: Departure[] = [],
): Package => ({
  id: text(r.id),
  slug: text(r.slug),
  title: text(r.title),
  region: text(r.region, "Darjeeling") as Package["region"],
  type: text(r.type, "Cultural") as Package["type"],
  durationDays: int(r.duration_days, 1),
  durationNights: int(r.duration_nights),
  priceFrom: int(r.price_from),
  heroImage: text(r.hero_image),
  gallery: list(r.gallery),
  summary: text(r.summary),
  highlights: list(r.highlights),
  inclusions: list(r.inclusions),
  exclusions: list(r.exclusions),
  reelUrls: list(r.reel_urls),
  mapEmbed: text(r.map_embed) || undefined,
  permitNote: text(r.permit_note) || undefined,
  featured: r.featured === true,
  status: text(r.status, "draft") as Package["status"],
  itinerary: [...days].sort((a, b) => a.day - b.day),
  departures: [...departures].sort((a, b) => a.date.localeCompare(b.date)),
});

/** Only the columns the packages table owns; relations are written separately. */
export const packageToRow = (p: Partial<Package>): Row => {
  const row: Row = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.region !== undefined) row.region = p.region;
  if (p.type !== undefined) row.type = p.type;
  if (p.durationDays !== undefined) row.duration_days = p.durationDays;
  if (p.durationNights !== undefined) row.duration_nights = p.durationNights;
  if (p.priceFrom !== undefined) row.price_from = p.priceFrom;
  if (p.heroImage !== undefined) row.hero_image = p.heroImage;
  if (p.gallery !== undefined) row.gallery = p.gallery;
  if (p.summary !== undefined) row.summary = p.summary;
  if (p.highlights !== undefined) row.highlights = p.highlights;
  if (p.inclusions !== undefined) row.inclusions = p.inclusions;
  if (p.exclusions !== undefined) row.exclusions = p.exclusions;
  if (p.reelUrls !== undefined) row.reel_urls = p.reelUrls;
  if (p.mapEmbed !== undefined) row.map_embed = p.mapEmbed;
  if (p.permitNote !== undefined) row.permit_note = p.permitNote;
  if (p.featured !== undefined) row.featured = p.featured;
  if (p.status !== undefined) row.status = p.status;
  return row;
};

/* -------------------------------------------------------------- reviews */

export const rowToReview = (r: Row): Review => ({
  id: text(r.id),
  author: text(r.author),
  rating: int(r.rating, 5),
  text: text(r.text),
  source: r.source === "Google" ? "Google" : "Manual",
  packageSlug: text(r.package_slug) || undefined,
  featured: r.featured === true,
  visible: r.visible !== false,
  date: text(r.created_at).slice(0, 10),
});

export const reviewToRow = (r: Partial<Review>): Row => {
  const row: Row = {};
  if (r.author !== undefined) row.author = r.author;
  if (r.rating !== undefined) row.rating = r.rating;
  if (r.text !== undefined) row.text = r.text;
  if (r.source !== undefined) row.source = r.source;
  if (r.packageSlug !== undefined) row.package_slug = r.packageSlug ?? null;
  if (r.featured !== undefined) row.featured = r.featured;
  if (r.visible !== undefined) row.visible = r.visible;
  return row;
};

/* ----------------------------------------------------------- blog posts */

export const rowToPost = (r: Row): BlogPost => ({
  slug: text(r.slug),
  title: text(r.title),
  excerpt: text(r.excerpt),
  body: text(r.body),
  coverImage: text(r.cover_image),
  tag: text(r.tag, "Guide"),
  publishedAt: text(r.published_at),
  readMinutes: int(r.read_minutes, 3),
});

export const postToRow = (p: Partial<BlogPost>): Row => {
  const row: Row = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.excerpt !== undefined) row.excerpt = p.excerpt;
  if (p.body !== undefined) row.body = p.body;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.tag !== undefined) row.tag = p.tag;
  if (p.readMinutes !== undefined) row.read_minutes = p.readMinutes;
  if (p.publishedAt !== undefined) {
    row.published_at = p.publishedAt ? p.publishedAt : null;
  }
  return row;
};

/* ------------------------------------------------------------ inquiries */

export const rowToInquiry = (r: Row): Inquiry => ({
  id: text(r.id),
  name: text(r.name),
  whatsapp: text(r.whatsapp),
  travelDates: text(r.travel_dates),
  pax: int(r.pax, 1),
  packageSlug: text(r.package_slug) || undefined,
  message: text(r.message) || undefined,
  status: text(r.status, "New") as Inquiry["status"],
  notes: text(r.notes) || undefined,
  createdAt: text(r.created_at),
});

/* ---------------------------------------------------------------- media */

export const rowToMedia = (r: Row): MediaAsset => ({
  id: text(r.id),
  url: text(r.url),
  type: r.type === "reel" ? "reel" : "photo",
  caption: text(r.caption) || undefined,
  packageSlug: text(r.package_slug) || undefined,
  createdAt: text(r.created_at),
});

/* ------------------------------------------------------------- settings */

export const rowToSettings = (r: Row): SiteSettings => {
  const social = (r.social_links ?? {}) as Record<string, unknown>;
  const seo = (r.seo_defaults ?? {}) as Record<string, unknown>;
  return {
    whatsapp: text(r.whatsapp_number, "919000000000"),
    email: text(r.contact_email, "hello@roamandroutes.in"),
    base: text(social.base, "Siliguri, West Bengal"),
    hours: text(social.hours, "Every day, 8am to 9pm IST"),
    instagram: text(social.instagram),
    facebook: text(social.facebook),
    youtube: text(social.youtube),
    roadStatus: text(r.road_status_note),
    seoTitle: text(seo.title, "RoamAndRoutes · North Bengal, up close"),
  };
};

/**
 * Settings are stored across a few columns plus two jsonb blobs. Callers patch
 * partially, so the current row is merged in before writing.
 */
export const settingsToRow = (
  patch: Partial<SiteSettings>,
  current: SiteSettings,
): Row => {
  const merged = { ...current, ...patch };
  return {
    id: 1,
    whatsapp_number: merged.whatsapp,
    contact_email: merged.email,
    road_status_note: merged.roadStatus,
    social_links: {
      instagram: merged.instagram,
      facebook: merged.facebook,
      youtube: merged.youtube,
      base: merged.base,
      hours: merged.hours,
    },
    seo_defaults: { title: merged.seoTitle },
  };
};
