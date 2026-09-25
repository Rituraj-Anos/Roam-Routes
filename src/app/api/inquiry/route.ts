import { NextResponse } from "next/server";
import { createInquiry, getSettings } from "@/lib/store/repo";

/**
 * Public inquiry intake.
 *
 * Goes through the repository, so it lands in Postgres when Supabase is
 * configured and in the local store otherwise. A Resend alert fires when
 * configured.
 *
 * This endpoint always reports success to the browser once validation passes:
 * WhatsApp is the guaranteed fallback path, and a storage hiccup should not
 * make a real lead think the agency is broken. Failures are logged server-side.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();

  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Please tell us your name" },
      { status: 422 },
    );
  }
  if (whatsapp.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { ok: false, error: "Enter a number we can reach you on" },
      { status: 422 },
    );
  }

  const paxRaw = String(body.pax ?? "1");
  const pax = Number.parseInt(paxRaw, 10);

  const inquiry = {
    name,
    whatsapp,
    travelDates: String(body.travelDates ?? "").trim(),
    pax: Number.isFinite(pax) && pax > 0 ? pax : 1,
    packageSlug: String(body.packageSlug ?? "").trim() || undefined,
    message: String(body.message ?? "").trim() || undefined,
  };

  try {
    await createInquiry(inquiry);
  } catch (e) {
    console.error("Inquiry save failed:", e);
  }

  // Email alert, best effort. Never blocks the response.
  const resendKey = process.env.RESEND_API_KEY;
  const notify = process.env.INQUIRY_NOTIFY_EMAIL;

  if (resendKey && notify) {
    try {
      const settings = await getSettings().catch(() => null);
      const lines = [
        `Name: ${inquiry.name}`,
        `WhatsApp: ${inquiry.whatsapp}`,
        `Dates: ${inquiry.travelDates || "not given"}`,
        `Travellers: ${inquiry.pax}`,
        `Trip: ${inquiry.packageSlug ?? "not decided"}`,
        "",
        inquiry.message ?? "",
      ];

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "RoamAndRoutes <onboarding@resend.dev>",
          to: [notify],
          reply_to: settings?.email,
          subject: `New enquiry from ${inquiry.name}`,
          text: lines.join("\n"),
        }),
      });
    } catch (e) {
      console.error("Inquiry alert failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
