-- Seed Script 2: Categories & Subcategories
-- Safe: Uses INSERT ... ON CONFLICT DO NOTHING (idempotent)
-- Preserves: All existing categories
-- Adds: Missing categories and all subcategories

-- ============================================
-- SEED: CATEGORIES (6 total, 2 may exist)
-- ============================================
-- This uses ON CONFLICT DO NOTHING to skip duplicates
-- Existing categories with same slug will not be updated

INSERT INTO public.categories (id, name, slug, description, image_url, banner_url, sort_order, is_active, meta_title, meta_description, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Protective Jackets', 'protective-jackets', 'Advanced protective jackets engineered for maximum safety', '/images/Banner-3 3.png', '/images/Banner-3 3.png', 1, true, 'Protective Jackets', 'Explore our protective jacket collection', now(), now()),
  (gen_random_uuid(), 'Motorbike Leather Jackets', 'motorbike-leather-jackets', 'Premium leather jackets for the discerning rider', '/images/banner.png', '/images/banner.png', 2, true, 'Motorbike Leather Jackets', 'Premium motorbike leather jackets', now(), now()),
  (gen_random_uuid(), 'Touring Jacket', 'touring-jacket', 'Comfortable and durable jackets for long-distance touring', '/images/Banner-4 1.png', '/images/Banner-4 1.png', 3, true, 'Touring Jacket', 'Long distance touring jackets', now(), now()),
  (gen_random_uuid(), 'Winter Gloves', 'winter-gloves', 'Insulated gloves for cold weather riding', '/images/Banner-5 1 - Copy.png', '/images/Banner-5 1 - Copy.png', 4, true, 'Winter Gloves', 'Cold weather gloves', now(), now()),
  (gen_random_uuid(), 'Textile Trousers', 'textile-trousers', 'Protective textile trousers for all riding conditions', '/images/Banner-5 2 - Copy.png', '/images/Banner-5 2 - Copy.png', 5, true, 'Textile Trousers', 'Durable textile trousers', now(), now()),
  (gen_random_uuid(), 'Street Summer Gloves', 'street-summer-gloves', 'Lightweight gloves for warm weather riding', '/images/Banner-4 2 - Copy.png', '/images/Banner-4 2 - Copy.png', 6, true, 'Street Summer Gloves', 'Summer gloves', now(), now())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: SUBCATEGORIES (24 total, must link to categories)
-- ============================================
-- This links subcategories to existing categories via slug match
-- ON CONFLICT DO NOTHING prevents duplicates

INSERT INTO public.subcategories (id, category_id, name, slug, description, image_url, sort_order, is_active, created_at, updated_at)
VALUES
  -- Protective Jackets Subcategories (4)
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'protective-jackets'), 'Adventure Jackets', 'adventure-jackets', 'Adventure jackets for off-road riding', '/images/Banner-3 3.png', 1, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'protective-jackets'), 'Armoured Jackets', 'armoured-jackets', 'Full armoured protection jackets', '/images/Banner-4 2 - Copy.png', 2, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'protective-jackets'), 'Waterproof Jackets', 'waterproof-jackets', 'Waterproof protective jackets', '/images/Banner-5 1 - Copy.png', 3, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'protective-jackets'), 'Mesh Jackets', 'mesh-jackets', 'Breathable mesh jackets', '/images/image 248.png', 4, true, now(), now()),

  -- Motorbike Leather Jackets Subcategories (4)
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'motorbike-leather-jackets'), 'Racing Leather Jackets', 'racing-leather', 'Race-fit leather jackets', '/images/banner.png', 1, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'motorbike-leather-jackets'), 'Touring Leather Jackets', 'touring-leather', 'Touring leather jackets', '/images/Banner-3 2 - Copy.png', 2, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'motorbike-leather-jackets'), 'Urban Leather Jackets', 'urban-leather', 'Urban style leather jackets', '/images/Banner-4 2 - Copy.png', 3, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'motorbike-leather-jackets'), 'Vintage Leather Jackets', 'vintage-leather', 'Vintage style leather jackets', '/images/Banner-5 1 - Copy.png', 4, true, now(), now()),

  -- Touring Jacket Subcategories (4)
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'touring-jacket'), 'Waterproof Touring', 'waterproof-touring', 'Waterproof touring jackets', '/images/Banner-4 1.png', 1, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'touring-jacket'), 'Adventure Touring', 'adventure-touring', 'Adventure touring jackets', '/images/Banner-3 3.png', 2, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'touring-jacket'), 'All-Season Touring', 'all-season-touring', 'All-season touring jackets', '/images/Banner-4 2 - Copy.png', 3, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'touring-jacket'), 'Lightweight Touring', 'lightweight-touring', 'Lightweight touring jackets', '/images/Banner-5 1 - Copy.png', 4, true, now(), now()),

  -- Winter Gloves Subcategories (4)
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'winter-gloves'), 'Thermal Gloves', 'thermal-gloves', 'Thermal winter gloves', '/images/Banner-5 1 - Copy.png', 1, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'winter-gloves'), 'Waterproof Gloves', 'waterproof-gloves', 'Waterproof winter gloves', '/images/image 249.png', 2, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'winter-gloves'), 'Touring Winter Gloves', 'touring-winter', 'Touring winter gloves', '/images/image 250.png', 3, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'winter-gloves'), 'Heated Gloves', 'heated-gloves', 'Heated winter gloves', '/images/image 251.png', 4, true, now(), now()),

  -- Textile Trousers Subcategories (4)
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'textile-trousers'), 'Waterproof Trousers', 'waterproof-trousers', 'Waterproof textile trousers', '/images/Banner-5 2 - Copy.png', 1, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'textile-trousers'), 'Adventure Trousers', 'adventure-trousers', 'Adventure textile trousers', '/images/image 248.png', 2, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'textile-trousers'), 'Touring Trousers', 'touring-trousers', 'Touring textile trousers', '/images/image 249.png', 3, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'textile-trousers'), 'Summer Trousers', 'summer-trousers', 'Summer textile trousers', '/images/image 250.png', 4, true, now(), now()),

  -- Street Summer Gloves Subcategories (4)
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'street-summer-gloves'), 'Mesh Gloves', 'mesh-gloves', 'Breathable mesh gloves', '/images/Banner-4 2 - Copy.png', 1, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'street-summer-gloves'), 'Lightweight Gloves', 'lightweight-gloves', 'Lightweight summer gloves', '/images/image 251.png', 2, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'street-summer-gloves'), 'Urban Gloves', 'urban-gloves', 'Urban style gloves', '/images/Rectangle 557.png', 3, true, now(), now()),
  (gen_random_uuid(), (SELECT id FROM public.categories WHERE slug = 'street-summer-gloves'), 'Touchscreen Gloves', 'touchscreen-gloves', 'Touchscreen compatible gloves', '/images/Rectangle 558.png', 4, true, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- SELECT COUNT(*) as category_count FROM public.categories WHERE is_active = true;
-- Expected: 6

-- SELECT COUNT(*) as subcategory_count FROM public.subcategories WHERE is_active = true;
-- Expected: 24

-- SELECT c.name, COUNT(s.id) as subcategory_count
-- FROM public.categories c
-- LEFT JOIN public.subcategories s ON c.id = s.category_id
-- WHERE c.is_active = true
-- GROUP BY c.id, c.name
-- ORDER BY c.sort_order;
