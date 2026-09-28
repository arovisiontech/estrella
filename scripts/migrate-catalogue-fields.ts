import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrateCatalogueFields() {
  console.log("Migrating catalogue fields from source_data to direct columns...");

  // Get all catalogues
  const { data: catalogues, error: selectError } = await supabase
    .from("catalogues")
    .select("*");

  if (selectError) {
    console.error("Error fetching catalogues:", selectError);
    return;
  }

  console.log(`Found ${catalogues?.length || 0} catalogues in database`);

  if (!catalogues || catalogues.length === 0) {
    console.log("No catalogues to migrate");
    return;
  }

  // For each catalogue, extract missing fields from source_data and populate direct columns
  for (const cat of catalogues) {
    const updates: any = {};
    let needsUpdate = false;

    // Populate cover_image_url if missing
    if (!cat.cover_image_url && cat.source_data?.coverImage) {
      updates.cover_image_url = cat.source_data.coverImage;
      needsUpdate = true;
      console.log(`  ${cat.title}: Setting cover_image_url from source_data`);
    }

    // Populate file_url if missing
    if (!cat.file_url && cat.source_data?.pdfUrl) {
      updates.file_url = cat.source_data.pdfUrl;
      needsUpdate = true;
      console.log(`  ${cat.title}: Setting file_url from source_data`);
    }

    // Populate sort_order if missing or 0
    if (!cat.sort_order && cat.source_data?.displayOrder) {
      updates.sort_order = cat.source_data.displayOrder;
      needsUpdate = true;
      console.log(`  ${cat.title}: Setting sort_order from source_data`);
    }

    // Ensure is_active is set
    if (cat.is_active === null || cat.is_active === undefined) {
      updates.is_active = true;
      needsUpdate = true;
      console.log(`  ${cat.title}: Setting is_active to true`);
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from("catalogues")
        .update(updates)
        .eq("id", cat.id);

      if (updateError) {
        console.error(`Error updating ${cat.title}:`, updateError);
      } else {
        console.log(`✓ Updated ${cat.title}`);
      }
    }
  }

  // Verify final state
  const { data: updated, error: verifyError } = await supabase
    .from("catalogues")
    .select("id, title, cover_image_url, file_url, is_active, sort_order")
    .eq("is_active", true);

  if (verifyError) {
    console.error("Error verifying:", verifyError);
  } else {
    console.log(`\n✓ Migration complete. ${updated?.length || 0} active catalogues:`);
    updated?.forEach((cat) => {
      console.log(`  - ${cat.title}`);
      console.log(`    cover_image_url: ${cat.cover_image_url ? '✓' : '✗'}`);
      console.log(`    file_url: ${cat.file_url ? '✓' : '✗'}`);
    });
  }
}

migrateCatalogueFields().catch(console.error);
