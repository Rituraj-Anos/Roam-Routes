import { NextResponse } from "next/server";

/** Consistent JSON envelopes so the client can branch on one shape. */
export const ok = <T>(data: T, status = 200) =>
  NextResponse.json({ ok: true, data }, { status });

export const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: message }, { status });

/** Parse a JSON body, returning null rather than throwing on malformed input. */
export async function jsonBody<T = Record<string, unknown>>(
  req: Request,
): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** Coerce to a finite number within bounds, or undefined when unusable. */
export function num(
  value: unknown,
  { min = -Infinity, max = Infinity }: { min?: number; max?: number } = {},
): number | undefined {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(max, Math.max(min, n));
}

/** Trimmed string, or undefined when empty. */
export function str(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

/** Array of trimmed strings, dropping blanks. */
export function strList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}
