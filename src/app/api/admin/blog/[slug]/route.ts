import { ok, fail, jsonBody, str, num } from "@/lib/api";
import { updateBlogPost, deleteBlogPost } from "@/lib/store/repo";
import type { BlogPost } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const patch: Partial<BlogPost> = {};

  const title = str(body.title);
  if (title) patch.title = title;

  for (const key of ["excerpt", "body", "coverImage", "tag"] as const) {
    if (typeof body[key] === "string") patch[key] = (body[key] as string).trim();
  }

  const mins = num(body.readMinutes, { min: 1, max: 60 });
  if (mins !== undefined) patch.readMinutes = Math.round(mins);

  // `published` toggles the timestamp, which is what the public site filters on.
  if (typeof body.published === "boolean") {
    patch.publishedAt = body.published ? new Date().toISOString() : "";
  } else if (typeof body.publishedAt === "string") {
    patch.publishedAt = body.publishedAt;
  }

  if (Object.keys(patch).length === 0) return fail("No recognised fields to update", 422);

  const post = await updateBlogPost(slug, patch);
  return post ? ok(post) : fail("Post not found", 404);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const done = await deleteBlogPost(slug);
  return done ? ok({ slug }) : fail("Post not found", 404);
}
