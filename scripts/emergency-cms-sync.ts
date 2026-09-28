import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { categories } from '@/lib/data/categories';
import { shopCategories } from '@/lib/data/shopCategories';
import { products } from '@/lib/data/products';
import { blogs } from '@/lib/data/blogs';
import { events } from '@/lib/data/events';
import { catalogues } from '@/lib/data/catalogues';
import { departments } from '@/lib/data/departments';

loadEnvConfig(process.cwd());

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.error('Add it to .env.local and run again');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function syncCategories() {
  console.log('\n📦 Syncing Categories...');
  let synced = 0;

  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert(
      {
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image.src,
        is_active: true,
        sort_order: categories.indexOf(cat) + 1,
        source_data: { ...cat }
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`Error syncing category ${cat.name}:`, error.message);
    } else {
      synced++;
    }
  }

  console.log(`✅ Categories: ${synced} upserted`);
  return synced;
}

async function syncSubcategories() {
  console.log('\n📦 Syncing Subcategories...');
  let synced = 0;

  for (const cat of shopCategories) {
    const categoryId = (await supabase.from('categories').select('id').eq('slug', cat.slug).single()).data?.id;

    if (!categoryId) {
      console.warn(`⚠️  Parent category not found for ${cat.name}`);
      continue;
    }

    for (const subcat of cat.subcategories) {
      const { error } = await supabase.from('subcategories').upsert(
        {
          category_id: categoryId,
          name: subcat.name,
          slug: subcat.slug,
          image_url: `/images/banner.png`,
          is_active: true,
          sort_order: cat.subcategories.indexOf(subcat) + 1,
          source_data: { ...subcat, parentSlug: cat.slug }
        },
        { onConflict: 'slug' }
      );

      if (error) {
        console.error(`Error syncing subcategory ${subcat.name}:`, error.message);
      } else {
        synced++;
      }
    }
  }

  console.log(`✅ Subcategories: ${synced} upserted`);
  return synced;
}

async function resolveProductCategory(product: any): Promise<string | null> {
  const categorySlug = typeof product.category === 'string'
    ? product.category.toLowerCase().replace(/\s+/g, '-')
    : product.category;

  let categoryRes = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
  if (categoryRes.data?.id) return categoryRes.data.id;

  const subcat = (product.subcategory || '').toLowerCase();
  let mappedSlug = 'protective-jackets';

  if (subcat.includes('leather')) {
    mappedSlug = 'motorbike-leather-jackets';
  } else if (subcat.includes('touring')) {
    mappedSlug = 'touring-jacket';
  } else if (subcat.includes('glove') || subcat.includes('racing')) {
    mappedSlug = 'winter-gloves';
  }

  categoryRes = await supabase.from('categories').select('id').eq('slug', mappedSlug).single();
  return categoryRes.data?.id || null;
}

async function syncProducts() {
  console.log('\n📦 Syncing Products...');
  let synced = 0;

  for (const product of products) {
    const categoryId = await resolveProductCategory(product);

    if (!categoryId) {
      console.warn(`⚠️  Category not found for product ${product.name}`);
      continue;
    }

    const { error } = await supabase.from('products').upsert(
      {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        category_id: categoryId,
        subcategory_id: null,
        price: product.price,
        sale_price: product.salePrice || null,
        currency: product.currency,
        short_description: product.shortDescription,
        description: product.description,
        main_image_url: product.mainImage?.src || '/images/image 153.png',
        hover_image_url: product.hoverImage?.src || '/images/image 155.png',
        is_active: product.isActive,
        is_published: true,
        is_featured: product.isFeatured,
        is_new: product.isNew || false,
        stock_quantity: product.stockQuantity || 0,
        sort_order: products.indexOf(product) + 1,
        source_data: { ...product }
      },
      { onConflict: 'sku' }
    );

    if (error) {
      console.error(`Error syncing product ${product.name}:`, error.message);
    } else {
      synced++;
    }
  }

  console.log(`✅ Products: ${synced} upserted`);
  return synced;
}

async function syncBlogs() {
  console.log('\n📦 Syncing Blogs...');
  let synced = 0;

  for (const blog of blogs) {
    const { error } = await supabase.from('blogs').upsert(
      {
        title: blog.title,
        slug: blog.slug,
        is_published: blog.is_published,
        source_data: { ...blog }
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`Error syncing blog ${blog.title}:`, error.message);
    } else {
      synced++;
    }
  }

  console.log(`✅ Blogs: ${synced} upserted`);
  return synced;
}

async function syncEvents() {
  console.log('\n📦 Syncing Events...');
  let synced = 0;

  for (const event of events) {
    const { error } = await supabase.from('events').upsert(
      {
        title: event.title,
        slug: event.slug,
        source_data: { ...event }
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`Error syncing event ${event.title}:`, error.message);
    } else {
      synced++;
    }
  }

  console.log(`✅ Events: ${synced} upserted`);
  return synced;
}

async function syncCatalogues() {
  console.log('\n📦 Syncing Catalogues...');
  let synced = 0;

  for (const cat of catalogues) {
    const { error } = await supabase.from('catalogues').insert(
      {
        title: cat.title,
        file_url: cat.pdfUrl,
        source_data: { ...cat }
      }
    );

    if (error) {
      console.error(`Error syncing catalogue ${cat.title}:`, error.message);
    } else {
      synced++;
    }
  }

  console.log(`✅ Catalogues: ${synced} upserted`);
  return synced;
}

async function syncDepartments() {
  console.log('\n📦 Syncing Departments...');
  let synced = 0;

  for (const dept of departments) {
    const { error } = await supabase.from('departments').upsert(
      {
        name: dept.name,
        slug: dept.slug,
        is_active: dept.isActive,
        source_data: { ...dept }
      },
      { onConflict: 'slug' }
    );

    if (error) {
      console.error(`Error syncing department ${dept.name}:`, error.message);
    } else {
      synced++;
    }
  }

  console.log(`✅ Departments: ${synced} upserted`);
  return synced;
}

async function main() {
  try {
    console.log('🚀 EMERGENCY CMS SYNC STARTED\n');

    const catCount = await syncCategories();
    const subcatCount = await syncSubcategories();
    const productCount = await syncProducts();
    const blogCount = await syncBlogs();
    const eventCount = await syncEvents();
    const catalogueCount = await syncCatalogues();
    const deptCount = await syncDepartments();

    console.log('\n✅ SYNC COMPLETE');
    console.log('═══════════════════════════════');
    console.log(`Categories: ${catCount}`);
    console.log(`Subcategories: ${subcatCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Blogs: ${blogCount}`);
    console.log(`Events: ${eventCount}`);
    console.log(`Catalogues: ${catalogueCount}`);
    console.log(`Departments: ${deptCount}`);
    console.log(`TOTAL: ${catCount + subcatCount + productCount + blogCount + eventCount + catalogueCount + deptCount}`);
    console.log('═══════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
