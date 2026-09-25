import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ok, fail, jsonBody, str } from "@/lib/api";
import { listMedia, createMedia } from "@/lib/store/repo";

export async function GET() {
  return ok(await listMedia());
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/**
 * Accepts either a file upload (multipart) or a reel/photo URL (JSON).
 *
 * Uploads are written under `public/uploads` so they are immediately servable
 * in development. Swapping to Cloudflare R2 means replacing the write below with
 * an R2 put and storing the returned CDN URL — the rest of the flow is unchanged.
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";

  /* ---- URL attachment (photo or Instagram reel) ---- */
  if (contentType.includes("application/json")) {
    const body = await jsonBody(req);
    if (!body) return fail("Invalid JSON body", 422);

    const url = str(body.url);
    if (!url) return fail("A URL is required", 422);
    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error("protocol");
    } catch {
      return fail("That is not a valid http(s) URL", 422);
    }

    const type = str(body.type) === "reel" ? "reel" : "photo";
    if (type === "reel" && !/instagram\.com/i.test(url)) {
      return fail("Reel links should be Instagram URLs", 422);
    }

    const asset = await createMedia({
      url,
      type,
      caption: str(body.caption),
      packageSlug: str(body.packageSlug),
    });
    return ok(asset, 201);
  }

  /* ---- File upload ---- */
  if (!contentType.includes("multipart/form-data")) {
    return fail("Send multipart/form-data to upload, or JSON to attach a URL", 415);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Could not read the upload", 422);
  }

  const file = form.get("file");
  if (!(file instanceof File)) return fail("No file was included", 422);
  if (file.size === 0) return fail("That file is empty", 422);
  if (file.size > MAX_BYTES) return fail("Images must be under 8 MB", 413);
  if (!ALLOWED.has(file.type)) {
    return fail("Only JPG, PNG, WebP or AVIF images are allowed", 415);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${randomUUID()}.${EXT[file.type]}`;
  const dir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), bytes);
  } catch {
    return fail("Could not save the file on the server", 500);
  }

  const asset = await createMedia({
    url: `/uploads/${name}`,
    type: "photo",
    caption: str(form.get("caption")),
    packageSlug: str(form.get("packageSlug")),
  });

  return ok(asset, 201);
}
