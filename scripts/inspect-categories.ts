/**
 * Read-only inspection of the category / subcategory tables before any repair.
 * Run: npx tsx scripts/inspect-categories.ts
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const raw = readFileSync(join(process.cwd(), '.env.local'), 'utf8').replace(/^﻿/, '');
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

const TARGETS = ['Adventure Jackets', 'Armoured Jackets', 'Waterproof Jackets', 'Mesh Jackets'];

async function main() {
  for (const table of ['categories', 'subcategories']) {
    const { data, error, count } = await db.from(table).select('*', { count: 'exact' }).limit(1);
    if (error) {
      console.log(`\n### ${table}: MISSING/ERROR — ${error.message}`);
      continue;
    }
    console.log(`\n### ${table} columns (rows: ${count})`);
    console.log('  ' + (data?.[0] ? Object.keys(data[0]).join(', ') : '(empty)'));
  }

  console.log('\n### categories rows');
  const { data: cats } = await db.from('categories').select('*').order('sort_order');
  for (const c of cats ?? []) {
    const r = c as Record<string, unknown>;
    console.log(
      `  ${String(r.name).padEnd(30)} slug=${String(r.slug).padEnd(28)} active=${r.is_active} sort=${r.sort_order} parent_id=${r.parent_id ?? '-'} id=${r.id}`
    );
  }

  // Is there a subcategories table, and how does it point at its parent?
  const { data: subs, error: subErr } = await db.from('subcategories').select('*').order('sort_order');
  if (!subErr) {
    console.log('\n### subcategories rows');
    for (const s of subs ?? []) {
      const r = s as Record<string, unknown>;
      console.log(
        `  ${String(r.name).padEnd(30)} slug=${String(r.slug).padEnd(28)} active=${r.is_active} sort=${r.sort_order} category_id=${r.category_id ?? '-'} id=${r.id}`
      );
    }
  }

  console.log('\n### where do the four target names live?');
  for (const name of TARGETS) {
    for (const table of ['categories', 'subcategories']) {
      const { data } = await db.from(table).select('*').eq('name', name);
      for (const row of data ?? []) {
        const r = row as Record<string, unknown>;
        console.log(`  "${name}" found in ${table}: id=${r.id} parent_id=${r.parent_id ?? '-'} category_id=${r.category_id ?? '-'} active=${r.is_active}`);
      }
      if (!data?.length) console.log(`  "${name}" NOT in ${table}`);
    }
  }

  console.log('\n### orphan check (rows whose parent reference points nowhere)');
  const catIds = new Set((cats ?? []).map((c) => (c as { id: string }).id));
  for (const c of cats ?? []) {
    const r = c as Record<string, unknown>;
    if (r.parent_id && !catIds.has(r.parent_id as string)) {
      console.log(`  ORPHAN category: ${r.name} -> missing parent ${r.parent_id}`);
    }
  }
  for (const s of subs ?? []) {
    const r = s as Record<string, unknown>;
    if (r.category_id && !catIds.has(r.category_id as string)) {
      console.log(`  ORPHAN subcategory: ${r.name} -> missing category ${r.category_id}`);
    }
  }
}

main().catch(console.error);
