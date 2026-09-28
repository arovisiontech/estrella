"use server";

import { revalidatePath } from "next/cache";
import { withAdmin, type ActionResult } from "./guard";

/** Live columns: id, setting_key, setting_value, updated_at */
export async function saveSiteSettings(
  settings: Record<string, string>
): Promise<ActionResult> {
  const rows = Object.entries(settings)
    .filter(([key]) => key.trim().length > 0)
    .map(([setting_key, setting_value]) => ({
      setting_key: setting_key.trim(),
      setting_value: setting_value ?? "",
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) return { success: false, message: "No settings to save." };

  return withAdmin(async (db) => {
    const { data, error } = await db
      .from("site_settings")
      .upsert(rows, { onConflict: "setting_key" })
      .select();

    if (error) return { success: false, message: `Settings not saved: ${error.message}` };
    if (!data || data.length === 0)
      return { success: false, message: "Settings not saved: database returned no rows." };

    revalidatePath("/admin/settings");
    // Footer and contact metadata read these, so refresh the shared layout.
    revalidatePath("/", "layout");
    revalidatePath("/contact");

    return { success: true, message: `Saved ${data.length} setting(s).`, data };
  });
}
