import type { CategoryData } from "./types";

export const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    id: "cat-sportswear",
    name: "Sportswears",
    slug: "sportswear",
    description: "Custom digital sublimation sportswear, athletic uniforms, tracksuits, hoodies and performance activewear.",
    banner_url: "/images/brochure-parallax.jpeg",
    image_url: "/images/about/gallery-1.jpg",
    sort_order: 1,
    is_active: true,
    subcategories: [
      { id: "sub-1", name: "Tracksuits", slug: "tracksuits", category_id: "cat-sportswear", sort_order: 1, is_active: true },
      { id: "sub-2", name: "Sublimation Shirts", slug: "sublimation-shirts", category_id: "cat-sportswear", sort_order: 2, is_active: true },
      { id: "sub-3", name: "Hoodies & Sweatshirts", slug: "hoodies", category_id: "cat-sportswear", sort_order: 3, is_active: true },
      { id: "sub-4", name: "Gym & Fitness Wear", slug: "fitness-wear", category_id: "cat-sportswear", sort_order: 4, is_active: true },
    ],
  },
  {
    id: "cat-boxing",
    name: "Boxing Equipment",
    slug: "boxing-equipment",
    description: "Handcrafted genuine leather boxing gloves, focus mitts, head guards, punching bags, and fightwear gear.",
    banner_url: "/images/about/gallery-4.jpg",
    image_url: "/images/about/gallery-4.jpg",
    sort_order: 2,
    is_active: true,
    subcategories: [
      { id: "sub-5", name: "Pro Boxing Gloves", slug: "pro-boxing-gloves", category_id: "cat-boxing", sort_order: 1, is_active: true },
      { id: "sub-6", name: "Focus Mitts & Target Pads", slug: "focus-pads", category_id: "cat-boxing", sort_order: 2, is_active: true },
      { id: "sub-7", name: "Head Guards & Protection", slug: "head-guards", category_id: "cat-boxing", sort_order: 3, is_active: true },
      { id: "sub-8", name: "Punching Bags", slug: "punching-bags", category_id: "cat-boxing", sort_order: 4, is_active: true },
    ],
  },
  {
    id: "cat-soccer",
    name: "Soccer Footballs",
    slug: "soccer-footballs",
    description: "FIFA standard thermo-bonded, hand-stitched match footballs, training soccer balls and futsal equipment.",
    banner_url: "/images/about/gallery-5.jpg",
    image_url: "/images/about/gallery-5.jpg",
    sort_order: 3,
    is_active: true,
    subcategories: [
      { id: "sub-9", name: "Official Match Footballs", slug: "match-footballs", category_id: "cat-soccer", sort_order: 1, is_active: true },
      { id: "sub-10", name: "Training Footballs", slug: "training-footballs", category_id: "cat-soccer", sort_order: 2, is_active: true },
      { id: "sub-11", name: "Futsal Balls", slug: "futsal-balls", category_id: "cat-soccer", sort_order: 3, is_active: true },
      { id: "sub-12", name: "Sublimated Footballs", slug: "sublimated-footballs", category_id: "cat-soccer", sort_order: 4, is_active: true },
    ],
  },
];
