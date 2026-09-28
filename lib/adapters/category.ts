import { shopCategories } from '@/lib/data/shopCategories';

export function adaptCategoryFromSupabase(row: any) {
  if (!row) return null;

  const fallback = shopCategories.find(
    (c) =>
      c.slug === row.slug ||
      c.id === row.slug ||
      c.id === row.id ||
      c.name?.toLowerCase() === row.name?.toLowerCase()
  );

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || fallback?.description,
    banner: {
      src: row.banner_url || row.image_url || row.source_data?.banner?.src || fallback?.banner?.src || '/images/banner.png',
      alt: row.source_data?.banner?.alt || fallback?.banner?.alt || `${row.name} collection`,
    },
    subcategories: (row.source_data?.subcategories && row.source_data.subcategories.length > 0)
      ? row.source_data.subcategories
      : (fallback?.subcategories || []),
    is_active: row.is_active,
    sort_order: row.sort_order,
    source_data: row.source_data,
  };
}

export function adaptProductFromSupabase(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: row.price,
    salePrice: row.sale_price || undefined,
    currency: row.currency || 'USD',
    shortDescription: row.short_description || row.source_data?.shortDescription || '',
    description: row.description || row.source_data?.description || '',
    mainImage: {
      src: row.main_image_url || row.source_data?.mainImage?.src || '/images/placeholder.png',
      alt: row.source_data?.mainImage?.alt || row.name,
    },
    hoverImage: {
      src: row.hover_image_url || row.source_data?.hoverImage?.src || row.main_image_url || row.source_data?.mainImage?.src || '/images/placeholder.png',
      alt: row.source_data?.hoverImage?.alt || row.name,
    },
    galleryImages: row.source_data?.galleryImages || [],
    thumbnails: row.source_data?.thumbnails || [],
    videoUrl: row.source_data?.videoUrl || undefined,
    videoPoster: row.source_data?.videoPoster || undefined,
    category: row.source_data?.category || '',
    categoryLabel: row.source_data?.categoryLabel || row.name,
    subcategory: row.source_data?.subcategory || undefined,
    tags: row.source_data?.tags || [],
    sizes: row.source_data?.sizes || [],
    colors: row.source_data?.colors || [],
    specifications: row.source_data?.specifications || [],
    materials: row.source_data?.materials || row.materials || [],
    features: row.source_data?.features || row.features || [],
    highlights: row.source_data?.highlights || [],
    stockQuantity: row.stock_quantity || 0,
    isNew: row.is_new || false,
    isFeatured: row.is_featured || false,
    isActive: row.is_active !== false,
  } as any;
}

export function adaptCatalogueFromSupabase(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    slug: row.source_data?.slug || row.title?.toLowerCase().replace(/\s+/g, '-') || 'catalogue',
    coverImage: row.cover_image_url || row.thumbnail_url || row.source_data?.coverImage || '/images/placeholder.png',
    version: row.source_data?.version || '',
    pages: row.source_data?.pages || 0,
    language: row.source_data?.language || 'en',
    pdfUrl: row.file_url || row.source_data?.pdfUrl || '',
    featured: row.source_data?.featured || false,
    updatedDate: row.source_data?.updatedDate || row.updated_at || row.created_at,
    displayOrder: row.sort_order || row.source_data?.displayOrder || 0,
    status: row.is_active ? 'active' : 'archived',
    category: row.source_data?.category || 'all',
    is_active: row.is_active,
    fileSize: row.source_data?.fileSize || '',
  };
}

export function adaptDepartmentFromSupabase(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name || '',
    slug: row.slug || '',
    description: row.description || '',
    shortDescription: row.short_description || row.source_data?.shortDescription || row.description || '',
    image: row.image_url || row.image || row.source_data?.image || '/images/banner.png',
    galleryImages: row.gallery_images || row.source_data?.galleryImages || (row.image_url ? [row.image_url] : ['/images/banner.png']),
    isActive: row.is_active !== false,
    sortOrder: row.sort_order ?? row.source_data?.sortOrder ?? 0,
    features: row.features || row.source_data?.features || [],
    capabilities: row.capabilities || row.source_data?.capabilities || [],
    stats: row.stats || row.source_data?.stats || [],
    leadTime: row.lead_time || row.source_data?.leadTime || '',
    source_data: row.source_data,
  };
}

export function adaptBlogFromSupabase(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || row.source_data?.excerpt || '',
    content: row.content || row.source_data?.content || '',
    featured_image_url: row.featured_image_url || row.source_data?.featured_image_url || '/images/placeholder.png',
    author_name: row.author_name || row.source_data?.author_name || 'Torque',
    published_at: row.published_at || row.source_data?.published_at || row.created_at,
    reading_time: row.reading_time || row.source_data?.reading_time || 5,
    is_published: row.is_published !== false,
    meta_title: row.source_data?.meta_title || row.title,
    meta_description: row.source_data?.meta_description || row.excerpt,
    source_data: row.source_data,
  };
}

export function adaptEventFromSupabase(row: any) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name || row.title,
    slug: row.slug,
    description: row.description || row.source_data?.description || '',
    shortDescription: row.source_data?.shortDescription || row.description || '',
    eventDate: row.source_data?.eventDate || row.created_at,
    eventLocation: row.source_data?.eventLocation || '',
    featuredImage: row.featured_image_url || row.source_data?.featuredImage || '/images/placeholder.png',
    status: row.source_data?.status || 'upcoming',
    featured: row.source_data?.featured || false,
    source_data: row.source_data,
  };
}
