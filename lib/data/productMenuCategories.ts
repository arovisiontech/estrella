export type ProductMenuCategory = {
  id: string;
  name: string;
  slug: string;
  href: string;
  image: string;
  alt: string;
};

export const productMenuCategories: ProductMenuCategory[] = [
  {
    id: "sublimated-sportswear",
    name: "Sublimated Sportswear",
    slug: "sublimated-sportswear",
    href: "/categories/sublimated-sportswear",
    image: "/images/banner-sublimation-sports.svg",
    alt: "Sublimated Sportswear collection",
  },
  {
    id: "surgical-instruments",
    name: "Surgical & Dental Tools",
    slug: "surgical-instruments",
    href: "/categories/surgical-instruments",
    image: "/images/banner-surgical-tools.svg",
    alt: "Surgical and Dental instruments catalog",
  },
  {
    id: "boxing-martial-arts",
    name: "Boxing & Martial Arts",
    slug: "boxing-martial-arts",
    href: "/categories/boxing-martial-arts",
    image: "/images/banner-our-values.svg",
    alt: "Boxing gloves and protection gear",
  },
  {
    id: "soccer-footballs",
    name: "Soccer Footballs",
    slug: "soccer-footballs",
    href: "/categories/soccer-footballs",
    image: "/images/banner-sublimation-sports.svg",
    alt: "Match and training soccer footballs",
  },
  {
    id: "fitness-wear",
    name: "Gym & Fitness Wear",
    slug: "fitness-wear",
    href: "/categories/fitness-wear",
    image: "/images/banner-our-values.svg",
    alt: "Gym wear and activewear",
  },
  {
    id: "custom-apparel",
    name: "Custom Team Apparel",
    slug: "custom-apparel",
    href: "/categories/custom-apparel",
    image: "/images/banner-sublimation-sports.svg",
    alt: "Custom team uniforms and kits",
  },
];
