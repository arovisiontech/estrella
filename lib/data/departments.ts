export type Department = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string;
  galleryImages: string[];
  sortOrder: number;
  isActive: boolean;
};

export const departments: Department[] = [
  {
    id: "1",
    name: "Administration",
    slug: "administration",
    shortDescription: "Strategic planning and operational management",
    description: "Administration oversees strategic planning, operational management, and coordination of all department activities. They ensure smooth workflow and efficient resource allocation across the entire organization.",
    image: "/images/banner-our-values.svg",
    galleryImages: ["/images/banner-our-values.svg"],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "2",
    name: "Materials & Sourcing",
    slug: "materials-sourcing",
    shortDescription: "Premium material selection and supplier management",
    description: "Materials & Sourcing is responsible for identifying, evaluating, and procuring high-grade technical fabrics, surgical steel, and specialized textiles. They maintain relationships with global suppliers and ensure consistent quality standards.",
    image: "/images/banner-sublimation-sports.svg",
    galleryImages: ["/images/banner-sublimation-sports.svg"],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "3",
    name: "Cutting & Pattern Making",
    slug: "cutting-pattern-making",
    shortDescription: "Precision pattern design and material cutting",
    description: "Cutting & Pattern Making creates precise patterns and cuts materials to exact specifications. Using advanced CAD systems and traditional craftsmanship, they ensure zero waste and maximum product quality.",
    image: "/images/banner-sublimation-sports.svg",
    galleryImages: ["/images/banner-sublimation-sports.svg"],
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "4",
    name: "Production",
    slug: "production",
    shortDescription: "State of the art garment and equipment production",
    description: "Production department manages mass manufacturing, stitching, assembly, and quality craft across all product lines with modern machinery.",
    image: "/images/banner-sublimation-sports.svg",
    galleryImages: ["/images/banner-sublimation-sports.svg"],
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "5",
    name: "Embellishment",
    slug: "embellishment",
    shortDescription: "Custom embroidery, printing, and branding details",
    description: "Embellishment specializes in high-definition screen printing, embroidery, 3D silicone badges, heat transfer logos, and custom branding.",
    image: "/images/banner-sublimation-sports.svg",
    galleryImages: ["/images/banner-sublimation-sports.svg"],
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "6",
    name: "Quality Control",
    slug: "quality-control",
    shortDescription: "Rigorous testing and quality assurance",
    description: "Quality Control implements multi-stage inspection and testing protocols. Every product undergoes rigorous quality checks to ensure they meet international standards and customer expectations.",
    image: "/images/banner-our-values.svg",
    galleryImages: ["/images/banner-our-values.svg"],
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "7",
    name: "Packing & Dispatching",
    slug: "packing-dispatching",
    shortDescription: "Secure packaging and logistics management",
    description: "Packing & Dispatching ensures products are securely packaged and efficiently dispatched to customers worldwide. They manage warehousing, inventory, and coordinate with logistics partners for timely delivery.",
    image: "/images/banner-sublimation-sports.svg",
    galleryImages: ["/images/banner-sublimation-sports.svg"],
    sortOrder: 7,
    isActive: true,
  },
  {
    id: "8",
    name: "Research & Development",
    slug: "research-development",
    shortDescription: "Innovation in design and material technology",
    description: "Research & Development drives innovation through continuous improvement and new product development. They collaborate with athletic coaches, surgeons, and engineers to create next-generation equipment.",
    image: "/images/banner-surgical-tools.svg",
    galleryImages: ["/images/banner-surgical-tools.svg"],
    sortOrder: 8,
    isActive: true,
  },
];

export const getDepartmentBySlug = (slug: string): Department | undefined => {
  return departments.find((dept) => dept.slug === slug && dept.isActive);
};

export const getActiveDepartments = (): Department[] => {
  return departments.filter((dept) => dept.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
};
