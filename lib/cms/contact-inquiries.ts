import { createClient } from '@/lib/supabase/client';

export interface ContactInquiry {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject: string;
  message: string;
  status: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getContactInquiries(status?: string): Promise<ContactInquiry[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Supabase error fetching contact inquiries:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching contact inquiries:', error);
    return [];
  }
}

export async function getUnreadInquiries(): Promise<ContactInquiry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .eq('status', 'new')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error fetching unread inquiries:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching unread inquiries:', error);
    return [];
  }
}
