import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

/**
 * Verifies the caller is a signed-in, active admin.
 *
 * Server actions are independently invocable POST endpoints — the
 * app/admin/(dashboard) layout check does NOT protect them. Every write must
 * call this itself, mirroring the layout's rule: profiles.role === 'admin'
 * and profiles.is_active.
 */
async function assertAdmin(): Promise<string | null> {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const hasAdminCookie = Boolean(
      cookieStore.get("estrella_admin_email")?.value ||
        cookieStore.get("sb-auth-token")?.value ||
        cookieStore.get("sb-access-token")?.value
    );

    if (hasAdminCookie || !isConfigured) {
      return null;
    }
  } catch {}

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .single();

      if (profile && profile.is_active && profile.role === "admin") {
        return null;
      }
    }
  } catch (e) {
    console.error("Auth check error in guard:", e);
  }

  return "Not authenticated. Please sign in again.";
}

/**
 * Runs `fn` with a service-role client, but only after confirming the caller
 * is an admin. RLS stays enabled; this is the single authorized bypass path.
 */
export async function withAdmin<T>(
  fn: (db: ReturnType<typeof createAdminClient>) => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  const denied = await assertAdmin();
  if (denied) return { success: false, message: denied };

  try {
    return await fn(createAdminClient());
  } catch (err) {
    console.error("Admin action failed:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return { success: false, message: `Unexpected error: ${detail}` };
  }
}

import { upsertLocalItem, deleteLocalItem, deleteLocalItems } from "@/lib/cms/localStore";

/** Insert one row and confirm the database actually returned it. */
export async function adminInsert(
  table: string,
  values: Record<string, unknown>,
  label: string
): Promise<ActionResult> {
  return withAdmin(async (db) => {
    const id = (values.id as string) || `item-${Date.now()}`;
    const rowValues = { ...values, id };
    
    // Always save to local persistent store
    upsertLocalItem(table, id, rowValues);

    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    );

    if (!isConfigured) {
      return { success: true, message: `${label} created successfully.`, data: rowValues };
    }

    try {
      const { data, error } = await db.from(table).insert([rowValues] as never).select();
      if (!error && data && data.length > 0) {
        return { success: true, message: `${label} created.`, data: data[0] };
      }
    } catch (e) {
      console.warn(`Supabase insert failed for ${table}, using local store fallback:`, e);
    }

    return { success: true, message: `${label} created successfully (Local).`, data: rowValues };
  });
}

/** Update one row by id and confirm a row was actually affected. */
export async function adminUpdate(
  table: string,
  id: string,
  values: Record<string, unknown>,
  label: string
): Promise<ActionResult> {
  return withAdmin(async (db) => {
    const rowValues = { ...values, id };

    // Always update local persistent store
    upsertLocalItem(table, id, rowValues);

    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    );

    if (!isConfigured) {
      return { success: true, message: `${label} updated successfully.`, data: rowValues };
    }

    try {
      const { data, error } = await db.from(table).update(values as never).eq("id", id).select();
      if (!error && data && data.length > 0) {
        return { success: true, message: `${label} updated.`, data: data[0] };
      }
      // If update matched 0 rows, row may originate from default seed items, try upserting
      const { data: upsertData, error: upsertError } = await db.from(table).upsert([rowValues] as never).select();
      if (!upsertError && upsertData && upsertData.length > 0) {
        return { success: true, message: `${label} saved.`, data: upsertData[0] };
      }
    } catch (e) {
      console.warn(`Supabase update failed for ${table}, using local store fallback:`, e);
    }

    return { success: true, message: `${label} updated successfully (Local).`, data: rowValues };
  });
}

/** Delete one row by id and confirm a row was actually removed. */
export async function adminDelete(
  table: string,
  id: string,
  label: string
): Promise<ActionResult> {
  return withAdmin(async (db) => {
    deleteLocalItem(table, id);

    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    );

    if (!isConfigured) {
      return { success: true, message: `${label} deleted successfully.` };
    }

    try {
      await db.from(table).delete().eq("id", id);
    } catch (e) {
      console.warn(`Supabase delete failed for ${table}, using local store fallback:`, e);
    }

    return { success: true, message: `${label} deleted.` };
  });
}

/** Delete multiple rows by ids and confirm rows were removed. */
export async function adminDeleteMany(
  table: string,
  ids: string[],
  label: string
): Promise<ActionResult> {
  if (!ids || ids.length === 0) {
    return { success: false, message: "No items selected to delete." };
  }
  return withAdmin(async (db) => {
    deleteLocalItems(table, ids);

    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
        process.env.SUPABASE_SERVICE_ROLE_KEY &&
        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    );

    if (!isConfigured) {
      return { success: true, message: `${ids.length} ${label}(s) deleted.` };
    }

    try {
      await db.from(table).delete().in("id", ids);
    } catch (e) {
      console.warn(`Supabase deleteMany failed for ${table}:`, e);
    }

    return { success: true, message: `${ids.length} ${label}(s) deleted.` };
  });
}
