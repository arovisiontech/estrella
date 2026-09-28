"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  hover_image_url?: string | null;
  banner_url?: string | null;
  is_featured?: boolean;
  is_active: boolean;
  sort_order: number;
  meta_title?: string | null;
  meta_description?: string | null;
  source_data?: Record<string, unknown> | null;
}

function clean(input: CategoryInput) {
  return {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
    description: input.description?.trim() || null,
    image_url: input.image_url?.trim() || null,
    hover_image_url: input.hover_image_url?.trim() || null,
    banner_url: input.banner_url?.trim() || null,
    is_featured: Boolean(input.is_featured),
    is_active: Boolean(input.is_active),
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
    source_data: input.source_data || {},
  };
}

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/categories");
  if (slug) revalidatePath(`/categories/${slug}`);
  revalidatePath("/admin/categories");
}

export async function createCategory(input: CategoryInput): Promise<ActionResult> {
  if (!input.name?.trim()) return { success: false, message: "Category name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Category slug is required." };

  const cleaned = clean(input);
  const result = await adminInsert("categories", cleaned, "Category");
  if (result.success) refresh(cleaned.slug);
  return result;
}

export async function updateCategory(id: string, input: CategoryInput): Promise<ActionResult> {
  if (!input.name?.trim()) return { success: false, message: "Category name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Category slug is required." };

  const cleaned = clean(input);
  const result = await adminUpdate("categories", id, cleaned, "Category");
  if (result.success) refresh(cleaned.slug);
  return result;
}

export async function setCategoryActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("categories", id, { is_active: isActive }, "Category");
  if (result.success) refresh();
  return result;
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const result = await adminDelete("categories", id, "Category");
  if (result.success) refresh();
  return result;
}
