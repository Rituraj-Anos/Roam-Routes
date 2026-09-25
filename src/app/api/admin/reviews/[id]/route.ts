import { ok, fail, jsonBody, str, num } from "@/lib/api";
import { updateReview, deleteReview } from "@/lib/store/repo";
import type { Review } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const patch: Partial<Review> = {};

  const author = str(body.author);
  if (author) patch.author = author;

  const text = str(body.text);
  if (text) patch.text = text;

  const rating = num(body.rating, { min: 1, max: 5 });
  if (rating !== undefined) patch.rating = Math.round(rating);

  if (typeof body.featured === "boolean") patch.featured = body.featured;
  if (typeof body.visible === "boolean") patch.visible = body.visible;
  if (typeof body.packageSlug === "string") {
    patch.packageSlug = body.packageSlug.trim() || undefined;
  }

  if (Object.keys(patch).length === 0) return fail("No recognised fields to update", 422);

  const review = await updateReview(id, patch);
  return review ? ok(review) : fail("Review not found", 404);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const done = await deleteReview(id);
  return done ? ok({ id }) : fail("Review not found", 404);
}
