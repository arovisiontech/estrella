export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image: {
    src: string;
    alt: string;
  };
  rowStyle: "white" | "black";
};

export const categories: CategoryItem[] = [
  // Row 1 - White style
  {
    id: "sublimated-sportswear",
    name: "Sublimated Sportswear",
    slug: "sublimated-sportswear",
    image: {
      src: "/images/banner-sublimation-sports.svg",
      alt: "Sublimated Sportswear Collection",
    },
    rowStyle: "white",
  },
  {
    id: "surgical-instruments",
    name: "Surgical & Dental Instruments",
    slug: "surgical-instruments",
    image: {
      src: "/images/banner-surgical-tools.svg",
      alt: "Surgical Instruments Collection",
    },
    rowStyle: "white",
  },
  {
    id: "boxing-martial-arts",
    name: "Boxing & Martial Arts",
    slug: "boxing-martial-arts",
    image: {
      src: "/images/banner-our-values.svg",
      alt: "Boxing Equipment Collection",
    },
    rowStyle: "white",
  },
  // Row 2 - Black style
  {
    id: "soccer-footballs",
    name: "Soccer Footballs & Teamwear",
    slug: "soccer-footballs",
    image: {
      src: "/images/banner-sublimation-sports.svg",
      alt: "Soccer Footballs Collection",
    },
    rowStyle: "black",
  },
  {
    id: "fitness-wear",
    name: "Gym & Fitness Wear",
    slug: "fitness-wear",
    image: {
      src: "/images/banner-our-values.svg",
      alt: "Fitness Wear Collection",
    },
    rowStyle: "black",
  },
  {
    id: "custom-apparel",
    name: "Custom Team Apparel",
    slug: "custom-apparel",
    image: {
      src: "/images/banner-surgical-tools.svg",
      alt: "Custom Team Apparel Collection",
    },
    rowStyle: "black",
  },
];

export function getCategoryBySlug(slug: string): CategoryItem | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getAllCategories(): CategoryItem[] {
  return categories;
}
