"use server";

import { revalidatePath } from "next/cache";
import { withAdmin, type ActionResult } from "./guard";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAdministrators(): Promise<ActionResult<AdminProfile[]>> {
  return withAdmin(async (db) => {
    const { data, error } = await db
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, message: `Failed to fetch administrators: ${error.message}` };
    }

    return {
      success: true,
      message: "Administrators loaded.",
      data: (data || []) as AdminProfile[],
    };
  });
}

export async function setAdminActive(id: string, isActive: boolean): Promise<ActionResult> {
  return withAdmin(async (db) => {
    const { error } = await db
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) {
      return { success: false, message: `Failed to update status: ${error.message}` };
    }

    revalidatePath("/admin/admins");
    return { success: true, message: `Admin account ${isActive ? "activated" : "blocked"}.` };
  });
}

export async function updateAdminRole(id: string, role: string): Promise<ActionResult> {
  return withAdmin(async (db) => {
    const allowed = ["admin", "super_admin", "editor"];
    if (!allowed.includes(role)) {
      return { success: false, message: `Invalid role '${role}'.` };
    }

    const { error } = await db
      .from("profiles")
      .update({ role })
      .eq("id", id);

    if (error) {
      return { success: false, message: `Failed to update role: ${error.message}` };
    }

    revalidatePath("/admin/admins");
    return { success: true, message: "Admin role updated successfully." };
  });
}
