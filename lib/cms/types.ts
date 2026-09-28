export interface SubcategoryData {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  banner_url?: string | null;
  is_active: boolean;
  is_featured?: boolean;
  sort_order: number;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image?: {
    src: string;
    alt: string;
  };
  banner?: {
    src: string;
    alt: string;
  };
  image_url: string | null;
  banner_url: string | null;
  is_active: boolean;
  is_featured?: boolean;
  sort_order: number;
  subcategories: SubcategoryData[];
}

export interface AdaptedProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  currency: string;
  category: string;
  categoryLabel?: string;
  subcategory?: string;
  tags?: string[];
  mainImage: {
    src: string;
    alt: string;
  };
  hoverImage?: {
    src: string;
    alt: string;
  };
  galleryImages?: {
    src: string;
    alt: string;
  }[];
  thumbnails?: {
    src: string;
    alt: string;
  }[];
  description: string;
  shortDescription: string;
  features?: string[];
  featuresText?: string;
  standardsText?: string;
  documentsText?: string;
  specifications?: Record<string, string>;
  materials?: Record<string, string>;
  catalogueUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isPublished?: boolean;
  isActive: boolean;
  sortOrder?: number;
  stockQuantity?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  videoUrl?: string;
  videoPoster?: string;
  highlights?: Array<{ image: { src: string; alt: string }; title: string; description: string }>;
  colors?: string[];
  sizes?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AdaptedCatalogue {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  coverImage: string;
  cover_image_url: string | null;
  pdfUrl: string;
  file_url: string;
  version: string;
  pages: number;
  language: string;
  fileSize: string;
  featured?: boolean;
  is_active: boolean;
  status?: "active" | "archived";
  category: string;
  displayOrder?: number;
  sort_order: number;
  updatedDate: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdaptedDepartment {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image: string | { src: string; alt: string };
  galleryImages?: string[] | { src: string; alt: string }[];
  icon?: string;
  badge?: string;
  features?: string[];
  capabilities?: any[];
  equipment?: string[];
  qualityStandards?: string[];
  workflowSteps?: any[];
  stats?: any[];
  leadTime?: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export function adaptCatalogueRow(row: any): AdaptedCatalogue | null {
  if (!row) return null;

  const cover =
    row.cover_image_url ||
    row.thumbnail_url ||
    row.source_data?.coverImage ||
    "/images/placeholder.png";

  const pdf = row.file_url || row.source_data?.pdfUrl || "";

  return {
    id: row.id,
    title: row.title || "Catalogue",
    description: row.description || row.source_data?.description || null,
    slug: row.source_data?.slug || (row.title ? row.title.toLowerCase().replace(/[^a-z0-9-]/g, "-") : "catalogue"),
    coverImage: cover,
    cover_image_url: row.cover_image_url || null,
    pdfUrl: pdf,
    file_url: pdf,
    version: row.source_data?.version || "2024.1",
    pages: Number(row.source_data?.pages) || 0,
    language: row.source_data?.language || "English",
    fileSize: row.source_data?.fileSize || "PDF",
    featured: Boolean(row.source_data?.featured),
    is_active: Boolean(row.is_active),
    status: row.is_active ? "active" : "archived",
    category: row.source_data?.category || "all",
    displayOrder: row.sort_order ?? 0,
    sort_order: row.sort_order ?? 0,
    updatedDate: row.updated_at || row.created_at || new Date().toISOString(),
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}

export function adaptCategoryRow(
  cat: any,
  subcategories: any[] = []
): CategoryData {
  const matchingSubcats: SubcategoryData[] = subcategories
    .filter((s) => s.category_id === cat.id && s.is_active)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((s) => ({
      id: s.id,
      category_id: s.category_id,
      name: s.name,
      slug: s.slug,
      description: s.description || null,
      image_url: s.image_url || null,
      banner_url: s.banner_url || null,
      is_active: s.is_active,
      is_featured: Boolean(s.is_featured),
      sort_order: s.sort_order ?? 0,
    }));

  const imgSrc =
    cat.image_url ||
    cat.banner_url ||
    cat.source_data?.image?.src ||
    "/images/banner.png";

  const bannerSrc =
    cat.banner_url ||
    cat.image_url ||
    cat.source_data?.banner?.src ||
    "/images/banner.png";

  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || null,
    image: {
      src: imgSrc,
      alt: cat.name || "Category",
    },
    banner: {
      src: bannerSrc,
      alt: cat.name || "Category",
    },
    image_url: cat.image_url || null,
    banner_url: cat.banner_url || null,
    is_active: cat.is_active,
    is_featured: Boolean(cat.is_featured),
    sort_order: cat.sort_order ?? 0,
    subcategories: matchingSubcats,
  };
}

function extractImageUrl(val: any): string | null {
  if (!val) return null;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof val === "object") {
    const src = val.src || val.url || val.image_url || val.imageUrl;
    if (typeof src === "string" && src.trim().length > 0) {
      return src.trim();
    }
  }
  return null;
}

const isLegacyDummyImage = (src?: string | null): boolean => {
  if (!src) return false;
  return (
    src.startsWith("/images/image 15") ||
    src.startsWith("/images/Products-") ||
    src === "/images/banner.png" ||
    src === "/images/placeholder.png"
  );
};

export function getImageKey(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const pathname = url.includes("://") ? new URL(url).pathname : url;
    const filename = pathname.split("/").pop() || "";
    // Strip timestamp prefix like 1788943409190-113.jpg -> 113.jpg
    const stripped = filename.replace(/^\d{10,15}-/, "");
    return stripped.toLowerCase().trim();
  } catch {
    const filename = url.split("/").pop() || "";
    return filename.replace(/^\d{10,15}-/, "").toLowerCase().trim();
  }
}

export function adaptProductFromRow(
  row: any,
  categoryName: string = "Products",
  subcategoryName?: string
): AdaptedProduct | null {
  if (!row) return null;

  const rawMain =
    extractImageUrl(row.main_image_url) ||
    extractImageUrl(row.source_data?.mainImage) ||
    extractImageUrl(row.source_data?.primary_image) ||
    extractImageUrl(row.primary_image) ||
    "/images/banner.png";

  const rawHover =
    extractImageUrl(row.hover_image_url) ||
    extractImageUrl(row.source_data?.hoverImage) ||
    extractImageUrl(row.source_data?.hover_image) ||
    extractImageUrl(row.hover_image) ||
    rawMain;

  const main = rawMain;
  const hover = rawHover;

  // Collect candidate gallery images from all possible sources
  const rawGalleryList: any[] = [];
  if (Array.isArray(row.gallery_images)) rawGalleryList.push(...row.gallery_images);
  if (Array.isArray(row.source_data?.galleryImages)) rawGalleryList.push(...row.source_data.galleryImages);
  if (Array.isArray(row.source_data?.gallery_images)) rawGalleryList.push(...row.source_data.gallery_images);
  if (Array.isArray(row.source_data?.thumbnails)) rawGalleryList.push(...row.source_data.thumbnails);

  const hasRealProductImage = !isLegacyDummyImage(main) || !isLegacyDummyImage(hover);

  const seenKeys = new Set<string>();
  const gallery: { src: string; alt: string }[] = [];

  // Always put primary image first
  if (main && (!hasRealProductImage || !isLegacyDummyImage(main))) {
    const key = getImageKey(main) || main;
    seenKeys.add(key);
    gallery.push({ src: main, alt: row.name || "Product" });
  }

  for (const item of rawGalleryList) {
    const url = extractImageUrl(item);
    if (!url) continue;
    if (hasRealProductImage && isLegacyDummyImage(url)) continue;
    const key = getImageKey(url) || url;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      const alt = (typeof item === "object" && item?.alt) || row.name || "Product";
      gallery.push({ src: url, alt });
    }
  }

  if (hover && (!hasRealProductImage || !isLegacyDummyImage(hover))) {
    const key = getImageKey(hover) || hover;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      gallery.push({ src: hover, alt: row.name || "Product" });
    }
  }

  if (gallery.length === 0) {
    gallery.push({ src: main || "/images/banner.png", alt: row.name || "Product" });
  }

  const rawHighlights = Array.isArray(row.highlights)
    ? row.highlights
    : Array.isArray(row.source_data?.highlights)
      ? row.source_data.highlights
      : [];

  const highlights = rawHighlights
    .map((h: any) => {
      let imgSrc = extractImageUrl(h.image) || extractImageUrl(h.icon);
      if (hasRealProductImage && isLegacyDummyImage(imgSrc) && !h.is_custom) {
        imgSrc = main;
      }
      return {
        image: { src: imgSrc || main, alt: h.title || row.name || "Highlight" },
        title: h.title || "",
        description: h.description || "",
      };
    })
    .filter((h: { title: string; image: { src: string; alt: string }; description: string }) => h.title && h.title.trim().length > 0);

  const colorsList: string[] = Array.isArray(row.colors)
    ? row.colors
    : Array.isArray(row.source_data?.colors)
      ? row.source_data.colors
      : typeof row.source_data?.colors === "string"
        ? row.source_data.colors.split(",").map((s: string) => s.trim()).filter(Boolean)
        : typeof row.colors === "string"
          ? row.colors.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];

  const sizesList: string[] = Array.isArray(row.sizes)
    ? row.sizes
    : Array.isArray(row.source_data?.sizes)
      ? row.source_data.sizes
      : typeof row.source_data?.sizes === "string"
        ? row.source_data.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
        : typeof row.sizes === "string"
          ? row.sizes.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];

  const resolvedCategory =
    categoryName && categoryName !== "Products"
      ? categoryName
      : row.category_id || row.category_name || row.category || "sportswear";

  return {
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    sku: row.sku || "",
    price: Number(row.price) || 0,
    salePrice: row.sale_price ? Number(row.sale_price) : null,
    currency: row.currency || "USD",
    category: resolvedCategory.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
    categoryLabel: categoryName && categoryName !== "Products" ? categoryName : row.category_name || resolvedCategory,
    subcategory: subcategoryName || row.subcategory_id || row.subcategory,
    mainImage: { src: main, alt: row.name || "Product" },
    hoverImage: { src: hover, alt: row.name || "Product" },
    galleryImages: gallery,
    thumbnails: gallery,
    description: row.description || "",
    shortDescription: row.short_description || row.source_data?.shortDescription || "",
    features: Array.isArray(row.features) ? row.features : row.source_data?.features || [],
    featuresText: typeof row.features === "string" ? row.features : row.source_data?.featuresText || row.source_data?.features_text || "",
    standardsText: typeof row.source_data?.standards === "string" ? row.source_data.standards : typeof row.source_data?.standardsText === "string" ? row.source_data.standardsText : typeof row.specifications === "string" ? row.specifications : "",
    documentsText: typeof row.source_data?.documents === "string" ? row.source_data.documents : typeof row.source_data?.documentsText === "string" ? row.source_data.documentsText : "",
    specifications: (typeof row.specifications === "object" && row.specifications) || row.source_data?.specifications || {},
    materials: (typeof row.materials === "object" && row.materials) || row.source_data?.materials || {},
    catalogueUrl: row.catalogue_url || row.source_data?.catalogueUrl || row.source_data?.catalogue_url,
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    isPublished: row.is_published !== false,
    isActive: row.is_active !== false,
    sortOrder: row.sort_order ?? 0,
    stockQuantity: row.stock_quantity ?? 0,
    rating: row.source_data?.rating || 5,
    reviewsCount: row.source_data?.reviewsCount || 0,
    badge: row.source_data?.badge,
    videoUrl: row.source_data?.videoUrl,
    videoPoster: row.source_data?.videoPoster,
    highlights: highlights.length > 0 ? highlights : undefined,
    colors: colorsList,
    sizes: sizesList,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function adaptDepartmentRow(row: any): AdaptedDepartment | null {
  if (!row) return null;

  const image = row.image_url || row.image || row.source_data?.image || "/images/banner.png";
  const gallery = Array.isArray(row.gallery_images)
    ? row.gallery_images
    : Array.isArray(row.source_data?.galleryImages)
      ? row.source_data.galleryImages
      : [image];

  return {
    id: row.id,
    name: row.name || "",
    slug: row.slug || "",
    description: row.description || "",
    shortDescription: row.short_description || row.source_data?.shortDescription || row.description || "",
    image,
    galleryImages: gallery,
    features: Array.isArray(row.features) ? row.features : row.source_data?.features || [],
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : row.source_data?.capabilities || [],
    stats: Array.isArray(row.stats) ? row.stats : row.source_data?.stats || [],
    leadTime: row.lead_time || row.source_data?.leadTime || "",
    sortOrder: row.sort_order ?? 0,
    sort_order: row.sort_order ?? 0,
    isActive: row.is_active !== false,
    is_active: row.is_active !== false,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
