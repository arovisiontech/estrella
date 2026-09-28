import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';
import { categories } from '@/lib/data/categories';
import { shopCategories } from '@/lib/data/shopCategories';
import { products } from '@/lib/data/products';
import { blogs } from '@/lib/data/blogs';
import { events } from '@/lib/data/events';
import { catalogues } from '@/lib/data/catalogues';
import { departments } from '@/lib/data/departments';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function syncCategories() {
  console.log('\n📦 Syncing Categories...');
  let synced = 0;

  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image_url: cat.image.src,
      is_active: true,
      sort_order: categories.indexOf(cat) + 1,
      source_data: cat
    }, { onConflict: 'slug' });

    if (!error) synced++;
  }

  console.log(`✅ Categories: ${synced} synced`);
  return synced;
}

async function syncSubcategories() {
  console.log('\n📦 Syncing Subcategories...');
  let synced = 0;

  for (const cat of shopCategories) {
    const parentCat = await supabase.from('categories').select('id').eq('slug', cat.slug).single();

    for (const subcat of cat.subcategories) {
      const { error } = await supabase.from('subcategories').upsert({
        id: subcat.id,
        category_id: parentCat.data?.id || cat.id,
        name: subcat.name,
        slug: subcat.slug,
        is_active: true,
        sort_order: cat.subcategories.indexOf(subcat) + 1,
        source_data: subcat
      }, { onConflict: 'slug' });

      if (!error) synced++;
    }
  }

  console.log(`✅ Subcategories: ${synced} synced`);
  return synced;
}

async function syncProducts() {
  console.log('\n📦 Syncing Products...');
  let synced = 0;

  for (const product of products) {
    const categorySlug = typeof product.category === 'string'
      ? product.category.toLowerCase().replace(/\s+/g, '-')
      : product.category;

    const categoryRes = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
    const categoryId = categoryRes.data?.id;

    if (!categoryId) {
      console.warn(`⚠️  Category not found for ${product.name}`);
      continue;
    }

    const { error } = await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category_id: categoryId,
      price: product.price,
      sale_price: product.salePrice || null,
      currency: product.currency,
      short_description: product.shortDescription,
      description: product.description,
      main_image_url: product.mainImage?.src || '',
      hover_image_url: product.hoverImage?.src || '',
      is_active: product.isActive,
      is_published: true,
      is_featured: product.isFeatured || false,
      is_new: product.isNew || false,
      stock_quantity: product.stockQuantity || 0,
      sort_order: products.indexOf(product) + 1,
      source_data: product
    }, { onConflict: 'sku' });

    if (!error) synced++;
  }

  console.log(`✅ Products: ${synced} synced`);
  return synced;
}

async function syncBlogs() {
  console.log('\n📦 Syncing Blogs...');
  let synced = 0;

  for (const blog of blogs) {
    const { error } = await supabase.from('blogs').upsert({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image_url: blog.featured_image_url,
      author: blog.author_name,
      is_published: blog.is_published,
      read_time_minutes: blog.reading_time,
      published_at: blog.published_at,
      source_data: blog
    }, { onConflict: 'slug' });

    if (!error) synced++;
  }

  console.log(`✅ Blogs: ${synced} synced`);
  return synced;
}

async function syncEvents() {
  console.log('\n📦 Syncing Events...');
  let synced = 0;

  for (const event of events) {
    const { error } = await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      slug: event.slug,
      start_date: event.eventDate,
      end_date: event.endDate || null,
      location: event.location,
      description: event.content,
      short_description: event.shortDescription,
      image_url: event.featuredImage,
      status: event.status,
      category: event.eventType,
      is_featured: event.isFeatured || false,
      source_data: event
    }, { onConflict: 'slug' });

    if (!error) synced++;
  }

  console.log(`✅ Events: ${synced} synced`);
  return synced;
}

async function syncCatalogues() {
  console.log('\n📦 Syncing Catalogues...');
  let synced = 0;

  for (const cat of catalogues) {
    const { error } = await supabase.from('catalogues').upsert({
      id: cat.id,
      name: cat.title,
      slug: cat.slug,
      description: cat.description,
      pdf_url: cat.pdfUrl,
      cover_image_url: cat.coverImage,
      is_active: cat.status === 'active',
      source_data: cat
    }, { onConflict: 'slug' });

    if (!error) synced++;
  }

  console.log(`✅ Catalogues: ${synced} synced`);
  return synced;
}

async function syncDepartments() {
  console.log('\n📦 Syncing Departments...');
  let synced = 0;

  for (const dept of departments) {
    const { error } = await supabase.from('departments').upsert({
      id: dept.id,
      name: dept.name,
      slug: dept.slug,
      short_description: dept.shortDescription,
      description: dept.description,
      image_url: dept.image,
      gallery_images: dept.galleryImages,
      is_active: dept.isActive,
      sort_order: departments.indexOf(dept) + 1,
      source_data: dept
    }, { onConflict: 'slug' });

    if (!error) synced++;
  }

  console.log(`✅ Departments: ${synced} synced`);
  return synced;
}

async function main() {
  try {
    console.log('🚀 SYNCING TORQUE EXISTING CONTENT\n');

    const catCount = await syncCategories();
    const subcatCount = await syncSubcategories();
    const productCount = await syncProducts();
    const blogCount = await syncBlogs();
    const eventCount = await syncEvents();
    const catalogueCount = await syncCatalogues();
    const deptCount = await syncDepartments();

    const total = catCount + subcatCount + productCount + blogCount + eventCount + catalogueCount + deptCount;

    console.log('\n✅ SYNC COMPLETE');
    console.log('═══════════════════════════════');
    console.log(`Categories:     ${catCount}`);
    console.log(`Subcategories:  ${subcatCount}`);
    console.log(`Products:       ${productCount}`);
    console.log(`Blogs:          ${blogCount}`);
    console.log(`Events:         ${eventCount}`);
    console.log(`Catalogues:     ${catalogueCount}`);
    console.log(`Departments:    ${deptCount}`);
    console.log('═══════════════════════════════');
    console.log(`TOTAL:          ${total}`);
    console.log('═══════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

main();
