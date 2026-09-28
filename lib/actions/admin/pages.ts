"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

/** Live columns: id, slug, title, description, hero_section, content_sections,
 *  featured_image_url, meta_title, meta_description, is_published, sort_order,
 *  source_data, created_at, updated_at */
export interface PageInput {
  title: string;
  slug: string;
  description?: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  sort_order: number;
  source_data?: Record<string, any> | null;
  content_sections?: any;
  hero_section?: any;
}

function clean(input: PageInput) {
  return {
    title: input.title.trim(),
    slug: input.slug.trim(),
    description: input.description?.trim() || null,
    featured_image_url: input.featured_image_url?.trim() || null,
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
    is_published: input.is_published,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    source_data: input.source_data !== undefined ? input.source_data : null,
    content_sections: input.content_sections !== undefined ? input.content_sections : null,
    hero_section: input.hero_section !== undefined ? input.hero_section : null,
  };
}

function refresh(slug: string) {
  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
}

export async function createPage(input: PageInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminInsert("pages", clean(input), "Page");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function updatePage(id: string, input: PageInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminUpdate("pages", id, clean(input), "Page");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function setPagePublished(id: string, isPublished: boolean): Promise<ActionResult> {
  const result = await adminUpdate("pages", id, { is_published: isPublished }, "Page");
  if (result.success) revalidatePath("/admin/pages");
  return result;
}

export async function deletePage(id: string): Promise<ActionResult> {
  const result = await adminDelete("pages", id, "Page");
  if (result.success) revalidatePath("/admin/pages");
  return result;
}
