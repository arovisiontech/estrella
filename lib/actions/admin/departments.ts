"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

/** Live columns: id, name, slug, description, image_url, source_data, is_active,
 *  created_at, updated_at, short_description, sort_order */
export interface DepartmentInput {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

function clean(input: DepartmentInput) {
  return {
    name: input.name.trim(),
    slug: input.slug.trim(),
    description: input.description?.trim() || null,
    short_description: input.short_description?.trim() || null,
    image_url: input.image_url?.trim() || null,
    is_active: input.is_active,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
  };
}

function refresh(slug: string) {
  revalidatePath("/admin/departments");
  revalidatePath("/departments");
  revalidatePath(`/departments/${slug}`);
}

export async function createDepartment(input: DepartmentInput): Promise<ActionResult> {
  if (!input.name?.trim()) return { success: false, message: "Name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminInsert("departments", clean(input), "Department");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function updateDepartment(id: string, input: DepartmentInput): Promise<ActionResult> {
  if (!input.name?.trim()) return { success: false, message: "Name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminUpdate("departments", id, clean(input), "Department");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function setDepartmentActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("departments", id, { is_active: isActive }, "Department");
  if (result.success) {
    revalidatePath("/admin/departments");
    revalidatePath("/departments");
  }
  return result;
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  const result = await adminDelete("departments", id, "Department");
  if (result.success) {
    revalidatePath("/admin/departments");
    revalidatePath("/departments");
  }
  return result;
}

export async function getAdminDepartmentById(id: string): Promise<ActionResult<any>> {
  const { readLocalStore } = await import("@/lib/cms/localStore");
  const store = readLocalStore();
  const localDept = store.departments?.find(
    (d: any) => String(d.id) === String(id) || String(d.slug) === String(id)
  );

  if (localDept) {
    return { success: true, message: "Department fetched.", data: localDept };
  }

  return { success: false, message: "Department not found." };
}

