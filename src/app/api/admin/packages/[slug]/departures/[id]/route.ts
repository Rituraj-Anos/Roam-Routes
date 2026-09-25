import { ok, fail, jsonBody, str, num } from "@/lib/api";
import { updateDeparture, deleteDeparture } from "@/lib/store/repo";
import type { Departure } from "@/lib/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const patch: Partial<Departure> = {};

  const date = str(body.date);
  if (date) {
    if (Number.isNaN(Date.parse(date))) return fail("Invalid departure date", 422);
    patch.date = date;
  }

  const total = num(body.totalSeats, { min: 1, max: 200 });
  if (total !== undefined) patch.totalSeats = Math.round(total);

  const booked = num(body.bookedSeats, { min: 0, max: 200 });
  if (booked !== undefined) patch.bookedSeats = Math.round(booked);

  const status = str(body.status);
  if (status) {
    if (status !== "open" && status !== "sold_out") {
      return fail("status must be 'open' or 'sold_out'", 422);
    }
    patch.status = status;
  }

  if (Object.keys(patch).length === 0) return fail("No recognised fields to update", 422);

  const dep = await updateDeparture(slug, id, patch);
  return dep ? ok(dep) : fail("Departure not found", 404);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { slug, id } = await params;
  const done = await deleteDeparture(slug, id);
  return done ? ok({ id }) : fail("Departure not found", 404);
}
