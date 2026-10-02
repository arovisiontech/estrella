import fs from 'fs';
import path from 'path';

async function fetchWithRetry(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const total = res.headers.get('x-wp-total');
        const totalPages = res.headers.get('x-wp-totalpages');
        const data = await res.json();
        return { data, total, totalPages };
      }
      console.warn(`[Attempt ${i + 1}] HTTP status ${res.status} for ${url}, retrying...`);
    } catch (err) {
      console.warn(`[Attempt ${i + 1}] Network error: ${err.message} for ${url}, retrying in 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

async function fetchAllData() {
  console.log('=== 1. Fetching WordPress Categories ===');
  const { data: rawCats } = await fetchWithRetry('https://estrella.graphixals.com/wp-json/wp/v2/product_cat?per_page=100');
  console.log(`Fetched ${rawCats.length} total categories from WP.`);

  // Top level categories (parent === 0)
  const topLevel = rawCats
    .filter((c) => c.parent === 0 && c.count > 0)
    .sort((a, b) => b.count - a.count);

  console.log('Top level categories found:', topLevel.map(c => `${c.name} (${c.count})`).join(', '));

  const categoriesData = topLevel.map((cat, idx) => {
    const children = rawCats.filter((child) => child.parent === cat.id);
    return {
      id: `cat-${cat.slug}`,
      wp_id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || `${cat.name} high-performance equipment and apparel by Estrella International.`,
      banner_url: cat.slug.includes('box')
        ? '/images/about/gallery-4.jpg'
        : cat.slug.includes('soccer')
        ? '/images/about/gallery-5.jpg'
        : '/images/brochure-parallax.jpeg',
      image_url: '/images/about/gallery-1.jpg',
      sort_order: idx + 1,
      is_active: true,
      subcategories: children.map((ch, cIdx) => ({
        id: `sub-${ch.slug}`,
        wp_id: ch.id,
        name: ch.name,
        slug: ch.slug,
        category_id: `cat-${cat.slug}`,
        sort_order: cIdx + 1,
        is_active: true,
      })),
    };
  });

  console.log('\n=== 2. Fetching All 345 Products from WooCommerce Store API ===');
  const allWpProducts = [];
  let page = 1;
  let totalPages = 4;

  do {
    console.log(`Fetching page ${page} of ${totalPages}...`);
    const { data: pageData, totalPages: tp } = await fetchWithRetry(
      `https://estrella.graphixals.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`
    );
    if (tp) totalPages = parseInt(tp, 10);
    allWpProducts.push(...pageData);
    console.log(`Page ${page} fetched: ${pageData.length} items. Total so far: ${allWpProducts.length}`);
    page++;
    await new Promise((r) => setTimeout(r, 1000));
  } while (page <= totalPages);

  console.log(`\nSuccessfully downloaded ${allWpProducts.length} products from WordPress!`);

  // Map into AdaptedProduct
  const adaptedProducts = allWpProducts.map((p, index) => {
    const catList = p.categories || [];
    let matchedParentCat = null;
    let matchedSubCat = null;

    // Check if any category is a top level
    for (const c of catList) {
      const foundTop = categoriesData.find((tc) => tc.wp_id === c.id || tc.slug === c.slug);
      if (foundTop) {
        matchedParentCat = foundTop;
      }
    }

    // Check if any category is a subcategory
    for (const c of catList) {
      for (const tc of categoriesData) {
        const foundSub = tc.subcategories.find((sc) => sc.wp_id === c.id || sc.slug === c.slug);
        if (foundSub) {
          matchedSubCat = foundSub;
          if (!matchedParentCat) matchedParentCat = tc;
          break;
        }
      }
    }

    // Fallback category if none matched
    if (!matchedParentCat) {
      matchedParentCat = categoriesData[0] || {
        id: 'cat-sportswears',
        name: 'Sportswears',
        slug: 'sportswears',
      };
    }

    const categorySlug = matchedParentCat.slug;
    const categoryName = matchedParentCat.name;
    const subcategoryName = matchedSubCat ? matchedSubCat.name : (catList[0]?.name || 'General');
    const subcategorySlug = matchedSubCat ? matchedSubCat.slug : (catList[0]?.slug || 'general');

    const cleanDesc = p.description || p.short_description || `<h3>${p.name}</h3><p>High-performance product manufactured by Estrella International with premium fabrics and craftsmanship.</p>`;
    const cleanShortDesc = (p.short_description || p.description || '')
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, 160) || `Custom ${p.name} designed for durability, athletic movement and comfort.`;

    // Realistic price in PKR if WordPress price is 0
    let numericPrice = parseInt(p.prices?.price || '0', 10);
    if (!numericPrice || numericPrice === 0) {
      if (categorySlug.includes('box')) numericPrice = 4500 + ((p.id % 20) * 150);
      else if (categorySlug.includes('soccer')) numericPrice = 2800 + ((p.id % 15) * 120);
      else if (categorySlug.includes('casual')) numericPrice = 3200 + ((p.id % 15) * 100);
      else numericPrice = 3800 + ((p.id % 25) * 100);
    } else if (p.prices?.currency_minor_unit) {
      numericPrice = numericPrice / Math.pow(10, p.prices.currency_minor_unit);
      if (p.prices?.currency_code === 'USD') {
        numericPrice = Math.round(numericPrice * 280);
      }
    }

    const mainImgUrl = p.images?.[0]?.src || '/images/about/gallery-1.jpg';
    const hoverImgUrl = p.images?.[1]?.src || mainImgUrl;
    const galleryUrls = (p.images || []).map((img) => img.src);
    const formattedGallery = galleryUrls.length > 0
      ? galleryUrls.map((url) => ({ src: url, alt: p.name }))
      : [{ src: mainImgUrl, alt: p.name }];

    return {
      id: `prod-wp-${p.id}`,
      name: p.name,
      slug: p.slug || `product-${p.id}`,
      sku: p.sku || `EST-WP-${p.id}`,
      price: numericPrice,
      salePrice: null,
      currency: 'PKR',
      shortDescription: cleanShortDesc,
      description: cleanDesc,
      mainImage: { src: mainImgUrl, alt: p.name },
      hoverImage: { src: hoverImgUrl, alt: `${p.name} Detail` },
      galleryImages: formattedGallery,
      thumbnails: formattedGallery,
      category: categorySlug,
      categoryLabel: categoryName,
      subcategory: subcategoryName,
      subcategory_id: subcategorySlug,
      tags: [categoryName, subcategoryName, 'Custom'].filter(Boolean),
      isNew: index < 25,
      isFeatured: index % 6 === 0,
      isActive: true,
      isPublished: true,
      stockQuantity: 100,
      sortOrder: index + 1,
    };
  });

  console.log(`\nAdapted ${adaptedProducts.length} products successfully!`);

  // Write defaultCategories.ts
  const categoriesFileContent = `import type { CategoryData } from "./types";

export const DEFAULT_CATEGORIES: CategoryData[] = ${JSON.stringify(categoriesData, null, 2)};
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'lib', 'cms', 'defaultCategories.ts'),
    categoriesFileContent,
    'utf-8'
  );
  console.log('✓ Updated lib/cms/defaultCategories.ts with all WordPress categories & subcategories!');

  // Write defaultProducts.ts
  const productsFileContent = `import type { AdaptedProduct } from "./types";

export const DEFAULT_PRODUCTS: AdaptedProduct[] = ${JSON.stringify(adaptedProducts, null, 2)};
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'lib', 'cms', 'defaultProducts.ts'),
    productsFileContent,
    'utf-8'
  );
  console.log(`✓ Updated lib/cms/defaultProducts.ts with all ${adaptedProducts.length} WordPress products!`);

  // Write localStore.json
  const localStorePath = path.join(process.cwd(), 'lib', 'cms', 'localStore.json');
  const localStoreData = {
    categories: categoriesData,
    products: adaptedProducts,
  };
  fs.writeFileSync(localStorePath, JSON.stringify(localStoreData, null, 2), 'utf-8');
  console.log('✓ Updated lib/cms/localStore.json with live products and categories!');

  console.log('\n=== All WordPress Data Synced Successfully! ===');
}

fetchAllData().catch(console.error);
