import { DEFAULT_CATEGORIES } from "./defaultCategories";
import { DEFAULT_PRODUCTS } from "./defaultProducts";

const CATEGORIES_KEY = "estrella_admin_categories";
const PRODUCTS_KEY = "estrella_admin_products";
const SUBCATEGORIES_KEY = "estrella_admin_subcategories";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

// ----------------------------------------------------
// Categories Storage
// ----------------------------------------------------

export function getStoredCategories(): any[] {
  if (!isBrowser()) return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CATEGORIES;

    // Merge: stored items override default items by id or slug
    const storedIds = new Set(parsed.map((c) => c.id));
    const storedSlugs = new Set(parsed.map((c) => c.slug));
    const nonOverriddenDefaults = DEFAULT_CATEGORIES.filter(
      (dc) => !storedIds.has(dc.id) && !storedSlugs.has(dc.slug)
    );
    return [...parsed, ...nonOverriddenDefaults];
  } catch (e) {
    console.error("Error reading stored categories:", e);
    return DEFAULT_CATEGORIES;
  }
}

export function getStoredCategoryById(idOrSlug: string): any | null {
  const all = getStoredCategories();
  const normalized = idOrSlug.trim().toLowerCase();
  return (
    all.find(
      (c) =>
        c.id === idOrSlug ||
        c.slug === normalized ||
        c.id?.toLowerCase() === normalized ||
        c.name?.toLowerCase() === normalized
    ) || null
  );
}

export function saveStoredCategory(category: any): void {
  if (!isBrowser()) return;
  try {
    const all = getStoredCategories();
    const id = category.id || `cat-${Date.now()}`;
    const slug = (category.slug || "").trim().toLowerCase();

    const existingIndex = all.findIndex(
      (c) => c.id === id || (slug && c.slug === slug)
    );

    const updatedCategory = {
      ...category,
      id,
      slug: slug || category.slug,
      updated_at: new Date().toISOString(),
    };

    let updatedList: any[];
    if (existingIndex >= 0) {
      updatedList = [...all];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...updatedCategory };
    } else {
      updatedList = [updatedCategory, ...all];
    }

    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("estrella_categories_updated"));
  } catch (e) {
    console.error("Error saving stored category:", e);
  }
}

export function deleteStoredCategory(id: string): void {
  if (!isBrowser()) return;
  try {
    const all = getStoredCategories();
    const filtered = all.filter((c) => c.id !== id && c.slug !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("estrella_categories_updated"));
  } catch (e) {
    console.error("Error deleting stored category:", e);
  }
}

// ----------------------------------------------------
// Products Storage
// ----------------------------------------------------

export function getStoredProducts(): any[] {
  if (!isBrowser()) return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PRODUCTS;

    // Merge: stored items override default items by id, sku, or slug
    const storedIds = new Set(parsed.map((p) => String(p.id)));
    const storedSkus = new Set(parsed.map((p) => String(p.sku || "").toUpperCase()));
    const storedSlugs = new Set(parsed.map((p) => String(p.slug || "").toLowerCase()));

    const nonOverriddenDefaults = DEFAULT_PRODUCTS.filter(
      (dp) =>
        !storedIds.has(String(dp.id)) &&
        !storedSkus.has(String(dp.sku).toUpperCase()) &&
        !storedSlugs.has(String(dp.slug).toLowerCase())
    );

    return [...parsed, ...nonOverriddenDefaults];
  } catch (e) {
    console.error("Error reading stored products:", e);
    return DEFAULT_PRODUCTS;
  }
}

export function getStoredProductById(idOrSkuOrSlug: string): any | null {
  const all = getStoredProducts();
  const normalized = idOrSkuOrSlug.trim().toLowerCase();
  return (
    all.find(
      (p) =>
        String(p.id) === idOrSkuOrSlug ||
        String(p.id).toLowerCase() === normalized ||
        String(p.sku).toLowerCase() === normalized ||
        String(p.slug).toLowerCase() === normalized
    ) || null
  );
}

export function saveStoredProduct(product: any): void {
  if (!isBrowser()) return;
  try {
    const all = getStoredProducts();
    const id = product.id || `prod-${Date.now()}`;
    const sku = (product.sku || "").trim().toUpperCase();
    const slug = (product.slug || "").trim().toLowerCase();

    const existingIndex = all.findIndex(
      (p) =>
        String(p.id) === String(id) ||
        (sku && String(p.sku).toUpperCase() === sku) ||
        (slug && String(p.slug).toLowerCase() === slug)
    );

    const updatedProduct = {
      ...product,
      id,
      sku: sku || product.sku,
      slug: slug || product.slug,
      updated_at: new Date().toISOString(),
    };

    let updatedList: any[];
    if (existingIndex >= 0) {
      updatedList = [...all];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...updatedProduct };
    } else {
      updatedList = [updatedProduct, ...all];
    }

    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("estrella_products_updated"));
  } catch (e) {
    console.error("Error saving stored product:", e);
  }
}

export function deleteStoredProduct(id: string): void {
  if (!isBrowser()) return;
  try {
    const all = getStoredProducts();
    const filtered = all.filter(
      (p) => String(p.id) !== String(id) && String(p.sku) !== String(id)
    );
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("estrella_products_updated"));
  } catch (e) {
    console.error("Error deleting stored product:", e);
  }
}

export function deleteStoredProducts(ids: string[]): void {
  if (!isBrowser()) return;
  try {
    const removeSet = new Set(ids.map((id) => String(id)));
    const all = getStoredProducts();
    const filtered = all.filter((p) => !removeSet.has(String(p.id)));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("estrella_products_updated"));
  } catch (e) {
    console.error("Error deleting stored products:", e);
  }
}

// ----------------------------------------------------
// Subcategories Storage
export const DEFAULT_SUBCATEGORIES_FLAT = DEFAULT_CATEGORIES.flatMap((c) =>
  (c.subcategories || []).map((s) => ({
    ...s,
    category_id: c.id,
    category_slug: c.slug,
    category_name: c.name,
  }))
);

export function getStoredSubcategories(): any[] {
  if (!isBrowser()) return DEFAULT_SUBCATEGORIES_FLAT;
  try {
    const raw = localStorage.getItem(SUBCATEGORIES_KEY);
    if (!raw) return DEFAULT_SUBCATEGORIES_FLAT;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_SUBCATEGORIES_FLAT;

    const storedIds = new Set(parsed.map((s) => s.id));
    const storedSlugs = new Set(parsed.map((s) => s.slug));
    const nonOverridden = DEFAULT_SUBCATEGORIES_FLAT.filter(
      (ds) => !storedIds.has(ds.id) && !storedSlugs.has(ds.slug)
    );
    return [...parsed, ...nonOverridden];
  } catch (e) {
    console.error("Error reading stored subcategories:", e);
    return DEFAULT_SUBCATEGORIES_FLAT;
  }
}

export function saveStoredSubcategory(subcategory: any): void {
  if (!isBrowser()) return;
  try {
    const all = getStoredSubcategories();
    const id = subcategory.id || `subcat-${Date.now()}`;
    const existingIndex = all.findIndex((s) => s.id === id || (subcategory.slug && s.slug === subcategory.slug));

    const updated = { ...subcategory, id, updated_at: new Date().toISOString() };
    let updatedList: any[];
    if (existingIndex >= 0) {
      updatedList = [...all];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...updated };
    } else {
      updatedList = [updated, ...all];
    }

    localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("estrella_subcategories_updated"));
  } catch (e) {
    console.error("Error saving stored subcategory:", e);
  }
}

export function deleteStoredSubcategory(id: string): void {
  if (!isBrowser()) return;
  try {
    const all = getStoredSubcategories();
    const filtered = all.filter((s) => s.id !== id && s.slug !== id);
    localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("estrella_subcategories_updated"));
  } catch (e) {
    console.error("Error deleting stored subcategory:", e);
  }
}

