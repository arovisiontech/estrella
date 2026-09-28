-- Complete Torque CMS Migration
-- Creates all necessary tables for full admin panel functionality
-- Safe: Uses IF NOT EXISTS on all operations

-- ============================================
-- 1. CATEGORIES & SUBCATEGORIES (existing, add columns)
-- ============================================

ALTER TABLE IF EXISTS public.categories
ADD COLUMN IF NOT EXISTS source_data jsonb;

ALTER TABLE IF EXISTS public.subcategories
ADD COLUMN IF NOT EXISTS source_data jsonb;

-- ============================================
-- 2. PRODUCTS (existing, add columns)
-- ============================================

ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS source_data jsonb;

ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS video_url text;

ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS short_description text;

-- ============================================
-- 3. BLOGS (existing, add columns)
-- ============================================

ALTER TABLE IF EXISTS public.blogs
ADD COLUMN IF NOT EXISTS source_data jsonb;

ALTER TABLE IF EXISTS public.blogs
ADD COLUMN IF NOT EXISTS author text;

ALTER TABLE IF EXISTS public.blogs
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- ============================================
-- 4. EVENTS (existing, add columns)
-- ============================================

ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS source_data jsonb;

ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS category text;

ALTER TABLE IF EXISTS public.events
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- ============================================
-- 5. CATALOGUES (existing, add columns)
-- ============================================

ALTER TABLE IF EXISTS public.catalogues
ADD COLUMN IF NOT EXISTS source_data jsonb;

ALTER TABLE IF EXISTS public.catalogues
ADD COLUMN IF NOT EXISTS cover_image_url text;

-- ============================================
-- 6. DEPARTMENTS (create if missing)
-- ============================================

CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  image_url text,
  gallery_images text[] DEFAULT '{}',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  source_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);

ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS departments_public_read ON public.departments
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS departments_admin_all ON public.departments
  FOR ALL USING (public.is_admin());

-- ============================================
-- 7. PAGES (new table)
-- ============================================

CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  heading text,
  subheading text,
  description text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  source_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);

ALTER TABLE IF EXISTS public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS pages_public_read ON public.pages
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS pages_admin_all ON public.pages
  FOR ALL USING (public.is_admin());

-- ============================================
-- 8. HOME SECTIONS (new table)
-- ============================================

CREATE TABLE IF NOT EXISTS public.home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  section_type text,
  heading text,
  subheading text,
  description text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  source_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_home_sections_type ON public.home_sections(section_type);

ALTER TABLE IF EXISTS public.home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS home_sections_public_read ON public.home_sections
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS home_sections_admin_all ON public.home_sections
  FOR ALL USING (public.is_admin());

-- ============================================
-- 9. MENUS (new table)
-- ============================================

CREATE TABLE IF NOT EXISTS public.menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text,
  parent_id uuid REFERENCES public.menus(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  open_in_new_tab boolean DEFAULT false,
  source_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menus_parent ON public.menus(parent_id);

ALTER TABLE IF EXISTS public.menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS menus_public_read ON public.menus
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS menus_admin_all ON public.menus
  FOR ALL USING (public.is_admin());

-- ============================================
-- 10. SETTINGS (new table)
-- ============================================

CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS settings_public_read ON public.settings
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS settings_admin_all ON public.settings
  FOR ALL USING (public.is_admin());

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- APPLY TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS departments_update_updated_at ON public.departments;
CREATE TRIGGER departments_update_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS pages_update_updated_at ON public.pages;
CREATE TRIGGER pages_update_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS home_sections_update_updated_at ON public.home_sections;
CREATE TRIGGER home_sections_update_updated_at
  BEFORE UPDATE ON public.home_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS menus_update_updated_at ON public.menus;
CREATE TRIGGER menus_update_updated_at
  BEFORE UPDATE ON public.menus
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS settings_update_updated_at ON public.settings;
CREATE TRIGGER settings_update_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
