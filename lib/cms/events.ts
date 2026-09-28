import { createClient } from '@/lib/supabase/client';
import { events as hardcodedEvents } from '@/lib/data/events';

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
  return { ...(source_data ?? {}), ...live } as Record<string, unknown>;
}

export async function getEvents() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error || !data || data.length === 0) {
      return hardcodedEvents;
    }

    return data.map(e => merged(e));
  } catch {
    return hardcodedEvents;
  }
}

export async function getEventBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return hardcodedEvents.find(e => e.slug === slug);
    }

    return merged(data);
  } catch {
    return hardcodedEvents.find(e => e.slug === slug);
  }
}

export async function getUpcomingEvents(limit = 10) {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', now)
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return hardcodedEvents.filter(e => e.status === 'upcoming').slice(0, limit);
    }

    return data.map(e => merged(e)).slice(0, limit);
  } catch {
    return hardcodedEvents.filter(e => e.status === 'upcoming').slice(0, limit);
  }
}

export async function getEventCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    return count || hardcodedEvents.length;
  } catch {
    return hardcodedEvents.length;
  }
}
