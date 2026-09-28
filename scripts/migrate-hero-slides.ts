import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const heroSlidesToMigrate = [
  {
    video_url: "/videos/Motion Edits.mp4",
    image_url: null,
    mobile_image_url: null,
    title: "Premium Motorcycle Gear",
    eyebrow: "Experience Torque",
    description: null,
    button_text: null,
    button_url: null,
    text_position: "center",
    sort_order: 1,
    is_active: true,
  },
  {
    video_url: null,
    image_url: "/images/banner.png",
    mobile_image_url: "/images/banner.png",
    title: "Torque Collection",
    eyebrow: null,
    description: null,
    button_text: null,
    button_url: null,
    text_position: "center",
    sort_order: 2,
    is_active: true,
  },
  {
    video_url: null,
    image_url: "/images/banner.png",
    mobile_image_url: "/images/banner.png",
    title: "Explore Our Range",
    eyebrow: null,
    description: null,
    button_text: null,
    button_url: null,
    text_position: "center",
    sort_order: 3,
    is_active: true,
  },
];

async function migrateHeroSlides() {
  console.log("Starting hero slides migration...");

  // First, delete any existing hero slides to start fresh
  console.log("Clearing existing hero slides...");
  const { error: deleteError } = await supabase
    .from("hero_slides")
    .delete()
    .gte("sort_order", 0);

  if (deleteError) {
    console.error("Error deleting existing slides:", deleteError);
  }

  // Insert the 3 slides
  const { data: inserted, error: insertError } = await supabase
    .from("hero_slides")
    .insert(heroSlidesToMigrate)
    .select("id");

  if (insertError) {
    console.error("✗ Error migrating slides:", insertError);
  } else {
    console.log(`✓ Migrated ${inserted?.length || 0} hero slides`);
    inserted?.forEach((slide, idx) => {
      console.log(`  - Slide ${idx + 1}: ${slide.id}`);
    });
  }

  // Verify final count
  const { count, error: countError } = await supabase
    .from("hero_slides")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (countError) {
    console.error("Error counting slides:", countError);
  } else {
    console.log(`\n✓ Migration complete. Active slides in database: ${count}`);
  }
}

migrateHeroSlides().catch(console.error);
