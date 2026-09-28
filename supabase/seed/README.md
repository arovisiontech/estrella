# 🌱 Supabase Seed Scripts
**Status:** Ready for execution  
**Total Records to Seed:** 231+ (products with related tables)  
**Execution Order:** CRITICAL - Must follow numbered sequence

---

## 📋 SEED EXECUTION SEQUENCE

### Step 1: Create Missing Tables (MUST RUN FIRST)
```bash
File: seed-01-tables-and-functions.sql
Action: Creates 4 missing tables (product_specifications, product_features, product_highlights, departments)
Location: Supabase SQL Editor
Status: ✅ IDEMPOTENT (IF NOT EXISTS on all DDL)
```

### Step 2: Seed Categories & Subcategories
```bash
File: seed-02-categories.sql
Action: UPSERTS 6 categories + INSERTs 24 subcategories
Location: Supabase SQL Editor
Status: ✅ IDEMPOTENT (ON CONFLICT DO NOTHING)
Wait For: Step 1 complete
```

### Step 3: Seed Simple Tables (Blogs, Events, Catalogues, Departments)
```bash
File: seed-03-simple-tables.sql
Action: INSERTs 2 blogs + 6 events + 6 catalogues + 8 departments
Location: Supabase SQL Editor
Status: ✅ IDEMPOTENT (ON CONFLICT DO NOTHING)
Wait For: Step 2 complete
```

### Step 4: Seed Products & Related Tables (COMPLEX - TypeScript)
```bash
File: seed-04-products.ts (to be created)
Action: INSERTs 197 products + images/sizes/colors/specs/features/highlights
Location: Run with: npm run seed:products
Status: ⏳ Requires TypeScript/Node.js
Wait For: Step 3 complete
```

---

## ⚠️ CRITICAL NOTES

### DO NOT:
- ❌ Run scripts out of order (foreign key constraints will fail)
- ❌ Run `seed-03` before `seed-02` (categories don't exist)
- ❌ Run `seed-04` before `seed-01` (product_* tables don't exist)
- ❌ Run directly in production without testing staging first
- ❌ Run with different Supabase key (uses anon key, safe)

### DO:
- ✅ Run each script in SQL Editor sequentially
- ✅ Wait for "success" message after each script
- ✅ Verify record counts with verification queries
- ✅ Stop if any errors occur and investigate
- ✅ Keep public website on hard-coded data during seeding

---

## 🔍 HOW TO EXECUTE

### Method 1: Supabase Dashboard SQL Editor (Easiest)

1. Go to: https://app.supabase.com/project/hhcehcdthzdssbperccd/sql
2. Click: "New Query"
3. Copy: Entire contents of `seed-01-tables-and-functions.sql`
4. Paste: Into SQL Editor
5. Click: "Run"
6. Wait: For success message
7. Repeat: For `seed-02-categories.sql`, then `seed-03-simple-tables.sql`

### Method 2: Command Line (If you have psql)

```bash
# Install psql if needed, then:
psql -h db.hhcehcdthzdssbperccd.supabase.co \
     -U postgres \
     -d postgres \
     -f seed-01-tables-and-functions.sql

psql -h db.hhcehcdthzdssbperccd.supabase.co \
     -U postgres \
     -d postgres \
     -f seed-02-categories.sql

psql -h db.hhcehcdthzdssbperccd.supabase.co \
     -U postgres \
     -d postgres \
     -f seed-03-simple-tables.sql
```

### Method 3: Local Node.js (When seed-04 is ready)

```bash
npm run seed:products
```

---

## ✅ VERIFICATION AFTER EACH STEP

### After Step 1 (Tables Created):
```sql
SELECT COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('product_specifications', 'product_features', 'product_highlights', 'departments');
-- Expected: 4
```

### After Step 2 (Categories & Subcategories):
```sql
SELECT COUNT(*) as category_count FROM public.categories WHERE is_active = true;
-- Expected: 6

SELECT COUNT(*) as subcategory_count FROM public.subcategories WHERE is_active = true;
-- Expected: 24
```

### After Step 3 (Simple Tables):
```sql
SELECT
  (SELECT COUNT(*) FROM public.blogs WHERE is_published = true) as blogs,
  (SELECT COUNT(*) FROM public.events) as events,
  (SELECT COUNT(*) FROM public.catalogues WHERE is_active = true) as catalogues,
  (SELECT COUNT(*) FROM public.departments WHERE is_active = true) as departments;
-- Expected: blogs=2, events=6, catalogues=6, departments=8
```

### After Step 4 (Products & Related):
```sql
SELECT
  (SELECT COUNT(*) FROM public.products) as products,
  (SELECT COUNT(*) FROM public.product_images) as images,
  (SELECT COUNT(*) FROM public.product_sizes) as sizes,
  (SELECT COUNT(*) FROM public.product_colors) as colors,
  (SELECT COUNT(*) FROM public.product_specifications) as specifications,
  (SELECT COUNT(*) FROM public.product_features) as features,
  (SELECT COUNT(*) FROM public.product_highlights) as highlights;
-- Expected: products=197, images=~788, sizes=~985, colors=~591, specs=~591, features=~591, highlights=~591
```

---

## 🐛 TROUBLESHOOTING

### Error: "relation does not exist"
**Cause:** Table not created yet (Step 1 not completed)  
**Fix:** Run `seed-01-tables-and-functions.sql` first

### Error: "duplicate key value violates unique constraint"
**Cause:** Record already exists (idempotent insert failed)  
**Fix:** Likely data was partially seeded before, OK to retry

### Error: "foreign key constraint fails"
**Cause:** Parent record doesn't exist  
**Fix:** Run steps in order: 1 → 2 → 3 → 4

### Error: "permission denied"
**Cause:** Using wrong auth key or wrong user  
**Fix:** Use anon key (public.read OK, schema public), not service role

### Slow execution (> 30 seconds per script)
**Cause:** Network latency or Supabase load  
**Fix:** Try again, or run smaller batches

---

## 📊 EXPECTED RESULTS

After all 4 steps complete:

| Table | Expected Count | Status |
|-------|---|---|
| categories | 6 | ✅ |
| subcategories | 24 | ✅ |
| products | 197 | ✅ |
| product_images | ~788 | ✅ |
| product_sizes | ~985 | ✅ |
| product_colors | ~591 | ✅ |
| product_specifications | ~591 | ✅ |
| product_features | ~591 | ✅ |
| product_highlights | ~591 | ✅ |
| blogs | 2 | ✅ |
| events | 6 | ✅ |
| catalogues | 6 | ✅ |
| departments | 8 | ✅ |
| **TOTAL** | **5700+** | **✅** |

---

## 🚀 NEXT AFTER SEEDING

1. ✅ Verify all record counts match
2. ✅ Confirm hard-coded data unchanged
3. ✅ **DO NOT** switch public website to database yet
4. ⏳ Build admin CRUD forms
5. ⏳ Create API queries for products/categories
6. ⏳ Test admin operations (create/edit/delete)
7. ⏳ Only after testing: Switch public website to database

---

## ⚠️ IMPORTANT REMINDERS

- Public website still shows hard-coded data (unchanged)
- Database now has copy of all hard-coded records
- Admin can manage database (no CRUD forms yet)
- Once seeded, consider it "source of truth"
- Hard-coded data in `lib/data/*.ts` can be deleted after testing

---

## 📍 FILES

- `seed-01-tables-and-functions.sql` - DDL + RLS + Functions
- `seed-02-categories.sql` - Categories + Subcategories (6+24)
- `seed-03-simple-tables.sql` - Blogs, Events, Catalogues, Departments (2+6+6+8)
- `seed-04-products.ts` - Products + Related (197+~5000)
- `README.md` - This file

---

**Ready to seed? Start with Step 1!**
