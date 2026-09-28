import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
  console.log("Checking CMS tables...\n");

  try {
    // Test pages table
    console.log("Checking pages table...");
    const { error: testPagesError } = await supabase
      .from('pages')
      .select('id')
      .limit(1);

    if (testPagesError?.code === 'PGRST205') {
      console.log("❌ Pages table doesn't exist");
    } else {
      console.log("✓ Pages table exists");
    }

    // Test home_sections table
    console.log("Checking home_sections table...");
    const { error: testSectionsError } = await supabase
      .from('home_sections')
      .select('id')
      .limit(1);

    if (testSectionsError?.code === 'PGRST205') {
      console.log("❌ Home sections table doesn't exist");
    } else {
      console.log("✓ Home sections table exists");
    }

    // Test menu_items table
    console.log("Checking menu_items table...");
    const { error: testMenuError } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);

    if (testMenuError?.code === 'PGRST205') {
      console.log("❌ Menu items table doesn't exist");
    } else {
      console.log("✓ Menu items table exists");
    }

    console.log("\nTo create missing tables, run the SQL in SUPABASE_SETUP.sql");
  } catch (error) {
    console.error("Error:", error);
  }
}

checkTables();
