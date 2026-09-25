import { ok, fail, jsonBody, str } from "@/lib/api";
import { listBlogPosts, createBlogPost } from "@/lib/store/repo";

export async function GET() {
  return ok(await listBlogPosts());
}

export async function POST(req: Request) {
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);
  const post = await createBlogPost({ title: str(body.title) });
  return ok(post, 201);
}
