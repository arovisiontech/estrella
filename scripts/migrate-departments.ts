import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const departmentsToMigrate = [
  {
    name: "Administration",
    slug: "administration",
    description: "Administration oversees strategic planning, operational management, and coordination of all department activities. They ensure smooth workflow and efficient resource allocation across the entire organization.",
    short_description: "Strategic planning and operational management",
    image_url: "/images/image 248.png",
    is_active: true,
    sort_order: 1,
    source_data: {
      galleryImages: ["/images/image 248.png"],
      original_id: "1",
    },
  },
  {
    name: "Materials & Sourcing",
    slug: "materials-sourcing",
    description: "Materials & Sourcing is responsible for identifying, evaluating, and procuring the finest leather, textiles, and hardware. They maintain relationships with global suppliers and ensure consistent quality standards.",
    short_description: "Premium material selection and supplier management",
    image_url: "/images/image 249.png",
    is_active: true,
    sort_order: 2,
    source_data: {
      galleryImages: ["/images/image 249.png"],
      original_id: "2",
    },
  },
  {
    name: "Cutting & Pattern Making",
    slug: "cutting-pattern-making",
    description: "Cutting & Pattern Making creates precise patterns and cuts materials to exact specifications. Using advanced CAD systems and traditional craftsmanship, they ensure zero waste and maximum product quality.",
    short_description: "Precision pattern design and material cutting",
    image_url: "/images/image 250.png",
    is_active: true,
    sort_order: 3,
    source_data: {
      galleryImages: ["/images/image 250.png"],
      original_id: "3",
    },
  },
  {
    name: "Production",
    slug: "production",
    description: "Production executes the assembly and manufacturing of all motorcycle gear products. Skilled craftspeople and modern machinery work together to bring designs to life with exceptional quality and attention to detail.",
    short_description: "Manufacturing and assembly of motorcycle gear",
    image_url: "/images/image 251.png",
    is_active: true,
    sort_order: 4,
    source_data: {
      galleryImages: ["/images/image 251.png"],
      original_id: "4",
    },
  },
  {
    name: "Embellishment",
    slug: "embellishment",
    description: "Embellishment adds custom branding, logos, and decorative elements to finished products. They specialize in embroidery, heat transfer, and detailed customization that meets individual client specifications.",
    short_description: "Design customization and logo application",
    image_url: "/images/image 252.png",
    is_active: true,
    sort_order: 5,
    source_data: {
      galleryImages: ["/images/image 252.png"],
      original_id: "5",
    },
  },
  {
    name: "Quality Control",
    slug: "quality-control",
    description: "Quality Control implements multi-stage inspection and testing protocols. Every product undergoes rigorous quality checks to ensure they meet international standards and customer expectations.",
    short_description: "Rigorous testing and quality assurance",
    image_url: "/images/Banner-3 2 - Copy.png",
    is_active: true,
    sort_order: 6,
    source_data: {
      galleryImages: ["/images/Banner-3 2 - Copy.png"],
      original_id: "6",
    },
  },
  {
    name: "Packing & Dispatching",
    slug: "packing-dispatching",
    description: "Packing & Dispatching ensures products are securely packaged and efficiently dispatched to customers worldwide. They manage warehousing, inventory, and coordinate with logistics partners for timely delivery.",
    short_description: "Secure packaging and logistics management",
    image_url: "/images/Banner-4 2 - Copy.png",
    is_active: true,
    sort_order: 7,
    source_data: {
      galleryImages: ["/images/Banner-4 2 - Copy.png"],
      original_id: "7",
    },
  },
  {
    name: "Research & Development",
    slug: "research-development",
    description: "Research & Development drives innovation through continuous improvement and new product development. They collaborate with designers, engineers, and suppliers to create next-generation motorcycle gear.",
    short_description: "Innovation in design and material technology",
    image_url: "/images/Banner-5 1 - Copy.png",
    is_active: true,
    sort_order: 8,
    source_data: {
      galleryImages: ["/images/Banner-5 1 - Copy.png"],
      original_id: "8",
    },
  },
];

async function migrateDepartments() {
  console.log("Starting departments migration...");

  // First, delete any existing departments
  console.log("Clearing existing departments...");
  const { error: deleteError } = await supabase
    .from("departments")
    .delete()
    .gte("sort_order", 0);

  if (deleteError) {
    console.error("Error deleting existing departments:", deleteError);
  }

  // Insert the 8 departments
  const { data: inserted, error: insertError } = await supabase
    .from("departments")
    .insert(departmentsToMigrate)
    .select("id");

  if (insertError) {
    console.error("Error migrating departments:", insertError);
  } else {
    console.log(`✓ Migrated ${inserted?.length || 0} departments`);
    inserted?.forEach((dept, idx) => {
      console.log(`  - Department ${idx + 1}: ${dept.id}`);
    });
  }

  // Verify final count
  const { count, error: countError } = await supabase
    .from("departments")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (countError) {
    console.error("Error counting departments:", countError);
  } else {
    console.log(`\n✓ Migration complete. Active departments in database: ${count}`);
  }
}

migrateDepartments().catch(console.error);
