import { createClient } from '@/lib/supabase/client';

export interface MenuItem {
  id: string;
  label: string;
  href?: string | null;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  menu_type: string;
  target?: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_MENU_ITEMS: Record<string, MenuItem[]> = {
  header: [
    { id: '1', label: 'HOME', href: '/', sort_order: 1, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
    { id: '2', label: 'ABOUT US', href: '/about', sort_order: 2, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
    { id: '3', label: 'PRODUCTS', href: '/products', sort_order: 3, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
    { id: '4', label: 'CATALOGUE', href: '/catalogue', sort_order: 4, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
    { id: '5', label: 'DEPARTMENTS', href: '/departments', sort_order: 5, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
    { id: '6', label: 'EVENTS', href: '/events', sort_order: 6, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
    { id: '7', label: 'CONTACT US', href: '/contact', sort_order: 7, is_active: true, menu_type: 'header', created_at: '', updated_at: '' },
  ],
  footer_quick: [
    { id: '8', label: 'Home', href: '/', sort_order: 1, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
    { id: '9', label: 'About Us', href: '/about', sort_order: 2, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
    { id: '10', label: 'Sportswears', href: '/categories/sportswears', sort_order: 3, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
    { id: '11', label: 'Boxing Equipment', href: '/categories/boxing-equipment', sort_order: 4, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
    { id: '12', label: 'Soccer Footballs', href: '/categories/soccer-footballs', sort_order: 5, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
    { id: '13', label: 'Departments', href: '/departments', sort_order: 6, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
    { id: '14', label: 'Contact Us', href: '/contact', sort_order: 7, is_active: true, menu_type: 'footer_quick', created_at: '', updated_at: '' },
  ],
  footer_products: [
    { id: '15', label: 'Custom Sportswear', href: '/categories/sportswears', sort_order: 1, is_active: true, menu_type: 'footer_products', created_at: '', updated_at: '' },
    { id: '16', label: 'Boxing Equipment', href: '/categories/boxing-equipment', sort_order: 2, is_active: true, menu_type: 'footer_products', created_at: '', updated_at: '' },
    { id: '17', label: 'Soccer Footballs', href: '/categories/soccer-footballs', sort_order: 3, is_active: true, menu_type: 'footer_products', created_at: '', updated_at: '' },
    { id: '18', label: 'Sublimation Sportswear', href: '/categories/sportswears', sort_order: 4, is_active: true, menu_type: 'footer_products', created_at: '', updated_at: '' },
    { id: '19', label: 'Manufacturing Departments', href: '/departments', sort_order: 5, is_active: true, menu_type: 'footer_products', created_at: '', updated_at: '' },
    { id: '20', label: 'Bulk OEM Production', href: '/contact', sort_order: 6, is_active: true, menu_type: 'footer_products', created_at: '', updated_at: '' },
  ],
};

export async function getMenuItems(menuType: string): Promise<MenuItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('menu_type', menuType)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return DEFAULT_MENU_ITEMS[menuType] || [];
    }

    if (!data || data.length === 0) {
      return DEFAULT_MENU_ITEMS[menuType] || [];
    }

    return data;
  } catch {
    return DEFAULT_MENU_ITEMS[menuType] || [];
  }
}

export async function getHeaderMenu(): Promise<MenuItem[]> {
  return getMenuItems('header');
}

export async function getFooterQuickLinks(): Promise<MenuItem[]> {
  return getMenuItems('footer_quick');
}

export async function getFooterProducts(): Promise<MenuItem[]> {
  return getMenuItems('footer_products');
}
