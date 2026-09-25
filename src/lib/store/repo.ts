/**
 * Repository facade.
 *
 * Picks a storage backend once, at module load, based on whether Supabase
 * credentials are present:
 *
 *   - Supabase configured  -> the real database. Survives deploys.
 *   - Not configured       -> a local JSON file, so the app and admin are fully
 *                             usable on a fresh clone with no setup.
 *
 * Every caller imports from here, so swapping backends never touches UI code.
 * Server-only: both backends read the filesystem or a service-role key.
 */
import * as jsonRepo from "./json-repo";
import * as supabaseRepo from "./supabase-repo";

const useSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const backend = useSupabase ? supabaseRepo : jsonRepo;

/** Which backend is live. Surfaced in the admin so the state is never a guess. */
export const storageBackend: "supabase" | "local-json" = useSupabase
  ? "supabase"
  : "local-json";

export const {
  listPackages,
  listPublishedPackages,
  findPackage,
  listReviews,
  listBlogPosts,
  listInquiries,
  listMedia,
  getSettings,
  getStats,
  createPackage,
  updatePackage,
  deletePackage,
  duplicatePackage,
  createDeparture,
  updateDeparture,
  deleteDeparture,
  createReview,
  updateReview,
  deleteReview,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  createMedia,
  deleteMedia,
  updateSettings,
} = backend;

export { slugify } from "./slug";
