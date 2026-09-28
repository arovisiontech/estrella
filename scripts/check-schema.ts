import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkSchema() {
  // Try to get departments schema
  const { data: deptData, error: deptError } = await supabase
    .from("departments")
    .select("*")
    .limit(1);
  
  console.log("Departments error (if table missing):", deptError?.message);
  console.log("Departments sample:", deptData?.[0]);

  // Check what columns exist by looking at actual data
  if (deptData && deptData.length > 0) {
    console.log("\nDepartment columns:", Object.keys(deptData[0]));
  }

  // Try site_settings
  const { data: settingsData } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1);
  
  if (settingsData && settingsData.length > 0) {
    console.log("Settings columns:", Object.keys(settingsData[0]));
  }
}

checkSchema().catch(console.error);
