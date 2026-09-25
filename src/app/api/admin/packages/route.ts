import { ok, fail, jsonBody, str } from "@/lib/api";
import { listPackages, createPackage, duplicatePackage } from "@/lib/store/repo";

/** List every package, including drafts. */
export async function GET() {
  return ok(await listPackages());
}

/**
 * Create a package, or duplicate an existing one when `duplicateOf` is given.
 * New packages start as drafts so nothing half-written reaches the public site.
 */
export async function POST(req: Request) {
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const source = str(body.duplicateOf);
  if (source) {
    const copy = await duplicatePackage(source);
    if (!copy) return fail("Package to duplicate was not found", 404);
    return ok(copy, 201);
  }

  const pkg = await createPackage({ title: str(body.title) });
  return ok(pkg, 201);
}
