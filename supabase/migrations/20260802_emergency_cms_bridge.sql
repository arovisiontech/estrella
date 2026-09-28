-- Emergency CMS Bridge Migration
-- Adds source_data JSONB column to preserve original hard-coded data
-- Creates missing departments table
-- Safe: Uses IF NOT EXISTS, ADD COLUMN IF NOT EXISTS
-- No destructive operations

-- ============================================
-- ADD source_data JSONB TO EXISTING TABLES
-- ============================================

ALTER TABLE IF EXISTS public.categories ADD COLUMN IF NOT EXISTS source_data jsonb;
ALTER TABLE IF EXISTS public.subcategories ADD COLUMN IF NOT EXISTS source_data jsonb;
ALTER TABLE IF EXISTS public.products ADD COLUMN IF NOT EXISTS source_data jsonb;
ALTER TABLE IF EXISTS public.blogs ADD COLUMN IF NOT EXISTS source_data jsonb;
ALTER TABLE IF EXISTS public.events ADD COLUMN IF NOT EXISTS source_data jsonb;
ALTER TABLE IF EXISTS public.catalogues ADD COLUMN IF NOT EXISTS source_data jsonb;

-- ============================================
-- CREATE DEPARTMENTS TABLE (if missing)
-- ============================================

CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  source_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);

-- ============================================
-- Enable RLS on departments
-- ============================================

ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS departments_public_read ON public.departments
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS departments_admin_all ON public.departments
  FOR ALL USING (public.is_admin());

-- ============================================
-- Add source_data trigger function
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Create triggers for updated_at
-- ============================================

DROP TRIGGER IF EXISTS departments_update_updated_at ON public.departments;
CREATE TRIGGER departments_update_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
