import { promises as fs } from "node:fs";
import path from "node:path";
import { ok, fail } from "@/lib/api";
import { listMedia, deleteMedia } from "@/lib/store/repo";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const asset = (await listMedia()).find((m) => m.id === id);
  if (!asset) return fail("Asset not found", 404);

  await deleteMedia(id);

  // Remove the local file too, but never let a missing file fail the request.
  if (asset.url.startsWith("/uploads/")) {
    const abs = path.join(process.cwd(), "public", asset.url.replace(/^\//, ""));
    await fs.unlink(abs).catch(() => undefined);
  }

  return ok({ id });
}
