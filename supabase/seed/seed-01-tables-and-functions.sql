-- Seed Script 1: Create Missing Tables and Helper Functions
-- Safe: Uses IF NOT EXISTS on all DDL
-- Idempotent: Can run multiple times without error
-- Order: Run this FIRST

-- ============================================
-- STEP 1: Create Missing Tables (IF NOT EXISTS)
-- ============================================

-- Product Specifications Table (Missing)
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id
  ON public.product_specifications(product_id);

-- Product Features Table (Missing)
CREATE TABLE IF NOT EXISTS public.product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  feature_text text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_features_product_id
  ON public.product_features(product_id);

-- Product Highlights Table (Missing)
CREATE TABLE IF NOT EXISTS public.product_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_highlights_product_id
  ON public.product_highlights(product_id);

-- Departments Table (Missing)
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
-- STEP 2: Enable RLS on New Tables
-- ============================================

ALTER TABLE IF EXISTS public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Create RLS Policies
-- ============================================

-- Product Specifications Policies
CREATE POLICY product_specifications_public_read ON public.product_specifications
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM public.products WHERE is_active = true AND is_published = true
    )
  );

CREATE POLICY product_specifications_admin_all ON public.product_specifications
  FOR ALL USING (public.is_admin());

-- Product Features Policies
CREATE POLICY product_features_public_read ON public.product_features
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM public.products WHERE is_active = true AND is_published = true
    )
  );

CREATE POLICY product_features_admin_all ON public.product_features
  FOR ALL USING (public.is_admin());

-- Product Highlights Policies
CREATE POLICY product_highlights_public_read ON public.product_highlights
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM public.products WHERE is_active = true AND is_published = true
    )
  );

CREATE POLICY product_highlights_admin_all ON public.product_highlights
  FOR ALL USING (public.is_admin());

-- Departments Policies
CREATE POLICY departments_public_read ON public.departments
  FOR SELECT USING (is_active = true);

CREATE POLICY departments_admin_all ON public.departments
  FOR ALL USING (public.is_admin());

-- ============================================
-- STEP 4: Create Trigger Function (if not exists)
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 5: Create Triggers on New Tables
-- ============================================

CREATE TRIGGER IF NOT EXISTS departments_update_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify tables were created:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema='public' AND table_name IN
-- ('product_specifications', 'product_features', 'product_highlights', 'departments');
-- Expected: 4 rows
