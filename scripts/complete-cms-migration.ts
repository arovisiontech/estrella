import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL .env.local mein nahi mili."
  );
  process.exit(1);
}

if (!SUPABASE_SECRET_KEY) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY .env.local mein nahi mili."
  );
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ============= PAGES DATA =============
const pagesData = [
  {
    slug: "about",
    title: "About Us",
    description: "Learn about Torque Motorsports",
    meta_title: "About Us | Torque Motorsports",
    meta_description: "Learn about Torque Motorsports and our commitment to quality motorcycle gear",
    is_published: true,
    source_data: {
      heroTitle: "About Torque",
      heroDescription: "Trusted manufacturer of high-performance motorcycle gear",
    },
  },
  {
    slug: "history",
    title: "History",
    description: "Our journey through four decades",
    meta_title: "History | Torque Motorsports",
    meta_description: "The Torque journey: four decades of craftsmanship, innovation and motorcycle apparel manufacturing",
    is_published: true,
    source_data: {
      heroTitle: "Our History",
      timeline: true,
    },
  },
  {
    slug: "csr",
    title: "CSR",
    description: "Corporate Social Responsibility",
    meta_title: "CSR | Torque Motorsports",
    meta_description: "Our commitment to corporate social responsibility and sustainable business practices",
    is_published: true,
    source_data: {
      heroTitle: "Our CSR Commitment",
      pillars: true,
    },
  },
  {
    slug: "quality",
    title: "Quality",
    description: "Quality assurance and standards",
    meta_title: "Quality | Torque Motorsports",
    meta_description: "Our quality assurance processes and manufacturing standards",
    is_published: true,
    source_data: {
      heroTitle: "Quality Standards",
    },
  },
  {
    slug: "compliance",
    title: "Compliance",
    description: "Compliance and certifications",
    meta_title: "Compliance | Torque Motorsports",
    meta_description: "Our compliance with international standards and certifications",
    is_published: true,
    source_data: {
      heroTitle: "Compliance & Certifications",
    },
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Get in touch with us",
    meta_title: "Contact Us | Torque Motorsports",
    meta_description: "Contact Torque Motorsports for inquiries and support",
    is_published: true,
    source_data: {
      heroTitle: "Contact Torque",
    },
  },
];

// ============= HOMEPAGE SECTIONS DATA =============
const homeSectionsData = [
  {
    section_key: "hero",
    title: "Hero Slides",
    component_type: "hero",
    is_visible: true,
    sort_order: 1,
  },
  {
    section_key: "featured-products",
    title: "Featured Products",
    component_type: "featured-products",
    is_visible: true,
    sort_order: 2,
  },
  {
    section_key: "crafting-protection",
    title: "Crafting Protection",
    component_type: "crafting-protection",
    is_visible: true,
    sort_order: 3,
  },
  {
    section_key: "category-collections",
    title: "Category Collections",
    component_type: "category-collections",
    is_visible: true,
    sort_order: 4,
  },
  {
    section_key: "what-we-do",
    title: "What We Do",
    component_type: "what-we-do",
    is_visible: true,
    sort_order: 5,
  },
  {
    section_key: "latest-blogs",
    title: "Latest Blogs",
    component_type: "latest-blogs",
    is_visible: true,
    sort_order: 6,
  },
];

// ============= MENUS DATA =============
const menuItemsData = [
  // Header Navigation
  { menu_type: "header", label: "HOME", href: "/", sort_order: 1, is_active: true },
  { menu_type: "header", label: "ABOUT US", href: "/about", sort_order: 2, is_active: true },
  { menu_type: "header", label: "PRODUCTS", href: null, sort_order: 3, is_active: true },
  { menu_type: "header", label: "CATALOGUE", href: "/catalogue", sort_order: 4, is_active: true },
  { menu_type: "header", label: "DEPARTMENTS", href: "/departments", sort_order: 5, is_active: true },
  { menu_type: "header", label: "EVENTS", href: "/events", sort_order: 6, is_active: true },
  { menu_type: "header", label: "CONTACT US", href: "/contact", sort_order: 7, is_active: true },

  // Footer Quick Links
  { menu_type: "footer_quick", label: "About Us", href: "/about", sort_order: 1, is_active: true },
  { menu_type: "footer_quick", label: "History", href: "/history", sort_order: 2, is_active: true },
  { menu_type: "footer_quick", label: "CSR", href: "/csr", sort_order: 3, is_active: true },
  { menu_type: "footer_quick", label: "Compliance", href: "/compliance", sort_order: 4, is_active: true },
  { menu_type: "footer_quick", label: "News", href: "/news", sort_order: 5, is_active: true },
  { menu_type: "footer_quick", label: "Quality", href: "/quality", sort_order: 6, is_active: true },

  // Footer Product Links
  { menu_type: "footer_products", label: "Leather Jackets", href: "/categories/protective-jackets", sort_order: 1, is_active: true },
  { menu_type: "footer_products", label: "Motorbike Jackets", href: "/categories/motorbike-leather-jackets", sort_order: 2, is_active: true },
  { menu_type: "footer_products", label: "Touring Jackets", href: "/categories/touring-jacket", sort_order: 3, is_active: true },
  { menu_type: "footer_products", label: "Summer Gloves", href: "/categories/street-summer-gloves", sort_order: 4, is_active: true },
  { menu_type: "footer_products", label: "Winter Gloves", href: "/categories/winter-gloves", sort_order: 5, is_active: true },
  { menu_type: "footer_products", label: "Textile Trousers", href: "/categories/textile-trousers", sort_order: 6, is_active: true },
];

// ============= DEPARTMENTS DATA =============
const departmentsData = [
  {
    name: "Administration",
    slug: "administration",
    description: "Administration oversees strategic planning, operational management, and coordination of all department activities.",
    short_description: "Strategic planning and operational management",
    image_url: "/images/image 248.png",
    is_active: true,
    sort_order: 1,
  },
  {
    name: "Materials & Sourcing",
    slug: "materials-sourcing",
    description: "Materials & Sourcing is responsible for identifying, evaluating, and procuring the finest leather, textiles, and hardware.",
    short_description: "Premium material selection and supplier management",
    image_url: "/images/image 249.png",
    is_active: true,
    sort_order: 2,
  },
  {
    name: "Cutting & Pattern Making",
    slug: "cutting-pattern-making",
    description: "Cutting & Pattern Making creates precise patterns and cuts materials to exact specifications.",
    short_description: "Precision pattern design and material cutting",
    image_url: "/images/image 250.png",
    is_active: true,
    sort_order: 3,
  },
  {
    name: "Production",
    slug: "production",
    description: "Production executes the assembly and manufacturing of all motorcycle gear products.",
    short_description: "Manufacturing and assembly of motorcycle gear",
    image_url: "/images/image 251.png",
    is_active: true,
    sort_order: 4,
  },
  {
    name: "Embellishment",
    slug: "embellishment",
    description: "Embellishment adds custom branding, logos, and decorative elements to finished products.",
    short_description: "Design customization and logo application",
    image_url: "/images/image 252.png",
    is_active: true,
    sort_order: 5,
  },
  {
    name: "Quality Control",
    slug: "quality-control",
    description: "Quality Control implements multi-stage inspection and testing protocols.",
    short_description: "Rigorous testing and quality assurance",
    image_url: "/images/Banner-3 2 - Copy.png",
    is_active: true,
    sort_order: 6,
  },
  {
    name: "Packing & Dispatching",
    slug: "packing-dispatching",
    description: "Packing & Dispatching ensures products are securely packaged and efficiently dispatched.",
    short_description: "Secure packaging and logistics management",
    image_url: "/images/Banner-4 2 - Copy.png",
    is_active: true,
    sort_order: 7,
  },
  {
    name: "Research & Development",
    slug: "research-development",
    description: "Research & Development drives innovation through continuous improvement and new product development.",
    short_description: "Innovation in design and material technology",
    image_url: "/images/Banner-5 1 - Copy.png",
    is_active: true,
    sort_order: 8,
  },
];

// ============= SITE SETTINGS DATA =============
const siteSettingsData = [
  { key: "company_name", value: "TORQUE MOTO CHINA CHOWK" },
  { key: "email", value: "Info@Torque-Moto.Com" },
  { key: "phone", value: "+92-523-561460" },
  { key: "address", value: "Sialkot 51310 - Pakistan" },
  { key: "footer_text", value: "Building quality motorcycle apparel since 1982." },
  { key: "seo_title", value: "Torque Motorsports | Premium Motorcycle Gear" },
  { key: "seo_description", value: "Premium motorcycle jackets, gloves, and protective gear manufactured in Pakistan." },
];

// ============= MIGRATION FUNCTIONS =============

async function migratePages() {
  console.log("Migrating pages...");

  const { error: deleteError } = await supabase
    .from("pages")
    .delete()
    .gte("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError && deleteError.code !== "PGRST116") {
    console.error("Error clearing pages:", deleteError);
  }

  const { data, error } = await supabase
    .from("pages")
    .insert(pagesData)
    .select("id");

  if (error) {
    console.error("Error migrating pages:", error);
  } else {
    console.log(`✓ Migrated ${data?.length || 0} pages`);
  }
}

async function migrateHomeSections() {
  console.log("Migrating homepage sections...");

  const { error: deleteError } = await supabase
    .from("home_sections")
    .delete()
    .gte("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError && deleteError.code !== "PGRST116") {
    console.error("Error clearing sections:", deleteError);
  }

  const { data, error } = await supabase
    .from("home_sections")
    .insert(homeSectionsData)
    .select("id");

  if (error) {
    console.error("Error migrating sections:", error);
  } else {
    console.log(`✓ Migrated ${data?.length || 0} homepage sections`);
  }
}

async function migrateMenuItems() {
  console.log("Migrating menu items...");

  const { error: deleteError } = await supabase
    .from("menu_items")
    .delete()
    .gte("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError && deleteError.code !== "PGRST116") {
    console.error("Error clearing menus:", deleteError);
  }

  const { data, error } = await supabase
    .from("menu_items")
    .insert(menuItemsData)
    .select("id");

  if (error) {
    console.error("Error migrating menu items:", error);
  } else {
    console.log(`✓ Migrated ${data?.length || 0} menu items`);
  }
}

async function migrateDepartments() {
  console.log("Migrating departments...");

  const { error: deleteError } = await supabase
    .from("departments")
    .delete()
    .gte("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError && deleteError.code !== "PGRST116") {
    console.error("Error clearing departments:", deleteError);
  }

  const { data, error } = await supabase
    .from("departments")
    .insert(departmentsData)
    .select("id");

  if (error) {
    console.error("Error migrating departments:", error);
  } else {
    console.log(`✓ Migrated ${data?.length || 0} departments`);
  }
}

async function migrateSiteSettings() {
  console.log("Migrating site settings...");

  let migrated = 0;

  for (const setting of siteSettingsData) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        {
          setting_key: setting.key,
          setting_value: setting.value,
        },
        {
          onConflict: "setting_key",
        }
      );

    if (error) {
      console.log(`✓ Migrated ${siteSettingsData.length} site settings`);
    } else {
      migrated++;
    }
  }

  console.log(`✓ Migrated ${migrated} site settings`);
}

async function verifyCounts() {
  console.log("\n=== VERIFICATION ===");

  const { count: pageCount } = await supabase
    .from("pages")
    .select("id", { count: "exact", head: true });

  const { count: sectionCount } = await supabase
    .from("home_sections")
    .select("id", { count: "exact", head: true });

  const { count: menuCount } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true });

  const { count: deptCount } = await supabase
    .from("departments")
    .select("id", { count: "exact", head: true });

  const { count: blogCount } = await supabase
    .from("blogs")
    .select("id", { count: "exact", head: true });

  console.log(`Pages: ${pageCount}`);
  console.log(`Homepage Sections: ${sectionCount}`);
  console.log(`Menu Items: ${menuCount}`);
  console.log(`Departments: ${deptCount}`);
  console.log(`Blogs: ${blogCount}`);
}

async function runMigration() {
  try {
    console.log("Starting complete CMS migration...\n");

    await migratePages();
    await migrateHomeSections();
    await migrateMenuItems();
    await migrateDepartments();
    await migrateSiteSettings();

    await verifyCounts();

    console.log("\n✓ Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

runMigration();
