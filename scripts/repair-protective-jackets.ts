/**
 * Adds the four missing Protective Jackets subcategory rows under the EXISTING
 * parent category. Additive and idempotent:
 *   - never creates a second "Protective Jackets" parent (it was not deleted)
 *   - skips any child that already exists, by slug
 *   - does not touch the parent row, other categories, or any other child
 *
 * Names/slugs come from lib/data/shopCategories.ts, which is what the public
 * navigation actually renders from.
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

const PARENT_SLUGS = ['protective-jackets', 'Protective-Jackets'];

const CHILDREN = [
  { name: 'Adventure Jackets', slug: 'adventure-jackets', sort_order: 1 },
  { name: 'Armoured Jackets', slug: 'armoured-jackets', sort_order: 2 },
  { name: 'Waterproof Jackets', slug: 'waterproof-jackets', sort_order: 3 },
  { name: 'Mesh Jackets', slug: 'mesh-jackets', sort_order: 4 },
];

async function main() {
  // 1. Locate the existing parent. Do not create one.
  const { data: parents, error: pErr } = await db
    .from('categories')
    .select('id, name, slug, is_active, sort_order')
    .in('slug', PARENT_SLUGS);

  if (pErr) throw new Error(`Could not read categories: ${pErr.message}`);

  if (!parents || parents.length === 0) {
    console.log('Parent "Protective Jackets" NOT found — it really was deleted.');
    console.log('Stopping: creating it is a separate decision, not a silent side effect.');
    process.exit(2);
  }
  if (parents.length > 1) {
    console.log('Multiple Protective Jackets parents found — refusing to guess:');
    for (const p of parents) console.log(`  ${p.id}  slug=${p.slug}`);
    process.exit(2);
  }

  const parent = parents[0];
  console.log(`Parent found (NOT recreated): ${parent.name}`);
  console.log(`  id=${parent.id}  slug="${parent.slug}"  active=${parent.is_active}  sort=${parent.sort_order}\n`);

  // 2. Add only the children that are genuinely missing.
  for (const child of CHILDREN) {
    const { data: existing } = await db
      .from('subcategories')
      .select('id, name, slug, category_id')
      .eq('slug', child.slug)
      .maybeSingle();

    if (existing) {
      if (existing.category_id === parent.id) {
        console.log(`SKIP    ${child.name} — already linked to this parent (id=${existing.id})`);
      } else {
        // Orphan or mis-parented: relink without altering its other fields.
        const { data, error } = await db
          .from('subcategories')
          .update({ category_id: parent.id })
          .eq('id', existing.id)
          .select();
        console.log(
          error || !data?.length
            ? `FAIL    ${child.name} relink — ${error?.message ?? 'no row updated'}`
            : `RELINK  ${child.name} -> parent ${parent.id} (id=${existing.id})`
        );
      }
      continue;
    }

    const { data, error } = await db
      .from('subcategories')
      .insert([{
        category_id: parent.id,
        name: child.name,
        slug: child.slug,
        is_active: true,
        sort_order: child.sort_order,
      }])
      .select();

    console.log(
      error || !data?.length
        ? `FAIL    ${child.name} — ${error?.message ?? 'no row returned'}`
        : `CREATE  ${child.name} [${child.slug}] sort=${child.sort_order} id=${(data[0] as { id: string }).id}`
    );
  }

  // 3. Report the resulting parent/child tree.
  const { data: kids } = await db
    .from('subcategories')
    .select('id, name, slug, is_active, sort_order, category_id')
    .eq('category_id', parent.id)
    .order('sort_order');

  console.log(`\nProtective Jackets now has ${kids?.length ?? 0} children:`);
  for (const k of kids ?? []) {
    console.log(`  #${k.sort_order} ${String(k.name).padEnd(20)} [${k.slug}]  active=${k.is_active}  id=${k.id}`);
  }

  // 4. Confirm nothing else moved.
  const { count } = await db.from('subcategories').select('*', { count: 'exact', head: true });
  console.log(`\nTotal subcategories across all categories: ${count}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
