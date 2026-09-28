export interface Catalogue {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  version: string;
  pages: number;
  language: string;
  fileSize: string;
  pdfUrl: string;
  passwordProtected: boolean;
  password?: string;
  featured: boolean;
  updatedDate: string;
  displayOrder: number;
  status: "active" | "draft" | "archived";
  category: "leather-jackets" | "motorbike-jackets" | "touring-jackets" | "gloves" | "textile-trousers" | "rain-gear" | "accessories";
}

export const catalogues: Catalogue[] = [
  {
    id: "1",
    slug: "leather-jackets-2024",
    title: "Leather Jackets Collection 2024",
    description: "Premium leather jackets designed for ultimate protection and style. Browse our latest collection of motorcycle leather apparel.",
    coverImage: "/images/Banner-3 2 - Copy.png",
    version: "2024.1",
    pages: 48,
    language: "English",
    fileSize: "12.5 MB",
    pdfUrl: "/catalogues/leather-jackets-2024.pdf",
    passwordProtected: false,
    featured: true,
    updatedDate: "2024-01-15",
    displayOrder: 2,
    status: "active",
    category: "leather-jackets",
  },
  {
    id: "2",
    slug: "motorbike-jackets-2024",
    title: "Motorbike Jackets Premium Line",
    description: "High-performance motorbike jackets with advanced safety features and ergonomic design.",
    coverImage: "/images/Banner-4 2 - Copy.png",
    version: "2024.1",
    pages: 56,
    language: "English",
    fileSize: "15.2 MB",
    pdfUrl: "/catalogues/motorbike-jackets-2024.pdf",
    passwordProtected: false,
    featured: true,
    updatedDate: "2024-02-10",
    displayOrder: 1,
    status: "active",
    category: "motorbike-jackets",
  },
  {
    id: "3",
    slug: "touring-jackets-2024",
    title: "Touring Jackets Collection",
    description: "Built for long-distance comfort and protection. Our touring jackets combine style with functionality.",
    coverImage: "/images/Banner-5 1 - Copy.png",
    version: "2024.1",
    pages: 44,
    language: "English",
    fileSize: "13.8 MB",
    pdfUrl: "/catalogues/touring-jackets-2024.pdf",
    passwordProtected: false,
    featured: false,
    updatedDate: "2024-01-20",
    displayOrder: 3,
    status: "active",
    category: "touring-jackets",
  },
  {
    id: "4",
    slug: "gloves-summer-winter-2024",
    title: "Premium Gloves Collection",
    description: "Complete range of summer and winter motorcycle gloves with superior grip and protection.",
    coverImage: "/images/image 249.png",
    version: "2024.1",
    pages: 32,
    language: "English",
    fileSize: "9.5 MB",
    pdfUrl: "/catalogues/gloves-2024.pdf",
    passwordProtected: false,
    featured: false,
    updatedDate: "2024-03-05",
    displayOrder: 4,
    status: "active",
    category: "gloves",
  },
  {
    id: "5",
    slug: "textile-trousers-2024",
    title: "Textile Trousers Premium Range",
    description: "Durable and comfortable textile trousers designed for all-season riding.",
    coverImage: "/images/image 250.png",
    version: "2024.1",
    pages: 28,
    language: "English",
    fileSize: "8.2 MB",
    pdfUrl: "/catalogues/textile-trousers-2024.pdf",
    passwordProtected: false,
    featured: false,
    updatedDate: "2024-02-28",
    displayOrder: 5,
    status: "active",
    category: "textile-trousers",
  },
  {
    id: "6",
    slug: "rain-gear-2024",
    title: "Rain Gear Collection",
    description: "Waterproof and weather-resistant gear for wet weather riding.",
    coverImage: "/images/image 251.png",
    version: "2024.1",
    pages: 24,
    language: "English",
    fileSize: "7.5 MB",
    pdfUrl: "/catalogues/rain-gear-2024.pdf",
    passwordProtected: false,
    featured: false,
    updatedDate: "2024-03-15",
    displayOrder: 6,
    status: "active",
    category: "rain-gear",
  },
];

export const catalogueCategories = [
  { id: "all", label: "All", value: "all" },
  { id: "leather-jackets", label: "Leather Jackets", value: "leather-jackets" },
  { id: "motorbike-jackets", label: "Motorbike Jackets", value: "motorbike-jackets" },
  { id: "touring-jackets", label: "Touring Jackets", value: "touring-jackets" },
  { id: "gloves", label: "Gloves", value: "gloves" },
  { id: "textile-trousers", label: "Textile Trousers", value: "textile-trousers" },
  { id: "rain-gear", label: "Rain Gear", value: "rain-gear" },
  { id: "accessories", label: "Accessories", value: "accessories" },
];

export const sortOptions = [
  { id: "newest", label: "Newest First", value: "newest" },
  { id: "oldest", label: "Oldest First", value: "oldest" },
  { id: "a-z", label: "Name A-Z", value: "a-z" },
  { id: "updated", label: "Latest Updated", value: "updated" },
];
