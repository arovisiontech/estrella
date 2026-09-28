-- Seed Script 3: Blogs, Events, Catalogues, Departments
-- Simple tables with no complex relationships
-- Safe: Uses INSERT ... ON CONFLICT on unique slug
-- All tables empty in live database, safe to bulk insert

-- ============================================
-- SEED: BLOGS (2 total)
-- ============================================

INSERT INTO public.blogs (id, title, slug, excerpt, content, image_url, author, published_at, read_time_minutes, is_published, is_featured, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'The Technology Behind High-Performance Motorcycles',
    'technology-behind-high-performance-motorcycles',
    'Discover the engineering innovations that power modern high-performance motorcycles and how they deliver exceptional speed and handling.',
    '# The Technology Behind High-Performance Motorcycles

High-performance motorcycles represent the pinnacle of engineering excellence. From advanced engine designs to cutting-edge materials, every component is optimized for maximum performance.

## Engine Technology

Modern motorcycle engines utilize advanced fuel injection systems, variable valve timing, and lightweight titanium components to achieve incredible power outputs while maintaining reliability.

## Aerodynamic Design

The aerodynamic profiles of racing motorcycles are meticulously crafted to reduce drag and improve stability at high speeds. Every curve and angle serves a purpose.

## Suspension Systems

Contemporary suspension systems use adaptive damping technology that adjusts in real-time to road conditions, providing superior handling and comfort.

## Materials Innovation

The shift to carbon fiber and aluminum alloys has reduced weight while increasing rigidity, fundamental to achieving better performance metrics.

## Braking Technology

Advanced ceramic brake systems provide consistent performance and shorter stopping distances, critical for safety at high speeds.

The continuous evolution of motorcycle technology ensures that riders can experience the ultimate combination of power, precision, and control.',
    '/images/Rectangle 557.png',
    'Torque Engineering Team',
    '2026-07-28'::timestamp with time zone,
    5,
    true,
    false,
    '2026-07-28'::timestamp with time zone,
    '2026-07-28'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    'Motorcycle Gear Innovation: Safety Meets Style',
    'motorcycle-gear-innovation-safety-meets-style',
    'Explore the latest innovations in protective motorcycle gear that combine advanced safety features with contemporary design.',
    '# Motorcycle Gear Innovation: Safety Meets Style

Modern motorcycle protective gear has evolved far beyond basic protection. Today''s gear combines cutting-edge materials with sophisticated design to provide riders with both safety and style.

## Material Science

Innovative textiles and composites now offer superior abrasion resistance, water resistance, and breathability. Materials like CORDURA and advanced neoprene provide multiple layers of protection.

## Impact Protection

Modern armor systems use non-Newtonian materials that remain flexible during normal movement but harden instantly upon impact, providing maximum protection without sacrificing comfort.

## Thermal Management

Ventilation systems in modern jackets and gear keep riders cool in summer while providing insulation in cold weather conditions. Mesh panels and strategic venting optimize airflow.

## Design Philosophy

Contemporary gear emphasizes sleek, urban aesthetics that work both on and off the bike. Designers now focus on creating protective equipment that riders want to wear.

## Technology Integration

Some premium gear now includes integrated communication systems, GPS tracking, and smart heating elements, bringing motorcycling into the digital age.

## Durability Standards

Modern manufacturing processes ensure that protective gear maintains its integrity over years of use, with reinforced seams and premium construction throughout.

The future of motorcycle gear is about seamless integration of protection, performance, and personal style.',
    '/images/Rectangle 558.png',
    'Torque Design Team',
    '2026-07-25'::timestamp with time zone,
    6,
    true,
    false,
    '2026-07-25'::timestamp with time zone,
    '2026-07-25'::timestamp with time zone
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: EVENTS (6 total)
-- ============================================

INSERT INTO public.events (id, title, slug, start_date, end_date, location, description, short_description, image_url, status, category, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'TORQUE Pro Gear Exhibition 2026',
    'torque-pro-gear-exhibition-2026',
    '2026-06-15'::timestamp with time zone,
    '2026-06-17'::timestamp with time zone,
    'Lahore Convention Center, Lahore, Pakistan',
    'Join us for an exclusive showcase of TORQUE''s premium motorcycle gear collection. Experience cutting-edge designs, advanced materials, and innovative protective equipment. Meet our team, try products, and enjoy special exhibition discounts.',
    'Explore our latest collection of premium motorcycle gear and protective equipment.',
    '/images/Banner-3 2 - Copy.png',
    'recent',
    'Exhibition',
    '2026-05-01'::timestamp with time zone,
    '2026-05-01'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    'Summer Rider Experience Tour',
    'summer-rider-experience-tour',
    '2026-05-20'::timestamp with time zone,
    '2026-05-22'::timestamp with time zone,
    'Karachi Sports Complex, Karachi, Pakistan',
    'Experience TORQUE''s commitment to rider safety and comfort. Our Summer Rider Experience Tour brings premium motorcycle gear, expert consultations, and hands-on product demonstrations to your city. Meet fellow riders and learn about the latest innovations in motorcycle protection.',
    'Join our traveling motorcycle gear and safety demonstration tour across major cities.',
    '/images/Banner-4 2 - Copy.png',
    'recent',
    'Community Event',
    '2026-04-15'::timestamp with time zone,
    '2026-04-15'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    'New Winter Collection Launch',
    'new-winter-collection-launch',
    '2026-10-01'::timestamp with time zone,
    '2026-10-01'::timestamp with time zone,
    'TORQUE Headquarters, Lahore, Pakistan',
    'Discover our new Winter Collection featuring advanced thermal insulation, weatherproof materials, and enhanced ergonomic designs. Perfect for cold-weather riding, these products combine safety, comfort, and style. Exclusive pre-launch discounts available for early adopters.',
    'Introducing TORQUE''s premium winter motorcycle gear collection designed for extreme conditions.',
    '/images/Banner-5 1 - Copy.png',
    'upcoming',
    'Product Launch',
    '2026-06-01'::timestamp with time zone,
    '2026-06-01'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    'Manufacturing Facility Open House',
    'manufacturing-facility-open-house',
    '2026-09-10'::timestamp with time zone,
    NULL,
    'TORQUE Manufacturing Plant, Lahore, Pakistan',
    'Take a comprehensive tour of TORQUE''s advanced manufacturing facility. See our cutting-edge machinery, meet our skilled craftspeople, and learn about our commitment to quality, sustainability, and innovation in motorcycle gear production.',
    'Tour our state-of-the-art manufacturing facility and witness motorcycle gear production firsthand.',
    '/images/image 248.png',
    'upcoming',
    'Manufacturing',
    '2026-05-20'::timestamp with time zone,
    '2026-05-20'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    'Asia Motorcycle Summit 2026',
    'asia-motorcycle-summit-2026',
    '2026-11-15'::timestamp with time zone,
    '2026-11-17'::timestamp with time zone,
    'Dubai Convention Center, UAE',
    'TORQUE presents at Asia''s largest motorcycle industry summit featuring keynotes on safety innovation, sustainable manufacturing, and market trends. Network with global brands, explore partnerships, and stay ahead of industry developments.',
    'Join industry leaders at the premier conference for motorcycle manufacturers and safety innovators.',
    '/images/image 249.png',
    'upcoming',
    'Conference',
    '2026-06-10'::timestamp with time zone,
    '2026-06-10'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    'International Motorcycle Show',
    'international-motorcycle-show',
    '2026-08-05'::timestamp with time zone,
    '2026-08-07'::timestamp with time zone,
    'Expo Center, Islamabad, Pakistan',
    'The International Motorcycle Show showcases the latest innovations in motorcycle design and safety equipment. TORQUE exhibits our latest protective gear collections alongside premium motorcycles from leading manufacturers.',
    'Experience cutting-edge motorcycle designs and premium safety gear from global manufacturers.',
    '/images/image 250.png',
    'upcoming',
    'Motorcycle Show',
    '2026-05-15'::timestamp with time zone,
    '2026-05-15'::timestamp with time zone
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: CATALOGUES (6 total)
-- ============================================

INSERT INTO public.catalogues (id, name, slug, description, pdf_url, cover_image_url, published_date, file_size_mb, is_active, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Leather Jackets Collection 2024',
    'leather-jackets-2024',
    'Premium leather jackets designed for ultimate protection and style. Browse our latest collection of motorcycle leather apparel.',
    '/catalogues/leather-jackets-2024.pdf',
    '/images/Banner-3 2 - Copy.png',
    '2024-01-15'::date,
    12.5,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Motorbike Jackets Premium Line',
    'motorbike-jackets-2024',
    'High-performance motorbike jackets with advanced safety features and ergonomic design.',
    '/catalogues/motorbike-jackets-2024.pdf',
    '/images/Banner-4 2 - Copy.png',
    '2024-02-10'::date,
    15.2,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Touring Jackets Collection',
    'touring-jackets-2024',
    'Built for long-distance comfort and protection. Our touring jackets combine style with functionality.',
    '/catalogues/touring-jackets-2024.pdf',
    '/images/Banner-5 1 - Copy.png',
    '2024-01-20'::date,
    13.8,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Premium Gloves Collection',
    'gloves-summer-winter-2024',
    'Complete range of summer and winter motorcycle gloves with superior grip and protection.',
    '/catalogues/gloves-2024.pdf',
    '/images/image 249.png',
    '2024-03-05'::date,
    9.5,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Textile Trousers Premium Range',
    'textile-trousers-2024',
    'Durable and comfortable textile trousers designed for all-season riding.',
    '/catalogues/textile-trousers-2024.pdf',
    '/images/image 250.png',
    '2024-02-28'::date,
    8.2,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Rain Gear Collection',
    'rain-gear-2024',
    'Waterproof and weather-resistant gear for wet weather riding.',
    '/catalogues/rain-gear-2024.pdf',
    '/images/image 251.png',
    '2024-03-15'::date,
    7.5,
    true,
    now(),
    now()
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED: DEPARTMENTS (8 total)
-- ============================================

INSERT INTO public.departments (id, name, slug, description, image_url, sort_order, is_active, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Administration',
    'administration',
    'Administration oversees strategic planning, operational management, and coordination of all department activities. They ensure smooth workflow and efficient resource allocation across the entire organization.',
    '/images/image 248.png',
    1,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Materials & Sourcing',
    'materials-sourcing',
    'Materials & Sourcing is responsible for identifying, evaluating, and procuring the finest leather, textiles, and hardware. They maintain relationships with global suppliers and ensure consistent quality standards.',
    '/images/image 249.png',
    2,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Cutting & Pattern Making',
    'cutting-pattern-making',
    'Cutting & Pattern Making creates precise patterns and cuts materials to exact specifications. Using advanced CAD systems and traditional craftsmanship, they ensure zero waste and maximum product quality.',
    '/images/image 250.png',
    3,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Production',
    'production',
    'Production executes the assembly and manufacturing of all motorcycle gear products. Skilled craftspeople and modern machinery work together to bring designs to life with exceptional quality and attention to detail.',
    '/images/image 251.png',
    4,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Embellishment',
    'embellishment',
    'Embellishment adds custom branding, logos, and decorative elements to finished products. They specialize in embroidery, heat transfer, and detailed customization that meets individual client specifications.',
    '/images/image 252.png',
    5,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Quality Control',
    'quality-control',
    'Quality Control implements multi-stage inspection and testing protocols. Every product undergoes rigorous quality checks to ensure they meet international standards and customer expectations.',
    '/images/Banner-3 2 - Copy.png',
    6,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Packing & Dispatching',
    'packing-dispatching',
    'Packing & Dispatching ensures products are securely packaged and efficiently dispatched to customers worldwide. They manage warehousing, inventory, and coordinate with logistics partners for timely delivery.',
    '/images/Banner-4 2 - Copy.png',
    7,
    true,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Research & Development',
    'research-development',
    'Research & Development drives innovation through continuous improvement and new product development. They collaborate with designers, engineers, and suppliers to create next-generation motorcycle gear.',
    '/images/Banner-5 1 - Copy.png',
    8,
    true,
    now(),
    now()
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- SELECT COUNT(*) as blog_count FROM public.blogs WHERE is_published = true;
-- Expected: 2

-- SELECT COUNT(*) as event_count FROM public.events;
-- Expected: 6

-- SELECT COUNT(*) as catalogue_count FROM public.catalogues WHERE is_active = true;
-- Expected: 6

-- SELECT COUNT(*) as department_count FROM public.departments WHERE is_active = true;
-- Expected: 8
