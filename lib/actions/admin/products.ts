"use server";

import { revalidatePath } from "next/cache";
import { adminInsert, adminUpdate, adminDelete, adminDeleteMany, withAdmin, type ActionResult } from "./guard";

export interface ProductHighlightItem {
  image: { src: string; alt: string };
  title: string;
  description: string;
  is_custom?: boolean;
}

export interface ProductInput {
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  subcategory_id?: string | null;
  price: number;
  sale_price?: number | null;
  currency?: string;
  short_description?: string | null;
  description?: string | null;
  main_image_url?: string | null;
  hover_image_url?: string | null;
  materials?: string[];
  features?: string[];
  specifications?: Record<string, unknown>;
  catalogue_url?: string | null;
  is_featured?: boolean;
  is_new?: boolean;
  is_active?: boolean;
  is_published?: boolean;
  sort_order?: number;
  stock_quantity?: number;
  manage_stock?: boolean;
  allow_backorder?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  source_data?: Record<string, unknown> | null;
}

function clean(input: ProductInput) {
  return {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"),
    sku: input.sku.trim().toUpperCase(),
    category_id: input.category_id || null,
    subcategory_id: input.subcategory_id || null,
    price: Number(input.price) || 0,
    sale_price: input.sale_price !== null && input.sale_price !== undefined && input.sale_price !== ("" as any) ? Number(input.sale_price) : null,
    currency: input.currency?.trim() || "PKR",
    short_description: input.short_description?.trim() || "",
    description: input.description?.trim() || "",
    main_image_url: input.main_image_url?.trim() || null,
    hover_image_url: input.hover_image_url?.trim() || null,
    materials: Array.isArray(input.materials) ? input.materials : [],
    features: Array.isArray(input.features) ? input.features : [],
    specifications: input.specifications && typeof input.specifications === "object" ? input.specifications : {},
    catalogue_url: input.catalogue_url?.trim() || null,
    is_featured: Boolean(input.is_featured),
    is_new: Boolean(input.is_new),
    is_active: input.is_active !== undefined ? Boolean(input.is_active) : true,
    is_published: input.is_published !== undefined ? Boolean(input.is_published) : true,
    sort_order: Number.isFinite(input.sort_order) ? Number(input.sort_order) : 0,
    stock_quantity: Number.isFinite(input.stock_quantity) ? Number(input.stock_quantity) : 0,
    manage_stock: Boolean(input.manage_stock),
    allow_backorder: Boolean(input.allow_backorder),
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
    source_data: input.source_data || {},
  };
}

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
  revalidatePath("/categories");
  revalidatePath("/admin/products");
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  if (!input.name?.trim()) return { success: false, message: "Product name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Product slug is required." };
  if (!input.sku?.trim()) return { success: false, message: "Product SKU is required." };
  if (!input.category_id?.trim()) return { success: false, message: "Product category is required." };

  const cleaned = clean(input);
  const result = await adminInsert("products", cleaned, "Product");
  if (result.success) refresh(cleaned.slug);
  return result;
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  if (!input.name?.trim()) return { success: false, message: "Product name is required." };
  if (!input.slug?.trim()) return { success: false, message: "Product slug is required." };
  if (!input.sku?.trim()) return { success: false, message: "Product SKU is required." };
  if (!input.category_id?.trim()) return { success: false, message: "Product category is required." };

  const cleaned = clean(input);
  const result = await adminUpdate("products", id, cleaned, "Product");
  if (result.success) refresh(cleaned.slug);
  return result;
}

export async function setProductActive(id: string, isActive: boolean): Promise<ActionResult> {
  const result = await adminUpdate("products", id, { is_active: isActive }, "Product");
  if (result.success) refresh();
  return result;
}

export async function setProductPublished(id: string, isPublished: boolean): Promise<ActionResult> {
  const result = await adminUpdate("products", id, { is_published: isPublished }, "Product");
  if (result.success) refresh();
  return result;
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const result = await adminDelete("products", id, "Product");
  if (result.success) refresh();
  return result;
}

export async function deleteProducts(ids: string[]): Promise<ActionResult> {
  const result = await adminDeleteMany("products", ids, "Product");
  if (result.success) refresh();
  return result;
}

export async function updateProductHighlights(
  id: string,
  highlights: ProductHighlightItem[]
): Promise<ActionResult<ProductHighlightItem[]>> {
  return withAdmin(async (db) => {
    const { data: prod, error: fetchErr } = await db
      .from("products")
      .select("id, slug, source_data")
      .eq("id", id)
      .single();

    if (fetchErr || !prod) {
      return { success: false, message: `Product not found: ${fetchErr?.message || ""}` };
    }

    const currentSource = (prod.source_data as Record<string, unknown>) || {};
    const sanitizedHighlights = highlights.map((h) => ({
      image: {
        src: h.image?.src || "",
        alt: h.image?.alt || h.title || "Product highlight",
      },
      title: h.title?.trim() || "",
      description: h.description?.trim() || "",
      is_custom: true,
    }));

    const updatedSource = {
      ...currentSource,
      highlights: sanitizedHighlights,
    };

    const { error: updateErr } = await db
      .from("products")
      .update({
        source_data: updatedSource,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id);

    if (updateErr) {
      return { success: false, message: `Failed to update highlights: ${updateErr.message}` };
    }

    refresh(prod.slug);
    return {
      success: true,
      message: "Highlights updated successfully!",
      data: sanitizedHighlights,
    };
  });
}

export async function getAdminProductById(id: string): Promise<ActionResult<any>> {
  return withAdmin(async (db) => {
    const { readLocalStore } = await import("@/lib/cms/localStore");
    const store = readLocalStore();
    const localProd = store.products?.find(
      (p: any) => String(p.id) === String(id) || String(p.slug) === String(id) || String(p.sku) === String(id)
    );

    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );

    if (isConfigured) {
      try {
        const { data, error } = await db.from("products").select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return { success: true, message: "Product fetched.", data };
        }
      } catch {}
    }

    if (localProd) {
      return { success: true, message: "Product fetched from local store.", data: localProd };
    }

    return { success: false, message: "Product not found." };
  });
}

