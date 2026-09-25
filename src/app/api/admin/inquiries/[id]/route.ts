import { ok, fail, jsonBody, str } from "@/lib/api";
import { updateInquiry, deleteInquiry } from "@/lib/store/repo";
import type { InquiryStatus } from "@/lib/types";

const STATUSES: InquiryStatus[] = ["New", "Contacted", "Confirmed", "Closed"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const patch: { status?: InquiryStatus; notes?: string } = {};

  const status = str(body.status);
  if (status) {
    if (!STATUSES.includes(status as InquiryStatus)) {
      return fail(`status must be one of: ${STATUSES.join(", ")}`, 422);
    }
    patch.status = status as InquiryStatus;
  }

  if (typeof body.notes === "string") patch.notes = body.notes.trim();

  if (Object.keys(patch).length === 0) return fail("No recognised fields to update", 422);

  const inq = await updateInquiry(id, patch);
  return inq ? ok(inq) : fail("Inquiry not found", 404);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const done = await deleteInquiry(id);
  return done ? ok({ id }) : fail("Inquiry not found", 404);
}
