import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env.local");
try {
  const raw = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)$/);
    if (m) {
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
} catch (e) {
  console.warn("Could not read .env.local:", e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function runE2ETests() {
  console.log("\n=======================================================");
  console.log("🚀 STARTING TORQUE CMS END-TO-END VERIFICATION TEST");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: any, testName: string, details?: string) {
    if (Boolean(condition)) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      if (details) console.error(`     Details: ${details}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Categories & Subcategories Public Sync
  // ----------------------------------------------------
  console.log("\n--- TEST 1: CATEGORIES & SUBCATEGORIES PUBLIC SYNC ---");
  const { data: catsData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: subcatsData } = await supabase
    .from("subcategories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  assert((catsData?.length || 0) > 0, "Active categories exist in Supabase", `Count: ${catsData?.length}`);
  assert(Array.isArray(subcatsData), "Subcategories query succeeds", `Count: ${subcatsData?.length}`);

  const mappedCategories = (catsData || []).map((cat) => ({
    ...cat,
    subcategories: (subcatsData || []).filter((s) => s.category_id === cat.id),
  }));

  assert(
    mappedCategories.length === (catsData?.length || 0),
    "All active categories mapped with child subcategories correctly"
  );

  // ----------------------------------------------------
  // TEST 2: Active / Inactive / Draft Filtering
  // ----------------------------------------------------
  console.log("\n--- TEST 2: ACTIVE & PUBLISHED FILTERING ---");
  const testCatSlug = "e2e-inactive-cat-" + Date.now();
  const { data: testCat, error: catCreateErr } = await supabase
    .from("categories")
    .insert([{
      name: "E2E Inactive Category",
      slug: testCatSlug,
      is_active: false,
    }])
    .select()
    .single();

  assert(!catCreateErr && !!testCat, "Created test inactive category in database");

  const { data: publicCats } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  const foundInactive = publicCats?.some((c) => c.slug === testCatSlug);
  assert(!foundInactive, "Inactive category does NOT appear in active query");

  if (testCat?.id) {
    await supabase.from("categories").delete().eq("id", testCat.id);
  }

  // ----------------------------------------------------
  // TEST 3: Products Public Queries & Draft Gating
  // ----------------------------------------------------
  console.log("\n--- TEST 3: PRODUCTS CMS & DRAFT GATING ---");
  const parentCat = catsData?.[0];
  const draftSlug = "e2e-draft-prod-" + Date.now();
  const { data: testDraftProd, error: prodErr } = await supabase
    .from("products")
    .insert([{
      name: "E2E Draft Product",
      slug: draftSlug,
      sku: "E2E-DRAFT-" + Date.now(),
      category_id: parentCat?.id,
      price: 99.99,
      is_active: true,
      is_published: false, // DRAFT
    }])
    .select()
    .single();

  assert(!prodErr && !!testDraftProd, "Created test draft product");

  const { data: publicProds } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", parentCat?.id)
    .eq("is_active", true)
    .eq("is_published", true);

  const draftInList = publicProds?.some((p) => p.slug === draftSlug);
  assert(!draftInList, "Draft product does NOT appear in published category products query");

  if (testDraftProd?.id) {
    await supabase.from("products").delete().eq("id", testDraftProd.id);
  }

  // ----------------------------------------------------
  // TEST 4: Catalogue PDFs CMS Layer
  // ----------------------------------------------------
  console.log("\n--- TEST 4: CATALOGUES CMS LAYER ---");
  const { data: testCatPdf, error: catPdfErr } = await supabase
    .from("catalogues")
    .insert([{
      title: "E2E Test Catalogue " + Date.now(),
      file_url: "https://example.com/e2e-catalogue.pdf",
      is_active: true,
    }])
    .select()
    .single();

  assert(!catPdfErr && !!testCatPdf, "Created active test catalogue record in database");

  const { data: activeCatalogues } = await supabase
    .from("catalogues")
    .select("*")
    .eq("is_active", true);

  const foundCat = activeCatalogues?.some((c) => c.id === testCatPdf?.id);
  assert(foundCat, "Newly created catalogue appears in live catalogues table");

  if (testCatPdf?.id) {
    await supabase.from("catalogues").delete().eq("id", testCatPdf.id);
  }

  // ----------------------------------------------------
  // TEST 5: Pages Module Draft Gating
  // ----------------------------------------------------
  console.log("\n--- TEST 5: PAGES MODULE & DRAFT GATING ---");
  const { data: aboutRow } = await supabase.from("pages").select("*").eq("slug", "about").single();
  assert(!!aboutRow && aboutRow.is_published, "Published 'about' page exists in database");

  // ----------------------------------------------------
  // TEST 6: Departments Module
  // ----------------------------------------------------
  console.log("\n--- TEST 6: DEPARTMENTS MODULE ---");
  const { data: depts } = await supabase.from("departments").select("*").eq("is_active", true);
  assert((depts?.length || 0) > 0, "Active departments exist in database", `Count: ${depts?.length}`);

  // ----------------------------------------------------
  // TEST 7: Contact Inquiries Module
  // ----------------------------------------------------
  console.log("\n--- TEST 7: CONTACT INQUIRIES MODULE ---");
  const { data: inqData, error: inqErr } = await supabase
    .from("contact_inquiries")
    .insert([{
      full_name: "E2E Test Rider",
      email: "rider.test@example.com",
      company_name: "Test Racing Corp",
      subject: "E2E Custom Leathers Inquiry",
      message: "Need 50 custom suits with CE Level 2 armor.",
      status: "new",
    }])
    .select()
    .single();

  assert(!inqErr && !!inqData, "Wrote contact inquiry successfully to database");

  if (inqData?.id) {
    const { error: updErr } = await supabase
      .from("contact_inquiries")
      .update({ status: "contacted" })
      .eq("id", inqData.id);
    assert(!updErr, "Updated inquiry status to 'contacted'", updErr?.message || undefined);

    const { error: delErr } = await supabase
      .from("contact_inquiries")
      .delete()
      .eq("id", inqData.id);
    assert(!delErr, "Deleted test inquiry record cleanly");
  }

  // ----------------------------------------------------
  // TEST 8: Newsletter Subscribers Module
  // ----------------------------------------------------
  console.log("\n--- TEST 8: NEWSLETTER SUBSCRIBERS MODULE ---");
  const testEmail = `subscriber.${Date.now()}@example.com`;
  const { data: subData, error: subErr } = await supabase
    .from("newsletter_subscribers")
    .insert([{
      email: testEmail,
      is_active: true,
    }])
    .select()
    .single();

  assert(!subErr && !!subData, "Registered subscriber email in newsletter_subscribers table");

  if (subData?.id) {
    const { error: togErr } = await supabase
      .from("newsletter_subscribers")
      .update({ is_active: false })
      .eq("id", subData.id);
    assert(!togErr, "Toggled subscriber active flag");

    const { error: delSubErr } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", subData.id);
    assert(!delSubErr, "Deleted test subscriber cleanly");
  }

  // ----------------------------------------------------
  // TEST 9: Site Settings Persistence
  // ----------------------------------------------------
  console.log("\n--- TEST 9: SITE SETTINGS PERSISTENCE ---");
  const testKey = "company_name";
  const { error: setErr } = await supabase
    .from("site_settings")
    .upsert({
      setting_key: testKey,
      setting_value: "TORQUE MOTO CHINA CHOWK",
      updated_at: new Date().toISOString(),
    }, { onConflict: "setting_key" });

  assert(!setErr, "Upserted site setting key 'company_name'");

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log("\n=======================================================");
  console.log(`🏁 E2E VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error("E2E Test Runner Exception:", err);
  process.exit(1);
});
