"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

export interface SubcategoryInput {
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  banner_url?: string | null;
  is_featured?: boolean;
  is_active: boolean;
  sort_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  source_data?: Record<string, unknown> | null;
}

function clean(input: SubcategoryInput) {
  return {
    category_id: input.category_id,
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
    description: input.description?.trim() || null,
    image_url: input.image_url?.trim() || null,
    banner_url: input.banner_url?.trim() || null,
    is_featured: Boolean(input.is_featured),
    is_active: Boolean(input.is_active),
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
    source_data: input.source_data || {},
  };
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/subcategories");
}

export async function createSubcategory(input: SubcategoryInput): Promise<ActionResult> {
  if (!input.category_id?.trim()) return { success: false, message: "Parent category is required." };
  if (!input.name?.trim()) return { success: false, message: "Subcategory name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Subcategory slug is required." };

  const cleaned = clean(input);
  const result = await adminInsert("subcategories", cleaned, "Subcategory");
  if (result.success) refresh();
  return result;
}

export async function updateSubcategory(id: string, input: SubcategoryInput): Promise<ActionResult> {
  if (!input.category_id?.trim()) return { success: false, message: "Parent category is required." };
  if (!input.name?.trim()) return { success: false, message: "Subcategory name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Subcategory slug is required." };

  const cleaned = clean(input);
  const result = await adminUpdate("subcategories", id, cleaned, "Subcategory");
  if (result.success) refresh();
  return result;
}

export async function setSubcategoryActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("subcategories", id, { is_active: isActive }, "Subcategory");
  if (result.success) refresh();
  return result;
}

export async function deleteSubcategory(id: string): Promise<ActionResult> {
  const result = await adminDelete("subcategories", id, "Subcategory");
  if (result.success) refresh();
  return result;
}
