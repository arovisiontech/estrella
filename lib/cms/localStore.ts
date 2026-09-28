import { DEFAULT_PRODUCTS } from "./defaultProducts";
import { DEFAULT_CATEGORIES } from "./defaultCategories";
import { type AdaptedProduct, type CategoryData } from "./types";
import { type HeroSlide } from "./hero-slides";
import { DEFAULT_DEPARTMENTS } from "./departments";

export interface LocalStoreData {
  products: any[];
  categories: any[];
  hero_slides: any[];
  home_sections: any[];
  catalogues: any[];
  departments: any[];
}

function getFsAndPath() {
  if (typeof window !== "undefined") return { fs: null, path: null };
  try {
    const fs = eval("require")("fs");
    const path = eval("require")("path");
    return { fs, path };
  } catch {
    return { fs: null, path: null };
  }
}

function getStorePaths() {
  const { fs, path } = getFsAndPath();
  if (!fs || !path) return { fs: null, path: null, DATA_DIR: "", STORE_FILE: "" };
  const DATA_DIR = path.join(process.cwd(), "data");
  const STORE_FILE = path.join(DATA_DIR, "local_store.json");
  return { fs, path, DATA_DIR, STORE_FILE };
}

function getDefaultStore(): LocalStoreData {
  return {
    products: DEFAULT_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      sale_price: p.salePrice || null,
      currency: p.currency || "PKR",
      short_description: p.shortDescription || "",
      description: p.description || "",
      main_image_url: p.mainImage?.src || "/images/banner-sublimation-sports.svg",
      hover_image_url: p.hoverImage?.src || "/images/about/gallery-1.jpg",
      category_id: p.category,
      category_name: p.categoryLabel || "Sportswears",
      is_featured: Boolean(p.isFeatured),
      is_new: Boolean(p.isNew),
      is_active: Boolean(p.isActive !== false),
      is_published: true,
      sort_order: 0,
      source_data: {
        highlights: p.thumbnails || [],
      },
    })),
    categories: DEFAULT_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image_url: c.image || "/images/about/gallery-1.jpg",
      is_active: true,
      sort_order: 0,
      subcategories: c.subcategories || [],
    })),
    hero_slides: [
      {
        id: "1",
        eyebrow: "Premium Gear",
        title: "Protection Engineered For Riders",
        description: "Industry-leading motorcycle apparel since 1982",
        video_url: "/videos/Motion Edits.mp4",
        image_url: "/images/banner.png",
        sort_order: 1,
        is_active: true,
      },
      {
        id: "2",
        eyebrow: "High Performance",
        title: "Crafted With Precision",
        description: "Professional grade custom sportswear and equipment",
        image_url: "/images/banner.png",
        sort_order: 2,
        is_active: true,
      },
      {
        id: "3",
        eyebrow: "Global Quality",
        title: "Trusted By Athletes Worldwide",
        description: "Innovative design and handcrafted craftsmanship",
        image_url: "/images/banner.png",
        sort_order: 3,
        is_active: true,
      },
    ],
    home_sections: [],
    catalogues: [],
    departments: DEFAULT_DEPARTMENTS.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description,
      short_description: d.shortDescription,
      image_url: typeof d.image === "string" ? d.image : d.image?.src || "/images/banner.png",
      is_active: true,
      sort_order: d.sortOrder || 1,
      source_data: {
        features: d.features || [],
        capabilities: d.capabilities || [],
        equipment: d.equipment || [],
        qualityStandards: d.qualityStandards || [],
        workflowSteps: d.workflowSteps || [],
      },
    })),
  };
}

export function readLocalStore(): LocalStoreData {
  if (typeof window !== "undefined") {
    return getDefaultStore();
  }
  try {
    const { fs, DATA_DIR, STORE_FILE } = getStorePaths();
    if (!fs) return getDefaultStore();

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORE_FILE)) {
      const initial = getDefaultStore();
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const content = fs.readFileSync(STORE_FILE, "utf-8");
    const data = JSON.parse(content);
    return {
      products: Array.isArray(data.products) ? data.products : getDefaultStore().products,
      categories: Array.isArray(data.categories) ? data.categories : getDefaultStore().categories,
      hero_slides: Array.isArray(data.hero_slides) ? data.hero_slides : getDefaultStore().hero_slides,
      home_sections: Array.isArray(data.home_sections) ? data.home_sections : [],
      catalogues: Array.isArray(data.catalogues) ? data.catalogues : [],
      departments: Array.isArray(data.departments) && data.departments.length > 0 ? data.departments : getDefaultStore().departments,
    };
  } catch (err) {
    console.error("Error reading local store:", err);
    return getDefaultStore();
  }
}

export function writeLocalStore(store: LocalStoreData): void {
  if (typeof window !== "undefined") return;
  try {
    const { fs, DATA_DIR, STORE_FILE } = getStorePaths();
    if (!fs) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local store:", err);
  }
}

export function upsertLocalItem(table: string, id: string, itemData: Record<string, any>): void {
  if (typeof window !== "undefined") return;
  const store = readLocalStore();
  const listKey = table as keyof LocalStoreData;

  if (!Array.isArray(store[listKey])) {
    (store[listKey] as any) = [];
  }

  const list = store[listKey] as any[];
  const index = list.findIndex((x) => String(x.id) === String(id));

  if (index >= 0) {
    list[index] = { ...list[index], ...itemData, id, updated_at: new Date().toISOString() };
  } else {
    list.unshift({ ...itemData, id: id || `local-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }

  writeLocalStore(store);
}

export function deleteLocalItem(table: string, id: string): void {
  if (typeof window !== "undefined") return;
  const store = readLocalStore();
  const listKey = table as keyof LocalStoreData;

  if (Array.isArray(store[listKey])) {
    (store[listKey] as any) = store[listKey].filter((x: any) => String(x.id) !== String(id));
    writeLocalStore(store);
  }
}

export function deleteLocalItems(table: string, ids: string[]): void {
  if (typeof window !== "undefined") return;
  const store = readLocalStore();
  const listKey = table as keyof LocalStoreData;

  if (Array.isArray(store[listKey])) {
    const idSet = new Set(ids.map(String));
    (store[listKey] as any) = store[listKey].filter((x: any) => !idSet.has(String(x.id)));
    writeLocalStore(store);
  }
}

