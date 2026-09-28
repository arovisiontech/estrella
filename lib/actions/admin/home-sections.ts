"use server";

import { revalidatePath } from "next/cache";
import { adminUpdate, adminInsert, adminDelete, withAdmin, type ActionResult } from "./guard";

export interface HomeSectionInput {
  section_key: string;
  title: string;
  component_type: string;
  image_url?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  content?: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
}

function refresh() {
  revalidatePath("/admin/home-sections");
  revalidatePath("/");
  revalidatePath("/(public)", "layout");
}

export async function createHomeSection(input: HomeSectionInput): Promise<ActionResult> {
  if (!input.section_key?.trim()) return { success: false, message: "Section key is required." };
  if (!input.title?.trim()) return { success: false, message: "Title is required." };

  const contentPayload = {
    heading: input.heading?.trim() || null,
    subheading: input.subheading?.trim() || null,
    description: input.description?.trim() || null,
    button_text: input.button_text?.trim() || null,
    button_link: input.button_link?.trim() || null,
    ...(input.content || {}),
  };

  const result = await adminInsert(
    "home_sections",
    {
      section_key: input.section_key.trim(),
      title: input.title.trim(),
      component_type: input.component_type?.trim() || input.section_key.trim(),
      image_url: input.image_url?.trim() || null,
      content: contentPayload,
      is_visible: input.is_visible,
      sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    },
    "Section"
  );
  if (result.success) refresh();
  return result;
}

export async function updateHomeSection(id: string, input: HomeSectionInput): Promise<ActionResult> {
  if (!input.title?.trim()) return { success: false, message: "Title is required." };

  const contentPayload = {
    heading: input.heading?.trim() || null,
    subheading: input.subheading?.trim() || null,
    description: input.description?.trim() || null,
    button_text: input.button_text?.trim() || null,
    button_link: input.button_link?.trim() || null,
    ...(input.content || {}),
  };

  const result = await adminUpdate(
    "home_sections",
    id,
    {
      section_key: input.section_key.trim(),
      title: input.title.trim(),
      component_type: input.component_type?.trim() || input.section_key.trim(),
      image_url: input.image_url?.trim() || null,
      content: contentPayload,
      is_visible: input.is_visible,
      sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    },
    "Section"
  );
  if (result.success) refresh();
  return result;
}

export async function setHomeSectionVisible(id: string, isVisible: boolean): Promise<ActionResult> {
  const result = await adminUpdate("home_sections", id, { is_visible: isVisible }, "Section");
  if (result.success) refresh();
  return result;
}

export async function swapHomeSectionOrder(
  aId: string,
  aOrder: number,
  bId: string,
  bOrder: number
): Promise<ActionResult> {
  return withAdmin(async (db) => {
    const first = await db.from("home_sections").update({ sort_order: bOrder }).eq("id", aId).select();
    if (first.error) return { success: false, message: `Reorder failed: ${first.error.message}` };

    const second = await db.from("home_sections").update({ sort_order: aOrder }).eq("id", bId).select();
    if (second.error) {
      await db.from("home_sections").update({ sort_order: aOrder }).eq("id", aId);
      return { success: false, message: `Reorder failed: ${second.error.message}` };
    }

    refresh();
    return { success: true, message: "Order updated." };
  });
}

export async function deleteHomeSection(id: string): Promise<ActionResult> {
  const result = await adminDelete("home_sections", id, "Section");
  if (result.success) refresh();
  return result;
}
