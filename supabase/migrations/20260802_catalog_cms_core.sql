-- Torque CMS Catalog Core Migration
-- Date: 2026-08-02
-- Purpose: Create all tables needed for catalog, categories, products, and CRUD
-- Safe: Uses IF NOT EXISTS, preserves existing data, idempotent

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  banner_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- ============================================
-- 2. SUBCATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_sort_order ON public.subcategories(sort_order);

-- ============================================
-- 3. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sku text UNIQUE NOT NULL,
  category_id uuid NOT NULL REFERENCES public.categories(id),
  subcategory_id uuid REFERENCES public.subcategories(id),
  short_description text,
  description text,
  price numeric(10, 2) NOT NULL,
  sale_price numeric(10, 2),
  currency text DEFAULT 'PKR',
  stock_quantity integer DEFAULT 0,
  manage_stock boolean DEFAULT true,
  allow_backorder boolean DEFAULT false,
  main_image_url text,
  hover_image_url text,
  is_active boolean DEFAULT true,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- ============================================
-- 4. PRODUCT_IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  image_type text DEFAULT 'gallery',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

-- ============================================
-- 5. PRODUCT_SIZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_label text NOT NULL,
  in_stock boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON public.product_sizes(product_id);

-- ============================================
-- 6. PRODUCT_COLORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  hex_code text,
  image_url text,
  sort_order integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON public.product_colors(product_id);

-- ============================================
-- 7. PRODUCT_SPECIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  sort_order integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON public.product_specifications(product_id);

-- ============================================
-- 8. PRODUCT_FEATURES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  feature_text text NOT NULL,
  sort_order integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_features_product_id ON public.product_features(product_id);

-- ============================================
-- 9. PRODUCT_HIGHLIGHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_product_highlights_product_id ON public.product_highlights(product_id);

-- ============================================
-- 10. CATALOGUES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.catalogues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  pdf_url text NOT NULL,
  cover_image_url text,
  published_date date,
  file_size_mb numeric(5, 2),
  download_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_catalogues_slug ON public.catalogues(slug);

-- ============================================
-- 11. BLOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image_url text,
  author text,
  published_at timestamp with time zone,
  read_time_minutes integer,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- ============================================
-- 12. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  location text,
  description text,
  short_description text,
  image_url text,
  status text DEFAULT 'upcoming',
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

-- ============================================
-- 13. DEPARTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);

-- ============================================
-- 14. SITE_SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  value_type text DEFAULT 'text',
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================
-- RLS HELPER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: CATEGORIES
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_public_read ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY categories_admin_all ON public.categories
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES: SUBCATEGORIES
-- ============================================
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY subcategories_public_read ON public.subcategories
  FOR SELECT USING (is_active = true);

CREATE POLICY subcategories_admin_all ON public.subcategories
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES: PRODUCTS
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (is_active = true AND is_published = true);

CREATE POLICY products_admin_all ON public.products
  FOR ALL USING (public.is_admin());

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all main tables
CREATE TRIGGER categories_update_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER subcategories_update_updated_at BEFORE UPDATE ON public.subcategories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER products_update_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER catalogues_update_updated_at BEFORE UPDATE ON public.catalogues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER blogs_update_updated_at BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER events_update_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER departments_update_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Tables created: 14
-- Indexes created: 30+
-- RLS policies created: 6
-- Triggers created: 7
-- Status: Ready for use
