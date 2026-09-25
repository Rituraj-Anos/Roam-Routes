/** Domain types — mirror the PRD §8 data model and the Supabase schema. */

export type Region = "Darjeeling" | "Sikkim" | "Dooars" | "Kalimpong";
export type PackageType = "Trekking" | "Wildlife" | "Cultural" | "Leisure" | "Homestay";
export type PackageStatus = "published" | "draft" | "archived";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  stay: string;
  images?: string[];
}

export interface Departure {
  id: string;
  date: string; // ISO
  totalSeats: number;
  bookedSeats: number;
  status: "open" | "sold_out";
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  region: Region;
  type: PackageType;
  durationDays: number;
  durationNights: number;
  priceFrom: number;
  heroImage: string;
  gallery: string[];
  summary: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  reelUrls?: string[];
  mapEmbed?: string;
  featured: boolean;
  status: PackageStatus;
  departures: Departure[];
  permitNote?: string;
}

export interface Destination {
  slug: Lowercase<Region>;
  name: Region;
  tagline: string;
  heroImage: string;
  thumbs: string[];
  overview: string;
  bestSeason: string;
  /** Short label for cards, e.g. "Mar–May, Oct–Nov". */
  bestWindow: string;
  gateway: string;
  /** Month numbers (1–12) at their best. Drives the season calendar. */
  peakMonths: number[];
  /** Month numbers (1–12) we steer travellers away from. */
  avoidMonths: number[];
  altitude: string;
  permitNote?: string;
  advisory?: string;
}

/** Homestay / rural-tourism listing, kept separate from hotel stays. */
export interface Homestay {
  slug: string;
  name: string;
  village: string;
  region: Region;
  image: string;
  blurb: string;
  rooms: number;
  pricePerNight: number;
  altitude: string;
  hostedBy: string;
  experiences: string[];
  /** Package slug this homestay features in, if any. */
  packageSlug?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: "Google" | "Manual";
  packageSlug?: string;
  featured: boolean;
  visible: boolean;
  date: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  tag: string;
  publishedAt: string;
  readMinutes: number;
}

export type InquiryStatus = "New" | "Contacted" | "Confirmed" | "Closed";

export interface Inquiry {
  id: string;
  name: string;
  whatsapp: string;
  travelDates: string;
  pax: number;
  packageSlug?: string;
  message?: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
}

/** An uploaded photo or an attached Instagram reel link. */
export interface MediaAsset {
  id: string;
  url: string;
  type: "photo" | "reel";
  caption?: string;
  /** Package this asset is filed under, if any. */
  packageSlug?: string;
  createdAt: string;
}

export interface TrustStat {
  label: string;
  value: string;
}
