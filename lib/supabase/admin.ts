import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. SERVER ONLY.
 *
 * This client bypasses RLS, so it must never be constructed in code that can
 * reach the browser. It is only imported by `use server` modules in
 * lib/actions/admin/, each of which calls requireAdmin() before touching it.
 *
 * Deliberately NOT cookie-aware: @supabase/ssr's createServerClient would pick
 * up the caller's session and issue requests as that user, silently defeating
 * the service role. No session is persisted here.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "placeholder_key";

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
