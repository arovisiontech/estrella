import { createClient } from '@/lib/supabase/client';
import { withTimeout } from '@/lib/utils/timeout';

export interface HomeSection {
  id: string;
  section_key: string;
  title: string;
  component_type: string;
  content?: Record<string, unknown>;
  image_url?: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Map section keys to component imports
export const SECTION_COMPONENTS: Record<string, string> = {
  'hero': 'Hero',
  'featured-products': 'FeaturedProductsSection',
  'crafting-protection': 'CraftingProtectionSection',
  'category-collections': 'CategoryCollectionsSection',
  'what-we-do': 'WhatWeDoSection',
  'latest-blogs': 'LatestBlogsSection',
};

const DEFAULT_SECTIONS: HomeSection[] = [
  {
    id: '1',
    section_key: 'hero',
    title: 'Hero Slides',
    component_type: 'hero',
    is_visible: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    section_key: 'featured-products',
    title: 'Featured Products',
    component_type: 'featured-products',
    is_visible: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    section_key: 'crafting-protection',
    title: 'Crafting Protection',
    component_type: 'crafting-protection',
    is_visible: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    section_key: 'category-collections',
    title: 'Category Collections',
    component_type: 'category-collections',
    is_visible: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    section_key: 'what-we-do',
    title: 'What We Do',
    component_type: 'what-we-do',
    is_visible: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    section_key: 'latest-blogs',
    title: 'Latest Blogs',
    component_type: 'latest-blogs',
    is_visible: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getHomeSections(): Promise<HomeSection[]> {
  const fallback = DEFAULT_SECTIONS.filter(s => s.is_visible);
  try {
    const fetchFn = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return fallback;
      }

      return data;
    };

    return await withTimeout(fetchFn(), fallback, 1000);
  } catch {
    return fallback;
  }
}

export async function getAllHomeSections(): Promise<HomeSection[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('home_sections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ Supabase error fetching all home sections:', error.message);
      return DEFAULT_SECTIONS;
    }

    if (!data || data.length === 0) {
      return DEFAULT_SECTIONS;
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching all home sections:', error);
    return DEFAULT_SECTIONS;
  }
}
