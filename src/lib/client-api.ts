"use client";

import { toast } from "sonner";

/**
 * Thin fetch wrapper for the admin API.
 *
 * Surfaces the server's own error message rather than a generic failure, so a
 * validation problem tells the user what to fix.
 */
type Envelope<T> = { ok: true; data: T } | { ok: false; error: string };

export async function api<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, ...rest } = init ?? {};

  const res = await fetch(path, {
    ...rest,
    headers: json
      ? { "Content-Type": "application/json", ...(rest.headers ?? {}) }
      : rest.headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  let payload: Envelope<T> | null = null;
  try {
    payload = (await res.json()) as Envelope<T>;
  } catch {
    // Fall through to a status-based message.
  }

  if (!res.ok || !payload || payload.ok === false) {
    const message =
      payload && payload.ok === false
        ? payload.error
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return payload.data;
}

/**
 * Runs a mutation with toast feedback for the three states that matter:
 * in-progress, completion, and error.
 */
export async function withToast<T>(
  run: () => Promise<T>,
  messages: { loading: string; success: string | ((v: T) => string) },
): Promise<T | null> {
  const id = toast.loading(messages.loading);
  try {
    const result = await run();
    toast.success(
      typeof messages.success === "function"
        ? messages.success(result)
        : messages.success,
      { id },
    );
    return result;
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Something went wrong", { id });
    return null;
  }
}
