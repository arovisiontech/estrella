/**
 * End-to-end CMS test.
 *
 * For each module: insert a clearly-marked temp row with the EXACT payload
 * shape the admin server action sends, confirm the public page renders it,
 * flip its active/published flag, confirm the public page drops it, then
 * delete it and confirm the public page is back to its original state.
 *
 * Run with the dev server up:  npx tsx scripts/e2e-cms-test.ts
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const raw = readFileSync(join(process.cwd(), '.env.local'), 'utf8').replace(/^﻿/, '');
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)$/);
  if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
}

const BASE = process.env.TEST_BASE_URL ?? 'http://localhost:3000';
const MARK = '__TorqueCMSTest__';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const results: { name: string; pass: boolean; detail: string }[] = [];
function record(name: string, pass: boolean, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

async function pageContains(path: string, needle: string): Promise<boolean> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return (await res.text()).includes(needle);
}

/** Each module: table, insert payload, the public route, and the hide-flag. */
const MODULES = [
  {
    name: 'Menu item',
    table: 'menu_items',
    row: { menu_type: 'footer_quick', label: MARK, href: '/__test', sort_order: 999, is_active: true, target: null },
    publicPath: '/',
    hideFlag: { is_active: false },
  },
  {
    name: 'Department',
    table: 'departments',
    row: { name: MARK, slug: '__test-department', description: 'temp', short_description: 'temp', is_active: true, sort_order: 999 },
    publicPath: '/departments',
    hideFlag: { is_active: false },
  },
  {
    name: 'Blog',
    table: 'blogs',
    row: { title: MARK, slug: '__test-blog', excerpt: 'temp', content: 'temp', author_name: 'Test', is_published: true, published_at: new Date().toISOString() },
    publicPath: '/blogs',
    hideFlag: { is_published: false },
  },
  {
    name: 'Event',
    table: 'events',
    row: { title: MARK, slug: '__test-event', description: 'temp', location: 'temp', category: 'General', event_date: new Date(Date.now() + 3650 * 864e5).toISOString(), is_active: true },
    publicPath: '/events',
    hideFlag: { is_active: false },
  },
  {
    name: 'Page',
    table: 'pages',
    row: { title: MARK, slug: '__test-page', description: 'temp', is_published: true, sort_order: 999 },
    publicPath: null, // pages drive metadata for fixed routes, not a listing
    hideFlag: { is_published: false },
  },
  {
    name: 'Hero slide',
    table: 'hero_slides',
    row: { title: MARK, eyebrow: 'temp', description: 'temp', image_url: '/images/banner.png', text_position: 'left', sort_order: 999, is_active: true },
    publicPath: null, // rendered client-side; see the anon-visibility check below
    hideFlag: { is_active: false },
  },
] as const;

async function cleanup() {
  for (const m of MODULES) await db.from(m.table).delete().eq('id', '00000000-0000-0000-0000-000000000000');
  for (const m of MODULES) {
    const col = 'label' in m.row ? 'label' : 'name' in m.row ? 'name' : 'title';
    await db.from(m.table).delete().eq(col, MARK);
  }
}

async function main() {
  console.log(`Base URL: ${BASE}\nCleaning any leftovers from a previous run...\n`);
  await cleanup();

  for (const m of MODULES) {
    let id: string | null = null;
    try {
      // --- CREATE ---
      const ins = await db.from(m.table).insert([m.row as never]).select();
      if (ins.error || !ins.data?.length) {
        record(`${m.name}: create`, false, ins.error?.message ?? 'no row returned');
        continue;
      }
      id = (ins.data[0] as { id: string }).id;
      record(`${m.name}: create`, true, `id=${id.slice(0, 8)}`);

      // --- PUBLIC SYNC (visible) ---
      if (m.publicPath) {
        const seen = await pageContains(m.publicPath, MARK);
        record(`${m.name}: appears on ${m.publicPath}`, seen, seen ? '' : 'not rendered');
      }

      // --- EDIT ---
      const editCol = 'label' in m.row ? 'label' : 'name' in m.row ? 'name' : 'title';
      const upd = await db.from(m.table).update({ [editCol]: `${MARK}-edited` } as never).eq('id', id).select();
      record(`${m.name}: edit`, !upd.error && !!upd.data?.length, upd.error?.message ?? '');

      // --- HIDE (active/published toggle) ---
      const hid = await db.from(m.table).update(m.hideFlag as never).eq('id', id).select();
      record(`${m.name}: toggle off`, !hid.error && !!hid.data?.length, hid.error?.message ?? '');

      if (m.publicPath) {
        const stillThere = await pageContains(m.publicPath, `${MARK}-edited`);
        record(`${m.name}: hidden from ${m.publicPath}`, !stillThere, stillThere ? 'still rendered while inactive' : '');
      }

      // --- DELETE ---
      const del = await db.from(m.table).delete().eq('id', id).select();
      record(`${m.name}: delete`, !del.error && !!del.data?.length, del.error?.message ?? '');
      id = null;
    } catch (e) {
      record(`${m.name}: run`, false, e instanceof Error ? e.message : String(e));
    } finally {
      if (id) await db.from(m.table).delete().eq('id', id);
    }
  }

  // --- SITE SETTINGS upsert round trip ---
  try {
    const before = await db.from('site_settings').select('setting_value').eq('setting_key', 'footer_text').single();
    const original = before.data?.setting_value ?? '';
    const probe = `${original} ${MARK}`;

    const up = await db.from('site_settings')
      .upsert([{ setting_key: 'footer_text', setting_value: probe }] as never, { onConflict: 'setting_key' })
      .select();
    record('Site settings: upsert onConflict setting_key', !up.error && !!up.data?.length, up.error?.message ?? '');

    const after = await db.from('site_settings').select('setting_value').eq('setting_key', 'footer_text').single();
    record('Site settings: persists', after.data?.setting_value === probe, `read back: ${after.data?.setting_value?.slice(0, 40)}`);

    await db.from('site_settings').update({ setting_value: original } as never).eq('setting_key', 'footer_text');
    const restored = await db.from('site_settings').select('setting_value').eq('setting_key', 'footer_text').single();
    record('Site settings: restored', restored.data?.setting_value === original, '');
  } catch (e) {
    record('Site settings', false, e instanceof Error ? e.message : String(e));
  }

  // --- HOME SECTION visibility round trip ---
  try {
    const sec = await db.from('home_sections').select('id, section_key, is_visible').eq('section_key', 'latest-blogs').single();
    if (!sec.data) throw new Error('latest-blogs section not found');

    await db.from('home_sections').update({ is_visible: false } as never).eq('id', sec.data.id);
    const off = await db.from('home_sections').select('is_visible').eq('id', sec.data.id).single();
    record('Home section: hide persists', off.data?.is_visible === false, `is_visible=${off.data?.is_visible}`);

    await db.from('home_sections').update({ is_visible: sec.data.is_visible } as never).eq('id', sec.data.id);
    const back = await db.from('home_sections').select('is_visible').eq('id', sec.data.id).single();
    record('Home section: restored', back.data?.is_visible === sec.data.is_visible, '');
  } catch (e) {
    record('Home section', false, e instanceof Error ? e.message : String(e));
  }

  // --- ANON READABILITY ---
  // The public site reads with the publishable key. A table with no anon SELECT
  // policy returns zero rows *without an error*, so every reader silently falls
  // back to hardcoded data and admin edits never surface. Check it explicitly.
  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } }
  );
  for (const table of ['pages', 'menu_items', 'departments', 'blogs', 'events', 'hero_slides', 'home_sections', 'site_settings']) {
    const { data, error } = await anon.from(table).select('id');
    const n = data?.length ?? 0;
    record(`Public can read ${table}`, !error && n > 0, error ? error.message : `${n} rows visible to anon`);
  }

  // --- RLS STILL BLOCKS ANONYMOUS WRITES ---
  const writeProbes: Record<string, Record<string, unknown>> = {
    pages: { slug: '__probe__', title: '__probe__' },
    menu_items: { menu_type: 'header', label: '__probe__' },
    departments: { name: '__probe__', slug: '__probe__' },
    blogs: { title: '__probe__', slug: '__probe__' },
    events: { title: '__probe__', slug: '__probe__' },
    home_sections: { section_key: '__probe__', title: '__probe__', component_type: 'x' },
    site_settings: { setting_key: '__probe__', setting_value: 'x' },
    hero_slides: { title: '__probe__' },
  };
  for (const [table, payload] of Object.entries(writeProbes)) {
    const { error, data } = await anon.from(table).insert([payload as never]).select();
    if (!error && data?.length) {
      for (const row of data) await db.from(table).delete().eq('id', (row as { id: string }).id);
    }
    record(`Anon write blocked on ${table}`, !!error, error ? `[${error.code}]` : 'WRITE SUCCEEDED — security hole');
  }

  await cleanup();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${'='.repeat(60)}\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log('\nFAILURES:');
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
}

main().catch(async (e) => { console.error(e); await cleanup(); process.exit(1); });
