import { createClient } from '@/lib/supabase/client';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  status: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getNewsletterSubscribers(status?: string): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase error fetching newsletter subscribers:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching newsletter subscribers:', error);
    return [];
  }
}

export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'subscribed')
      .order('subscribed_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error fetching active subscribers:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching active subscribers:', error);
    return [];
  }
}
