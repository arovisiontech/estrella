"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, type ActionResult } from "./guard";

/** Live columns: id, menu_type, label, href, parent_id, sort_order, is_active,
 *  target, created_at, updated_at
 *  Live menu_type values: header, footer_quick, footer_products */
export interface MenuItemInput {
  label: string;
  href?: string;
  menu_type: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  target?: string | null;
}

const MENU_TYPES = ["header", "footer_quick", "footer_products"] as const;

function clean(input: MenuItemInput) {
  return {
    label: input.label.trim(),
    href: input.href?.trim() || null,
    menu_type: input.menu_type,
    parent_id: input.parent_id || null,
    sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 0,
    is_active: input.is_active,
    target: input.target?.trim() || null,
  };
}

// Header, mobile menu and footer all render from menu_items, so any change
// invalidates every page that includes the shared layout.
function refresh() {
  revalidatePath("/admin/menus");
  revalidatePath("/", "layout");
}

export async function createMenuItem(input: MenuItemInput): Promise<ActionResult> {
  if (!input.label?.trim()) return { success: false, message: "Label is required." };
  if (!MENU_TYPES.includes(input.menu_type as (typeof MENU_TYPES)[number]))
    return { success: false, message: `Menu type must be one of: ${MENU_TYPES.join(", ")}` };

  const result = await adminInsert("menu_items", clean(input), "Menu item");
  if (result.success) refresh();
  return result;
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<ActionResult> {
  if (!input.label?.trim()) return { success: false, message: "Label is required." };
  if (input.parent_id === id)
    return { success: false, message: "A menu item cannot be its own parent." };

  const result = await adminUpdate("menu_items", id, clean(input), "Menu item");
  if (result.success) refresh();
  return result;
}

export async function setMenuItemActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("menu_items", id, { is_active: isActive }, "Menu item");
  if (result.success) refresh();
  return result;
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const result = await adminDelete("menu_items", id, "Menu item");
  if (result.success) refresh();
  return result;
}
