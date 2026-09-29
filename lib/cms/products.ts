import { createClient } from "@/lib/supabase/client";
import { type AdaptedProduct, adaptProductFromRow } from "./types";
import { withTimeout } from "@/lib/utils/timeout";
import { readLocalStore } from "./localStore";
import { DEFAULT_PRODUCTS } from "./defaultProducts";

export { adaptProductFromRow, DEFAULT_PRODUCTS };

function getLocalProducts(): AdaptedProduct[] {
  try {
    const store = readLocalStore();
    if (!store.products || store.products.length === 0) return DEFAULT_PRODUCTS;

    const adapted = store.products
      .map((p) => adaptProductFromRow(p))
      .filter((p): p is AdaptedProduct => p !== null);

    return adapted.length > 0 ? adapted : DEFAULT_PRODUCTS;
  } catch (err) {
    console.error("Failed reading local products:", err);
    return DEFAULT_PRODUCTS;
  }
}

export async function getProducts(): Promise<AdaptedProduct[]> {
  const fallback = getLocalProducts();

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return fallback;

    const supabase = await createClient();
    const { data: prods, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !prods) return fallback;

    const dbProducts = prods
      .map((p) => adaptProductFromRow(p))
      .filter((p): p is AdaptedProduct => p !== null);

    // Merge Supabase products with local products (DB takes priority, fallback adds any extra)
    const dbIds = new Set(dbProducts.map((p) => p.id));
    const merged = [...dbProducts, ...fallback.filter((p) => !dbIds.has(p.id))];

    return merged.length > 0 ? merged : fallback;
  };

  return await withTimeout(fetchFn(), fallback, 3000);
}

export async function getFeaturedProducts(): Promise<AdaptedProduct[]> {
  const allLocal = getLocalProducts();
  const fallback = allLocal.filter((p) => p.isFeatured);

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return fallback;

    const supabase = await createClient();
    const { data: prods, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error || !prods || prods.length === 0) return fallback;

    return prods
      .map((p) => adaptProductFromRow(p))
      .filter((p): p is AdaptedProduct => p !== null);
  };

  return await withTimeout(fetchFn(), fallback, 600);
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<AdaptedProduct[]> {
  const normSlug = categorySlug.trim().toLowerCase();
  const allLocal = getLocalProducts();
  const defaultMatches = allLocal.filter(
    (p) =>
      p.category === normSlug ||
      p.category.replace(/-/g, "") === normSlug.replace(/-/g, "") ||
      (normSlug.includes("sport") && p.category === "sportswear") ||
      (normSlug.includes("box") && p.category === "boxing-equipment") ||
      (normSlug.includes("soccer") && p.category === "soccer-footballs") ||
      (normSlug.includes("ball") && p.category === "soccer-footballs")
  );

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return defaultMatches;

    const supabase = await createClient();
    const { data: cat } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("is_active", true);

    if (!cat) return defaultMatches;

    const matchedCat = cat.find(
      (c: any) =>
        c.slug.trim().toLowerCase() === normSlug ||
        c.slug.trim().toLowerCase().replace(/-/g, "") === normSlug.replace(/-/g, "")
    );

    if (!matchedCat) return defaultMatches;

    const { data: prods, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", matchedCat.id)
      .eq("is_active", true)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !prods || prods.length === 0) return defaultMatches;

    return prods
      .map((p) => adaptProductFromRow(p, matchedCat.name))
      .filter((p): p is AdaptedProduct => p !== null);
  };

  return await withTimeout(fetchFn(), defaultMatches, 600);
}

export async function getProductBySlug(slug: string): Promise<AdaptedProduct | null> {
  const normSlug = slug.trim().toLowerCase();
  const allLocal = getLocalProducts();
  const defaultMatch = allLocal.find(
    (p) => p.slug.trim().toLowerCase() === normSlug
  );

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return defaultMatch || null;

    const supabase = await createClient();
    const { data: prod, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !prod) return defaultMatch || null;

    let categoryName = "Products";
    if (prod.category_id) {
      const { data: cat } = await supabase
        .from("categories")
        .select("name")
        .eq("id", prod.category_id)
        .maybeSingle();
      if (cat) categoryName = cat.name;
    }

    return adaptProductFromRow(prod, categoryName);
  };

  return await withTimeout(fetchFn(), defaultMatch || null, 600);
}
