"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client for admin auth flows. Returns null if unconfigured. */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
