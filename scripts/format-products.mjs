import fs from 'fs';
import path from 'path';

const storePath = path.resolve('lib/cms/localStore.json');
const targetTsPath = path.resolve('lib/cms/defaultProducts.ts');

const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

const formatted = store.products.map((p) => {
  const toObj = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return { src: img, alt: p.name || 'Estrella Product' };
    return { src: img.src || img.url || '', alt: img.alt || p.name || 'Estrella Product' };
  };

  let gallery = (p.galleryImages || []).map(toObj).filter(Boolean);
  if (gallery.length === 0 && p.mainImage) {
    gallery.push(toObj(p.mainImage));
  }

  const mainImg = toObj(p.mainImage) || { src: '/images/about/gallery-1.jpg', alt: p.name };
  const hoverImg = toObj(p.hoverImage) || mainImg;

  return {
    ...p,
    mainImage: mainImg,
    hoverImage: hoverImg,
    galleryImages: gallery,
    thumbnails: gallery,
  };
});

store.products = formatted;
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');

const tsContent = `import type { AdaptedProduct } from "./types";\n\nexport const DEFAULT_PRODUCTS: AdaptedProduct[] = ${JSON.stringify(
  formatted,
  null,
  2
)};\n`;

fs.writeFileSync(targetTsPath, tsContent, 'utf8');
console.log(`Successfully formatted ${formatted.length} products with { src, alt } gallery images!`);
