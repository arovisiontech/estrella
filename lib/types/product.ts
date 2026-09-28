export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  image: ProductImage;
};

export type ProductSize = {
  id: string;
  label: string;
  inStock: boolean;
};

export type ProductSpecification = {
  label: string;
  value: string;
};

export type ProductMedia =
  | { type: "image"; image: ProductImage }
  | { type: "video"; videoUrl: string; poster: ProductImage };

export type ProductHighlight = {
  title: string;
  description: string;
  image: ProductImage;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number;
  currency: string;
  shortDescription: string;
  description: string;
  mainImage: ProductImage;
  hoverImage: ProductImage;
  galleryImages: ProductImage[];
  thumbnails: ProductImage[];
  videoUrl?: string;
  videoPoster?: ProductImage;
  category: string;
  categoryLabel: string;
  subcategory?: string;
  tags: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  specifications: ProductSpecification[];
  materials: string[];
  features: string[];
  highlights: ProductHighlight[];
  stockQuantity: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isActive: boolean;
};
