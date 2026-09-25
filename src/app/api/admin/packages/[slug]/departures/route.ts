import { ok, fail, jsonBody, str, num } from "@/lib/api";
import { createDeparture } from "@/lib/store/repo";

/** Add a fixed departure date to a package. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const date = str(body.date);
  if (!date || Number.isNaN(Date.parse(date))) {
    return fail("A valid departure date is required", 422);
  }

  const totalSeats = num(body.totalSeats, { min: 1, max: 200 });
  if (totalSeats === undefined) return fail("Total seats must be between 1 and 200", 422);

  const dep = await createDeparture(slug, {
    date,
    totalSeats: Math.round(totalSeats),
  });

  return dep ? ok(dep, 201) : fail("Package not found", 404);
}
