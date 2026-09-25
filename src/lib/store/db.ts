import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  Package,
  Review,
  BlogPost,
  Inquiry,
  Homestay,
  MediaAsset,
} from "@/lib/types";
import { packages as seedPackages } from "@/data/packages";
import { reviews as seedReviews, blogPosts as seedPosts, seedInquiries } from "@/data/content";
import { homestays as seedHomestays } from "@/data/homestays";

/**
 * Local JSON store.
 *
 * The admin needs to actually persist changes. Rather than leaving every editor
 * as a dead form until Supabase is provisioned, writes land in a JSON file on
 * disk during development. The shape mirrors the Supabase schema, so switching
 * backends is a swap inside `repo.ts` and nothing else changes.
 *
 * Server-only: this module touches the filesystem and must never be imported
 * into a client component.
 */

export interface SiteSettings {
  whatsapp: string;
  email: string;
  base: string;
  hours: string;
  instagram: string;
  facebook: string;
  youtube: string;
  roadStatus: string;
  seoTitle: string;
}

export interface Database {
  packages: Package[];
  reviews: Review[];
  blogPosts: BlogPost[];
  inquiries: Inquiry[];
  homestays: Homestay[];
  media: MediaAsset[];
  settings: SiteSettings;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "store.json");

function seed(): Database {
  return {
    packages: structuredClone(seedPackages),
    reviews: structuredClone(seedReviews),
    blogPosts: structuredClone(seedPosts),
    inquiries: structuredClone(seedInquiries),
    homestays: structuredClone(seedHomestays),
    media: [],
    settings: {
      whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919000000000",
      email: "hello@roamandroutes.in",
      base: "Siliguri, West Bengal",
      hours: "Every day, 8am to 9pm IST",
      instagram: "https://instagram.com/roamandroutes",
      facebook: "https://facebook.com/roamandroutes",
      youtube: "https://youtube.com/@roamandroutes",
      roadStatus: "Hill roads clear as of season start. Monsoon advisory June to September.",
      seoTitle: "RoamAndRoutes · North Bengal, up close",
    },
  };
}

/**
 * Serialises writes. Concurrent admin requests would otherwise interleave a
 * read-modify-write and silently drop one of the edits.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  // Keep the chain alive even if a task rejects.
  queue = run.catch(() => undefined);
  return run;
}

async function readRaw(): Promise<Database> {
  try {
    const text = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(text) as Partial<Database>;
    // Merge against the seed so a store written by an older build still loads.
    const base = seed();
    return { ...base, ...parsed, settings: { ...base.settings, ...parsed.settings } };
  } catch {
    const fresh = seed();
    await writeRaw(fresh);
    return fresh;
  }
}

async function writeRaw(db: Database): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Write to a temp file then rename, so a crash mid-write cannot truncate the store.
  const tmp = `${DB_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

/** Read the whole database. */
export function readDb(): Promise<Database> {
  return enqueue(readRaw);
}

/** Read-modify-write under the serialising queue. */
export function mutateDb<T>(
  mutator: (db: Database) => T | Promise<T>,
): Promise<T> {
  return enqueue(async () => {
    const db = await readRaw();
    const result = await mutator(db);
    await writeRaw(db);
    return result;
  });
}

/** Reset the store back to seed content. Useful in development. */
export function resetDb(): Promise<Database> {
  return enqueue(async () => {
    const fresh = seed();
    await writeRaw(fresh);
    return fresh;
  });
}
