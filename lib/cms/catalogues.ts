import { createClient } from "@/lib/supabase/client";
import { type AdaptedCatalogue, adaptCatalogueRow } from "./types";
import { withTimeout } from "@/lib/utils/timeout";
export { adaptCatalogueRow };

export const DEFAULT_CATALOGUES: AdaptedCatalogue[] = [
  {
    id: "cat-1",
    title: "Sportswear & Sublimation Apparel Catalogue 2026",
    description: "Complete catalogue of custom digital sublimation sportswear, tracksuits, hoodies, basketball uniforms, and performance athletic wear.",
    slug: "sportswear-sublimation-catalogue",
    coverImage: "/images/brochure-parallax.jpeg",
    cover_image_url: "/images/brochure-parallax.jpeg",
    pdfUrl: "/catalogues/estrella-sportswear-catalogue.pdf",
    file_url: "/catalogues/estrella-sportswear-catalogue.pdf",
    version: "2026 V1.0",
    pages: 36,
    language: "English",
    fileSize: "14.2 MB",
    updatedDate: "2026-09-01",
    category: "Sportswears",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "cat-2",
    title: "Boxing Equipment & Fightwear Catalogue",
    description: "Professional handcrafted leather boxing gloves, focus mitts, head guards, punch bags, and fightwear gear.",
    slug: "boxing-equipment-catalogue",
    coverImage: "/images/about/gallery-4.jpg",
    cover_image_url: "/images/about/gallery-4.jpg",
    pdfUrl: "/catalogues/estrella-boxing-catalogue.pdf",
    file_url: "/catalogues/estrella-boxing-catalogue.pdf",
    version: "2026 V1.0",
    pages: 28,
    language: "English",
    fileSize: "18.5 MB",
    updatedDate: "2026-09-10",
    category: "Boxing Equipment",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "cat-3",
    title: "Soccer Footballs & Match Equipment Catalogue",
    description: "FIFA standard thermo-bonded and hand-stitched match footballs, training soccer balls, and futsal gear.",
    slug: "soccer-footballs-catalogue",
    coverImage: "/images/about/gallery-5.jpg",
    cover_image_url: "/images/about/gallery-5.jpg",
    pdfUrl: "/catalogues/estrella-soccer-catalogue.pdf",
    file_url: "/catalogues/estrella-soccer-catalogue.pdf",
    version: "2026 V1.0",
    pages: 24,
    language: "English",
    fileSize: "12.8 MB",
    updatedDate: "2026-09-15",
    category: "Soccer Footballs",
    sort_order: 3,
    is_active: true,
  },
];

export async function getCatalogues(): Promise<AdaptedCatalogue[]> {
  const fetchFn = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalogues")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATALOGUES;
    }

    const adapted = data
      .map((c) => adaptCatalogueRow(c))
      .filter((c): c is AdaptedCatalogue => c !== null);

    return adapted.length > 0 ? adapted : DEFAULT_CATALOGUES;
  };

  return await withTimeout(fetchFn(), DEFAULT_CATALOGUES, 600);
}

export async function getCatalogueBySlug(slug: string): Promise<AdaptedCatalogue | null> {
  const normSlug = slug.trim().toLowerCase();
  const defaultMatch = DEFAULT_CATALOGUES.find(
    (c) => c.slug === normSlug || c.id === normSlug || c.title.toLowerCase().includes(normSlug)
  );

  const fetchFn = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalogues")
      .select("*")
      .eq("is_active", true);

    if (error || !data) return defaultMatch || null;

    const matched = data.find(
      (c) =>
        c.id === slug ||
        c.source_data?.slug === slug ||
        c.title?.toLowerCase().replace(/[^a-z0-9-]/g, "-") === slug
    );

    return matched ? adaptCatalogueRow(matched) : defaultMatch || null;
  };

  return await withTimeout(fetchFn(), defaultMatch || null, 600);
}

export async function getCatalogueCount(): Promise<number> {
  const list = await getCatalogues();
  return list.length;
}
