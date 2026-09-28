export type ShopSubcategory = {
  id: string;
  name: string;
  slug: string;
  parentSlug: string;
};

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
  banner: {
    src: string;
    alt: string;
  };
  description?: string;
  subcategories: ShopSubcategory[];
};

export const shopCategories: ShopCategory[] = [
  {
    id: "sublimated-sportswear",
    name: "Sublimated Sportswear",
    slug: "sublimated-sportswear",
    banner: {
      src: "/images/banner-sublimation-sports.svg",
      alt: "Sublimated Sportswear Collection",
    },
    description: "Custom digital sublimation sportswear for teams and athletes",
    subcategories: [
      { id: "basketball-kits", name: "Basketball Kits", slug: "basketball-kits", parentSlug: "sublimated-sportswear" },
      { id: "soccer-jerseys", name: "Soccer Jerseys", slug: "soccer-jerseys", parentSlug: "sublimated-sportswear" },
      { id: "running-singlets", name: "Running Singlets", slug: "running-singlets", parentSlug: "sublimated-sportswear" },
      { id: "volleyball-uniforms", name: "Volleyball Uniforms", slug: "volleyball-uniforms", parentSlug: "sublimated-sportswear" },
    ],
  },
  {
    id: "surgical-instruments",
    name: "Surgical & Dental Tools",
    slug: "surgical-instruments",
    banner: {
      src: "/images/banner-surgical-tools.svg",
      alt: "Surgical & Dental Instruments Catalog",
    },
    description: "ISO 13485 certified surgical scissors, forceps, and dental instruments",
    subcategories: [
      { id: "operating-scissors", name: "Operating Scissors", slug: "operating-scissors", parentSlug: "surgical-instruments" },
      { id: "hemostatic-forceps", name: "Hemostatic Forceps", slug: "hemostatic-forceps", parentSlug: "surgical-instruments" },
      { id: "dental-extractors", name: "Dental Extractors", slug: "dental-extractors", parentSlug: "surgical-instruments" },
      { id: "scalpel-handles", name: "Scalpel Handles", slug: "scalpel-handles", parentSlug: "surgical-instruments" },
    ],
  },
  {
    id: "boxing-martial-arts",
    name: "Boxing & Martial Arts",
    slug: "boxing-martial-arts",
    banner: {
      src: "/images/banner-our-values.svg",
      alt: "Boxing & Combat Equipment",
    },
    description: "Genuine leather boxing gloves, focus pads, and martial arts gear",
    subcategories: [
      { id: "pro-boxing-gloves", name: "Pro Boxing Gloves", slug: "pro-boxing-gloves", parentSlug: "boxing-martial-arts" },
      { id: "focus-pads", name: "Focus Mitts & Target Pads", slug: "focus-pads", parentSlug: "boxing-martial-arts" },
      { id: "head-guards", name: "Head Guards & Protection", slug: "head-guards", parentSlug: "boxing-martial-arts" },
      { id: "mma-gloves", name: "MMA Grappling Gloves", slug: "mma-gloves", parentSlug: "boxing-martial-arts" },
    ],
  },
  {
    id: "soccer-footballs",
    name: "Soccer Footballs",
    slug: "soccer-footballs",
    banner: {
      src: "/images/banner-sublimation-sports.svg",
      alt: "Soccer Footballs & Teamwear",
    },
    description: "Hand-stitched and thermo-bonded professional match soccer balls",
    subcategories: [
      { id: "match-footballs", name: "Official Match Footballs", slug: "match-footballs", parentSlug: "soccer-footballs" },
      { id: "training-footballs", name: "Training Footballs", slug: "training-footballs", parentSlug: "soccer-footballs" },
      { id: "futsal-balls", name: "Futsal Balls", slug: "futsal-balls", parentSlug: "soccer-footballs" },
    ],
  },
];

export function getCategoryBySlug(slug: string): ShopCategory | undefined {
  return shopCategories.find((cat) => cat.slug === slug);
}

export function getSubcategoriesByCategorySlug(categorySlug: string): ShopSubcategory[] {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories || [];
}

export function getAllShopCategories(): ShopCategory[] {
  return shopCategories;
}
