import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Inquiry intake (PRD §7 Notifications).
 * Persists to Supabase when configured, and fires a Resend email alert.
 * Degrades gracefully in local/dev without those env vars so the form still works.
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
  if (!name || !whatsapp) {
    return NextResponse.json({ ok: false, error: "Name and WhatsApp are required" }, { status: 422 });
  }

  const inquiry = {
    name,
    whatsapp,
    travel_dates: String(body.travelDates ?? ""),
    pax: String(body.pax ?? ""),
    package_slug: String(body.packageSlug ?? "") || null,
    message: String(body.message ?? ""),
    status: "New" as const,
    created_at: new Date().toISOString(),
  };

  // Persist to Supabase if configured
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("inquiries").insert(inquiry);
    if (error) {
      console.error("Supabase insert failed:", error.message);
    }
  }

  // Email alert via Resend if configured
  const resendKey = process.env.RESEND_API_KEY;
  const notify = process.env.INQUIRY_NOTIFY_EMAIL;
  if (resendKey && notify) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "RoamAndRoutes <onboarding@resend.dev>",
          to: [notify],
          subject: `New enquiry from ${name}`,
          text: `Name: ${name}\nWhatsApp: ${whatsapp}\nDates: ${inquiry.travel_dates}\nTravellers: ${inquiry.pax}\nTrip: ${inquiry.package_slug ?? "—"}\n\n${inquiry.message}`,
        }),
      });
    } catch (e) {
      console.error("Resend alert failed:", e);
    }
  }

  // Always succeed for the client — WhatsApp is the guaranteed fallback.
  return NextResponse.json({ ok: true });
}
