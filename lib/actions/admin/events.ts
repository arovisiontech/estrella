"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

/** Live columns: id, title, slug, description, location, event_date, image_url,
 *  is_active, meta_title, meta_description, created_at, updated_at,
 *  source_data, category
 *  NOTE: the live table has a single `event_date` — there is no start/end pair. */
export interface EventInput {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  category?: string;
  image_url?: string;
  event_date?: string;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
}

function clean(input: EventInput) {
  return {
    title: input.title.trim(),
    slug: input.slug.trim(),
    description: input.description?.trim() || null,
    location: input.location?.trim() || null,
    category: input.category?.trim() || null,
    image_url: input.image_url?.trim() || null,
    event_date: input.event_date ? new Date(input.event_date).toISOString() : null,
    is_active: input.is_active,
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
  };
}

function refresh(slug: string) {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/events/recent");
  revalidatePath("/events/upcoming");
  revalidatePath(`/events/${slug}`);
}

export async function createEvent(input: EventInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminInsert("events", clean(input), "Event");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function updateEvent(id: string, input: EventInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };
  if (!input.slug?.trim()) return { success: false, message: "Slug is required." };

  const result = await adminUpdate("events", id, clean(input), "Event");
  if (result.success) refresh(input.slug.trim());
  return result;
}

export async function setEventActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("events", id, { is_active: isActive }, "Event");
  if (result.success) {
    revalidatePath("/admin/events");
    revalidatePath("/events");
  }
  return result;
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const result = await adminDelete("events", id, "Event");
  if (result.success) {
    revalidatePath("/admin/events");
    revalidatePath("/events");
  }
  return result;
}
