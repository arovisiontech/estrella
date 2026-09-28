import { createClient } from "@/lib/supabase/client";

export interface Page {
  id: string;
  slug: string;
  title: string;
  description?: string;
  hero_section?: Record<string, unknown>;
  content_sections?: Record<string, unknown>[];
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  sort_order?: number;
  source_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const supabase = await createClient();
    const { data: page, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !page) {
      return null;
    }

    if (!page.is_published) {
      return null;
    }

    return page as Page;
  } catch (err) {
    console.error(`getPageBySlug(${slug}) error:`, err);
    return null;
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as Page[];
  } catch {
    return [];
  }
}
