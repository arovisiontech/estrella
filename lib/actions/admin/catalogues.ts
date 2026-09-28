"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

export interface CatalogueInput {
  title: string;
  description?: string | null;
  file_url: string;
  cover_image_url?: string | null;
  thumbnail_url?: string | null;
  is_active: boolean;
  sort_order: number;
  source_data?: Record<string, unknown> | null;
}

function clean(input: CatalogueInput) {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    file_url: input.file_url.trim(),
    cover_image_url: input.cover_image_url?.trim() || null,
    thumbnail_url: input.thumbnail_url?.trim() || input.cover_image_url?.trim() || null,
    is_active: Boolean(input.is_active),
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    source_data: input.source_data || {},
  };
}

function refresh() {
  revalidatePath("/catalogue");
  revalidatePath("/admin/catalogues");
}

export async function createCatalogue(input: CatalogueInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Catalogue title is required." };
  if (!input.file_url?.trim()) return { success: false, message: "Catalogue PDF file is required." };

  const cleaned = clean(input);
  const result = await adminInsert("catalogues", cleaned, "Catalogue");
  if (result.success) refresh();
  return result;
}

export async function updateCatalogue(id: string, input: CatalogueInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Catalogue title is required." };
  if (!input.file_url?.trim()) return { success: false, message: "Catalogue PDF file is required." };

  const cleaned = clean(input);
  const result = await adminUpdate("catalogues", id, cleaned, "Catalogue");
  if (result.success) refresh();
  return result;
}

export async function setCatalogueActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("catalogues", id, { is_active: isActive }, "Catalogue");
  if (result.success) refresh();
  return result;
}

export async function deleteCatalogue(id: string): Promise<ActionResult> {
  const result = await adminDelete("catalogues", id, "Catalogue");
  if (result.success) refresh();
  return result;
}
