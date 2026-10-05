import fs from 'fs';
import path from 'path';

const storePath = path.resolve('lib/cms/localStore.json');
const defaultProductsPath = path.resolve('lib/cms/defaultProducts.ts');

const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// 1. Group products by variation key (base SKU or subcategory)
const groups = new Map();

for (const p of store.products) {
  const cat = (p.category || '').toLowerCase();
  const sub = (p.subcategory || '').toLowerCase();
  const baseSku = (p.sku || '').replace(/-[0-9]+$/, '').trim();
  
  // Use baseSku if it has a dash-number suffix (e.g. SKU-0031-7 -> SKU-0031)
  const groupKey = baseSku && baseSku !== p.sku ? `sku::${baseSku}` : `subcat::${cat}::${sub}`;
  
  if (!groups.has(groupKey)) {
    groups.set(groupKey, []);
  }
  groups.get(groupKey).push(p);
}

console.log(`Identified ${groups.size} product variation groups.`);

let enrichedCount = 0;

for (const [key, groupList] of groups.entries()) {
  const uniqueImagesInGroup = [];
  const seenSrc = new Set();

  for (const item of groupList) {
    const src = item.mainImage?.src || item.primary_image || item.image_url;
    if (src && !seenSrc.has(src)) {
      seenSrc.add(src);
      uniqueImagesInGroup.push({
        src,
        alt: `${item.name} View`,
        slug: item.slug,
        sku: item.sku,
      });
    }
  }

  groupList.forEach((prod, idx) => {
    const mainSrc = prod.mainImage?.src || prod.primary_image || prod.image_url;
    
    // Determine hover image: next sibling in group, or fallback to current mainSrc
    let newHover = mainSrc;
    if (uniqueImagesInGroup.length > 1) {
      // Find current item's index in uniqueImagesInGroup
      const currentIdx = uniqueImagesInGroup.findIndex(img => img.src === mainSrc);
      const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % uniqueImagesInGroup.length : 1;
      newHover = uniqueImagesInGroup[nextIdx].src;
    }

    // Build gallery images: own image first, then sibling images
    const gallery = [{ src: mainSrc, alt: prod.name }];
    const thumbs = [{ src: mainSrc, alt: prod.name }];

    for (const other of uniqueImagesInGroup) {
      if (other.src !== mainSrc && gallery.length < 10) {
        gallery.push({ src: other.src, alt: `${prod.name} - ${other.sku || 'Color Option'}` });
        thumbs.push({ src: other.src, alt: `${prod.name} - ${other.sku || 'Color Option'}` });
      }
    }

    prod.hoverImage = {
      src: newHover,
      alt: `${prod.name} Alternate View`
    };
    prod.galleryImages = gallery;
    prod.thumbnails = thumbs;
    enrichedCount++;
  });
}

console.log(`Enriched ${enrichedCount} products with variation galleries, other views, and hover images!`);

// Save updated localStore.json
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
console.log('✓ Updated lib/cms/localStore.json');

// Save updated defaultProducts.ts
const tsContent = `import type { AdaptedProduct } from "./types";\n\nexport const DEFAULT_PRODUCTS: AdaptedProduct[] = ${JSON.stringify(
  store.products,
  null,
  2
)};\n`;

fs.writeFileSync(defaultProductsPath, tsContent, 'utf8');
console.log('✓ Updated lib/cms/defaultProducts.ts');
