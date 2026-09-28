/**
 * Introspects the live Supabase schema for the CMS tables.
 * Run: npx tsx scripts/introspect-schema.ts
 * Reads a single row per table to discover the real column names.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Minimal .env.local loader (no new dependency)
const envPath = join(process.cwd(), '.env.local');
const raw = readFileSync(envPath, 'utf8').replace(/^﻿/, '');
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const TABLES = [
  'pages',
  'menu_items',
  'departments',
  'blogs',
  'events',
  'hero_slides',
  'banners',
  'home_sections',
  'site_settings',
  'profiles',
];

async function main() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  for (const table of TABLES) {
    const { data, error, count } = await admin
      .from(table)
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log(`\n### ${table}\n  MISSING/ERROR: ${error.message}`);
      continue;
    }
    const cols = data && data.length > 0 ? Object.keys(data[0]) : ['(empty table - no columns discoverable)'];
    console.log(`\n### ${table}  (rows: ${count})`);
    console.log('  ' + cols.join(', '));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
