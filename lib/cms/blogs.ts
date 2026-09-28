import { createClient } from '@/lib/supabase/client';
import { blogs as hardcodedBlogs } from '@/lib/data/blogs';

/**
 * source_data is a snapshot captured at migration time. The public components
 * still rely on some of its extra shape, but the live columns are the source
 * of truth for anything the admin can edit - so they must win the merge.
 */
function merged<T extends { source_data?: Record<string, unknown> | null }>(row: T) {
  const { source_data, ...columns } = row as T & { source_data?: Record<string, unknown> | null };
  const live = Object.fromEntries(
    Object.entries(columns).filter(([, v]) => v !== null && v !== undefined)
  );
  const result = { ...(source_data ?? {}), ...live } as Record<string, any>;
  if (result.featured_image_url) {
    result.image = result.featured_image_url;
    result.featured_image = result.featured_image_url;
  }
  return result;
}

export async function getBlogs() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return hardcodedBlogs.filter(b => b.is_published);
    }

    return data.map(b => merged(b));
  } catch {
    return hardcodedBlogs.filter(b => b.is_published);
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return hardcodedBlogs.find(b => b.slug === slug && b.is_published);
    }

    return merged(data);
  } catch {
    return hardcodedBlogs.find(b => b.slug === slug && b.is_published);
  }
}

export async function getLatestBlogs(limit = 3) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return hardcodedBlogs.filter(b => b.is_published).slice(0, limit);
    }

    return data.map(b => merged(b)).slice(0, limit);
  } catch {
    return hardcodedBlogs.filter(b => b.is_published).slice(0, limit);
  }
}

export async function getBlogCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    return count || hardcodedBlogs.filter(b => b.is_published).length;
  } catch {
    return hardcodedBlogs.filter(b => b.is_published).length;
  }
}
