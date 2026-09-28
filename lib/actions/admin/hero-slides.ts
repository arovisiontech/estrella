"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

/** Live columns: id, eyebrow, title, description, image_url, mobile_image_url,
 *  video_url, button_text, button_url, text_position, is_active, sort_order,
 *  created_at, updated_at */
export interface HeroSlideInput {
  eyebrow?: string;
  title: string;
  description?: string;
  image_url?: string;
  mobile_image_url?: string;
  video_url?: string;
  button_text?: string;
  button_url?: string;
  text_position: string;
  sort_order: number;
  is_active: boolean;
}

function clean(input: HeroSlideInput) {
  return {
    eyebrow: input.eyebrow?.trim() || null,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    image_url: input.image_url?.trim() || null,
    mobile_image_url: input.mobile_image_url?.trim() || null,
    video_url: input.video_url?.trim() || null,
    button_text: input.button_text?.trim() || null,
    button_url: input.button_url?.trim() || null,
    text_position: input.text_position || "left",
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    is_active: input.is_active,
  };
}

function refresh() {
  revalidatePath("/admin/home/hero-slides");
  revalidatePath("/");
  revalidatePath("/(public)", "layout");
}

export async function createHeroSlide(input: HeroSlideInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };

  const result = await adminInsert("hero_slides", clean(input), "Hero slide");
  if (result.success) refresh();
  return result;
}

export async function updateHeroSlide(id: string, input: HeroSlideInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };

  const result = await adminUpdate("hero_slides", id, clean(input), "Hero slide");
  if (result.success) refresh();
  return result;
}

export async function setHeroSlideActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("hero_slides", id, { is_active: isActive }, "Hero slide");
  if (result.success) refresh();
  return result;
}

export async function deleteHeroSlide(id: string): Promise<ActionResult> {
  const result = await adminDelete("hero_slides", id, "Hero slide");
  if (result.success) refresh();
  return result;
}
