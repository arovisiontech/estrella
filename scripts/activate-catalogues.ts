import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function activateCatalogues() {
  console.log("Checking catalogue activation status...");

  // Get all catalogues
  const { data: allCatalogues, error: selectError } = await supabase
    .from("catalogues")
    .select("id, title, is_active");

  if (selectError) {
    console.error("Error fetching catalogues:", selectError);
    return;
  }

  console.log(`Found ${allCatalogues?.length || 0} total catalogues in database`);

  if (!allCatalogues || allCatalogues.length === 0) {
    console.log("No catalogues in database");
    return;
  }

  // Check how many are inactive
  const inactive = allCatalogues.filter(c => !c.is_active);
  console.log(`${inactive.length} catalogues are INACTIVE`);
  console.log(`${allCatalogues.length - inactive.length} catalogues are ACTIVE`);

  if (inactive.length > 0) {
    console.log("\nActivating inactive catalogues...");

    // Activate all inactive catalogues
    const { error: updateError } = await supabase
      .from("catalogues")
      .update({ is_active: true })
      .eq("is_active", false);

    if (updateError) {
      console.error("Error activating catalogues:", updateError);
    } else {
      console.log(`✓ Activated ${inactive.length} catalogues`);
    }
  } else {
    console.log("✓ All catalogues are already active!");
  }

  // Final count
  const { count, error: countError } = await supabase
    .from("catalogues")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (countError) {
    console.error("Error counting active catalogues:", countError);
  } else {
    console.log(`\n✓ Final active catalogue count: ${count}`);
  }
}

activateCatalogues().catch(console.error);
