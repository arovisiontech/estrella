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
      .map((p) => {
        const defaultMatch = fallback.find(
          (dp) => dp.id === p.id || dp.slug === p.slug || (dp.sku && dp.sku === p.sku)
        );
        const resolvedSub = p.subcategory || defaultMatch?.subcategory;
        const resolvedSubId = p.subcategory_id || defaultMatch?.subcategory_id;
        const adapted = adaptProductFromRow(p);
        if (adapted) {
          if (resolvedSub) adapted.subcategory = resolvedSub;
          if (resolvedSubId) adapted.subcategory_id = resolvedSubId;
        }
        return adapted;
      })
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
  const strippedSlug = normSlug.replace(/-/g, "").replace(/s$/, "");
  const allLocal = getLocalProducts();
  const defaultMatches = allLocal.filter((p) => {
    const pCat = (p.category || "").toLowerCase();
    const pStripped = pCat.replace(/-/g, "").replace(/s$/, "");
    return (
      pCat === normSlug ||
      pCat.replace(/-/g, "") === normSlug.replace(/-/g, "") ||
      pStripped === strippedSlug ||
      (normSlug.includes("sport") && pCat.includes("sport")) ||
      (normSlug.includes("box") && pCat.includes("box")) ||
      (normSlug.includes("soccer") && pCat.includes("soccer")) ||
      (normSlug.includes("football") && (pCat.includes("football") || pCat.includes("soccer"))) ||
      (normSlug.includes("casual") && pCat.includes("casual")) ||
      (normSlug.includes("active") && pCat.includes("active"))
    );
  });

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

    const matchedCat = cat.find((c: any) => {
      const cSlug = (c.slug || "").trim().toLowerCase();
      const cStripped = cSlug.replace(/-/g, "").replace(/s$/, "");
      return (
        cSlug === normSlug ||
        cSlug.replace(/-/g, "") === normSlug.replace(/-/g, "") ||
        cStripped === strippedSlug ||
        (normSlug.includes("sport") && cSlug.includes("sport")) ||
        (normSlug.includes("box") && cSlug.includes("box")) ||
        (normSlug.includes("soccer") && cSlug.includes("soccer")) ||
        (normSlug.includes("casual") && cSlug.includes("casual")) ||
        (normSlug.includes("active") && cSlug.includes("active"))
      );
    });

    if (!matchedCat) return defaultMatches;

    const [prodsRes, subcatsRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("category_id", matchedCat.id)
        .eq("is_active", true)
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("subcategories")
        .select("id, name, slug")
        .eq("category_id", matchedCat.id),
    ]);

    const prods = prodsRes.data;
    if (prodsRes.error || !prods || prods.length === 0) return defaultMatches;

    const subcatMap = new Map<string, { id: string; name: string; slug: string }>();
    if (subcatsRes.data) {
      for (const sc of subcatsRes.data) {
        if (sc.id) subcatMap.set(sc.id, sc);
        if (sc.slug) subcatMap.set(sc.slug, sc);
      }
    }

    return prods
      .map((p) => {
        const matchedSub = subcatMap.get(p.subcategory_id);
        const defaultMatch = defaultMatches.find(
          (dp) => dp.id === p.id || dp.slug === p.slug || (dp.sku && dp.sku === p.sku)
        );
        const resolvedSubName = matchedSub?.name || p.subcategory || defaultMatch?.subcategory;
        const resolvedSubId = matchedSub?.slug || p.subcategory_id || defaultMatch?.subcategory_id;

        const adapted = adaptProductFromRow(p, matchedCat.name, resolvedSubName);
        if (adapted) {
          if (resolvedSubName) adapted.subcategory = resolvedSubName;
          if (resolvedSubId) adapted.subcategory_id = resolvedSubId;
        }
        return adapted;
      })
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
