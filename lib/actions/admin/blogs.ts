"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

/** Live columns: id, title, slug, excerpt, content, featured_image_url,
 *  author_name, is_published, published_at, meta_title, meta_description,
 *  created_at, updated_at, source_data, author */
export interface BlogInput {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  featured_image_url?: string;
  is_published: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}

function clean(input: BlogInput) {
  return {
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt?.trim() || null,
    content: input.content?.trim() || null,
    author_name: input.author_name?.trim() || null,
    featured_image_url: input.featured_image_url?.trim() || null,
    is_published: input.is_published,
    // Stamp a publish date the first time it goes live so the public listing,
    // which sorts on published_at, can order it.
    published_at: input.published_at || (input.is_published ? new Date().toISOString() : null),
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
  };
}

function refresh(slug: string) {
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${slug}`);
}

export async function createBlog(input: BlogInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminInsert("blogs", clean(input), "Blog");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function updateBlog(id: string, input: BlogInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminUpdate("blogs", id, clean(input), "Blog");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function setBlogPublished(id: string, isPublished: boolean): Promise<ActionResult> {
  const patch: Record<string, unknown> = { is_published: isPublished };
  if (isPublished) patch.published_at = new Date().toISOString();

  const result = await adminUpdate("blogs", id, patch, "Blog");
  if (result.success) {
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
  }
  return result;
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  const result = await adminDelete("blogs", id, "Blog");
  if (result.success) {
    revalidatePath("/admin/blogs");
    revalidatePath("/blogs");
  }
  return result;
}
