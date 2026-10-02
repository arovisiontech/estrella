import { createClient } from "@/lib/supabase/client";
import { type CategoryData, adaptCategoryRow } from "./types";
import { withTimeout } from "@/lib/utils/timeout";
import { cache } from "react";
import { readLocalStore } from "./localStore";
import { DEFAULT_CATEGORIES } from "./defaultCategories";

export { adaptCategoryRow, DEFAULT_CATEGORIES };

function getLocalCategories(): CategoryData[] {
  try {
    const store = readLocalStore();
    if (!store.categories || store.categories.length === 0) return DEFAULT_CATEGORIES;

    return store.categories.map((c) => adaptCategoryRow(c, c.subcategories || []));
  } catch (err) {
    console.error("Error reading local categories:", err);
    return DEFAULT_CATEGORIES;
  }
}

export const getCategoriesWithSubcategories = cache(async (): Promise<CategoryData[]> => {
  const fallback = getLocalCategories();

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return fallback;

    const supabase = await createClient();
    const [catsRes, subcatsRes] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("subcategories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (catsRes.error || !catsRes.data) {
      return fallback;
    }

    const subcats = subcatsRes.data || [];
    const dbCats = catsRes.data.map((c) => adaptCategoryRow(c, subcats));

    const dbIds = new Set(dbCats.map((c) => c.id));
    const merged = [...dbCats, ...fallback.filter((c) => !dbIds.has(c.id))];

    return merged.length > 0 ? merged : fallback;
  };

  return await withTimeout(fetchFn(), fallback, 3000);
});

export async function getCategories(): Promise<CategoryData[]> {
  return getCategoriesWithSubcategories();
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  const normSlug = slug.trim().toLowerCase();
  const strippedSlug = normSlug.replace(/-/g, "").replace(/s$/, "");
  const allLocal = getLocalCategories();
  const defaultMatch = allLocal.find(
    (c) =>
      c.slug === normSlug ||
      c.name.toLowerCase() === normSlug ||
      c.slug.replace(/-/g, "") === normSlug.replace(/-/g, "") ||
      c.slug.replace(/-/g, "").replace(/s$/, "") === strippedSlug
  );

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return defaultMatch || null;

    const supabase = await createClient();
    const { data: cat, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true);

    if (error || !cat) return defaultMatch || null;

    const matched = cat.find(
      (c: any) =>
        c.slug.trim().toLowerCase() === normSlug ||
        c.name.trim().toLowerCase() === normSlug ||
        c.slug.trim().toLowerCase().replace(/-/g, "") === normSlug.replace(/-/g, "") ||
        c.slug.trim().toLowerCase().replace(/-/g, "").replace(/s$/, "") === strippedSlug
    );

    if (!matched) return defaultMatch || null;

    const { data: subcats } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", matched.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    return adaptCategoryRow(matched, subcats || []);
  };

  return await withTimeout(fetchFn(), defaultMatch || null, 600);
}

export async function getCategoryCount(): Promise<number> {
  try {
    const categories = await getCategoriesWithSubcategories();
    return categories.length;
  } catch {
    return DEFAULT_CATEGORIES.length;
  }
}
