import { ok, fail, jsonBody, str } from "@/lib/api";
import { getSettings, updateSettings } from "@/lib/store/repo";
import type { SiteSettings } from "@/lib/store/db";

export async function GET() {
  return ok(await getSettings());
}

export async function PATCH(req: Request) {
  const body = await jsonBody(req);
  if (!body) return fail("Invalid JSON body", 422);

  const patch: Partial<SiteSettings> = {};

  const whatsapp = str(body.whatsapp);
  if (whatsapp) {
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10) return fail("WhatsApp number looks too short", 422);
    patch.whatsapp = digits;
  }

  const email = str(body.email);
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Invalid email address", 422);
    patch.email = email;
  }

  // Free-text fields
  for (const key of ["base", "hours", "roadStatus", "seoTitle"] as const) {
    if (typeof body[key] === "string") patch[key] = (body[key] as string).trim();
  }

  // URL fields, validated so a typo cannot ship a broken social link
  for (const key of ["instagram", "facebook", "youtube"] as const) {
    const raw = body[key];
    if (typeof raw !== "string") continue;
    const value = raw.trim();
    if (!value) {
      patch[key] = "";
      continue;
    }
    try {
      const u = new URL(value);
      if (!/^https?:$/.test(u.protocol)) throw new Error("protocol");
    } catch {
      return fail(`${key} must be a valid http(s) URL`, 422);
    }
    patch[key] = value;
  }

  if (Object.keys(patch).length === 0) return fail("No recognised fields to update", 422);

  return ok(await updateSettings(patch));
}
