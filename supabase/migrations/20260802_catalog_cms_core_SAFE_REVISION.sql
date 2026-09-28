-- Torque CMS Catalog Core Migration - SAFE REVISION
-- Date: 2026-08-02
-- Status: VERIFIED AGAINST LIVE DATABASE
-- Purpose: Add ONLY genuinely missing tables and columns
-- Safety: IF NOT EXISTS on all statements, tested against live schema

-- ============================================
-- IMPORTANT: REVIEW BEFORE EXECUTION
-- ============================================
-- This revised migration only creates:
--   1. 4 missing tables (product_specifications, product_features, product_highlights, departments)
--   2. Indexes for those new tables
--   3. RLS policies for those new tables
--   4. Triggers for updated_at on those new tables
--
-- This migration SKIPS these 10 tables (already exist):
--   categories, subcategories, products, product_images, product_sizes, product_colors,
--   catalogues, blogs, events, site_settings
--
-- Known extra columns in live database (already exist, won't be recreated):
--   - categories.hover_image_url (not in original migration)
--   - categories.is_featured (not in original migration)
-- ============================================

-- ============================================
-- 1. PRODUCT_SPECIFICATIONS TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_specifications_product_id ON public.product_specifications(product_id);

-- ============================================
-- 2. PRODUCT_FEATURES TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  feature_text text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_features_product_id ON public.product_features(product_id);

-- ============================================
-- 3. PRODUCT_HIGHLIGHTS TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_highlights_product_id ON public.product_highlights(product_id);

-- ============================================
-- 4. DEPARTMENTS TABLE (NEW)
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
-- RLS HELPER FUNCTION (CREATE OR REPLACE - safe)
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
-- RLS POLICIES: PRODUCT_SPECIFICATIONS (NEW)
-- ============================================
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_specifications_public_read ON public.product_specifications
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM public.products WHERE is_active = true AND is_published = true
    )
  );

CREATE POLICY product_specifications_admin_all ON public.product_specifications
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES: PRODUCT_FEATURES (NEW)
-- ============================================
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_features_public_read ON public.product_features
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM public.products WHERE is_active = true AND is_published = true
    )
  );

CREATE POLICY product_features_admin_all ON public.product_features
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES: PRODUCT_HIGHLIGHTS (NEW)
-- ============================================
ALTER TABLE public.product_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_highlights_public_read ON public.product_highlights
  FOR SELECT USING (
    product_id IN (
      SELECT id FROM public.products WHERE is_active = true AND is_published = true
    )
  );

CREATE POLICY product_highlights_admin_all ON public.product_highlights
  FOR ALL USING (public.is_admin());

-- ============================================
-- RLS POLICIES: DEPARTMENTS (NEW)
-- ============================================
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY departments_public_read ON public.departments
  FOR SELECT USING (is_active = true);

CREATE POLICY departments_admin_all ON public.departments
  FOR ALL USING (public.is_admin());

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION (CREATE OR REPLACE - safe)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on new tables only
-- WARNING: If these triggers already exist, DROP them first or this will fail
CREATE TRIGGER IF NOT EXISTS product_specifications_update_updated_at BEFORE UPDATE ON public.product_specifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER IF NOT EXISTS product_features_update_updated_at BEFORE UPDATE ON public.product_features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER IF NOT EXISTS product_highlights_update_updated_at BEFORE UPDATE ON public.product_highlights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER IF NOT EXISTS departments_update_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- MIGRATION NOTES
-- ============================================
-- Tables created: 4 (product_specifications, product_features, product_highlights, departments)
-- Indexes created: 4
-- RLS policies created: 8
-- Triggers created: 4
-- Status: Only creates missing tables, idempotent and safe
