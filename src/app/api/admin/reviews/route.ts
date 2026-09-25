import { ok, fail, jsonBody, str, num } from "@/lib/api";
import { listReviews, createReview } from "@/lib/store/repo";

export async function GET() {
  return ok(await listReviews());
}

export async function POST(req: Request) {
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const author = str(body.author);
  const text = str(body.text);
  if (!author) return fail("Reviewer name is required", 422);
  if (!text) return fail("Review text is required", 422);

  const rating = num(body.rating, { min: 1, max: 5 }) ?? 5;
  const source = str(body.source);

  const review = await createReview({
    author,
    text,
    rating: Math.round(rating),
    source: source === "Google" ? "Google" : "Manual",
    packageSlug: str(body.packageSlug),
    featured: body.featured === true,
    visible: body.visible !== false,
    date: str(body.date) ?? new Date().toISOString().slice(0, 10),
  });

  return ok(review, 201);
}
