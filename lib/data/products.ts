import type { Product, ProductColor, ProductImage } from "@/lib/types/product";

const IMAGE_POOL: ProductImage[] = [
  { src: "/images/banner-sublimation-sports.svg", alt: "Estrella Sublimation Sportswear" },
  { src: "/images/banner-surgical-tools.svg", alt: "Estrella Surgical Instruments" },
  { src: "/images/banner-our-values.svg", alt: "Estrella Quality Manufacturing" },
  { src: "/images/image 153.png", alt: "Estrella Product" },
];

function pool(offset: number) {
  return IMAGE_POOL[offset % IMAGE_POOL.length];
}

function galleryFrom(offset: number, count: number): ProductImage[] {
  return Array.from({ length: count }, (_, i) => pool(offset + i));
}

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL"].map((label) => ({
  id: label.toLowerCase(),
  label,
  inStock: true,
}));

function buildColors(offset: number): ProductColor[] {
  return [
    { id: "cyan-blue", name: "Estrella Cyan", hex: "#00AEF0", image: pool(offset) },
    { id: "navy-blue", name: "Navy Blue", hex: "#0f172a", image: pool(offset + 1) },
    { id: "pure-white", name: "Pure White", hex: "#ffffff", image: pool(offset + 2) },
  ];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Custom Sublimation Basketball Uniform Kit",
    slug: "custom-sublimation-basketball-kit",
    sku: "EST-SP-001",
    price: 4500,
    salePrice: 3800,
    currency: "PKR",
    shortDescription:
      "Full sublimation printed custom basketball jersey and shorts set for teams and clubs.",
    description:
      "Engineered for high-intensity game performance, our custom sublimation basketball kits feature 100% moisture-wicking polyester micro-mesh. Unlimited vibrant color options, custom numbers, team logos, and sponsor graphics infused directly into the fabric for zero fading or peeling.",
    mainImage: { src: "/images/banner-sublimation-sports.svg", alt: "Custom Sublimation Basketball Kit" },
    hoverImage: pool(1),
    galleryImages: galleryFrom(0, 4),
    thumbnails: [pool(0), pool(1), pool(2)],
    category: "sportswear",
    categoryLabel: "Sportswears",
    subcategory: "Basketball Kits",
    tags: ["Sublimation", "Custom", "Best Seller"],
    sizes: STANDARD_SIZES,
    colors: buildColors(0),
    specifications: [
      { label: "Fabric", value: "180 GSM Moisture-Wicking Micro Mesh" },
      { label: "Printing Method", value: "Full Sublimation Transfer" },
      { label: "Customization", value: "Names, Numbers, Team Logos & Sponsors" },
      { label: "Fit", value: "Athletic Ergonomic Fit" },
      { label: "Country of Origin", value: "Pakistan (Estrella Factory)" },
    ],
    materials: ["100% Polyester Micro Mesh", "Sublimation Inks"],
    features: [
      "Breathable moisture-wicking technology",
      "Vibrant fade-resistant sublimation printing",
      "Reinforced double-stitched seams",
      "Elastic waistband with interior drawstring",
    ],
    highlights: [
      {
        title: "Full Sublimation",
        description: "High-definition ink transfer for unlimited colors and crisp logos.",
        image: pool(0),
      },
      {
        title: "Moisture Wicking",
        description: "Keeps players dry and comfortable through intense quarters.",
        image: pool(1),
      },
    ],
    stockQuantity: 150,
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "2",
    name: "Pro Leather Training Boxing Gloves",
    slug: "pro-leather-boxing-gloves",
    sku: "EST-BX-002",
    price: 6500,
    salePrice: 5900,
    currency: "PKR",
    shortDescription:
      "Handcrafted genuine leather boxing gloves with multi-layer gel foam padding for spar and bag work.",
    description:
      "Designed for professional fighters and gyms, the Estrella Pro Leather Boxing Gloves are constructed from premium full-grain cowhide leather. Multi-layered EVA and gel shock-absorbing foam protect your knuckles, while the wide hook-and-loop wrist strap provides maximum wrist support.",
    mainImage: { src: "/images/banner-our-values.svg", alt: "Pro Leather Boxing Gloves" },
    hoverImage: pool(2),
    galleryImages: galleryFrom(1, 4),
    thumbnails: [pool(1), pool(2), pool(3)],
    category: "boxing-equipment",
    categoryLabel: "Boxing Equipment",
    subcategory: "Boxing Gloves",
    tags: ["Leather", "Boxing", "Pro Quality"],
    sizes: STANDARD_SIZES,
    colors: buildColors(1),
    specifications: [
      { label: "Material", value: "100% Genuine Cowhide Leather" },
      { label: "Padding", value: "Multi-layer Gel Shock Foam" },
      { label: "Closure", value: "Full Wrist Wrap Hook & Loop" },
      { label: "Sizes Available", value: "10oz, 12oz, 14oz, 16oz" },
      { label: "Country of Origin", value: "Pakistan" },
    ],
    materials: ["Genuine Cowhide Leather", "Gel Foam Padding", "Nylon Lining"],
    features: [
      "Hand-stitched leather construction",
      "Shock-absorbing multi-layer foam",
      "Attached thumb safety design",
      "Reinforced wrist support strap",
    ],
    highlights: [
      {
        title: "Gel Impact Protection",
        description: "Absorbs heavy bag and sparring impacts to prevent hand fatigue.",
        image: pool(2),
      },
    ],
    stockQuantity: 95,
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "3",
    name: "FIFA Standard Thermo-Bonded Soccer Match Ball",
    slug: "fifa-thermo-bonded-soccer-ball",
    sku: "EST-[#00AEF0]03",
    price: 3200,
    currency: "PKR",
    shortDescription:
      "Official size 5 thermo-bonded match soccer ball with textured PU surface for true flight.",
    description:
      "Built for professional matches and tournaments, the Estrella Thermo-Bonded Soccer Ball features seamless thermal bonding for zero water absorption and perfect roundness. The textured PU outer cover provides superior grip, aerodynamically tested for predictable trajectory.",
    mainImage: pool(2),
    hoverImage: pool(0),
    galleryImages: galleryFrom(2, 4),
    thumbnails: [pool(2), pool(0), pool(1)],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Match Footballs",
    tags: ["FIFA Quality", "Thermo-Bonded", "Match Ball"],
    sizes: STANDARD_SIZES,
    colors: buildColors(2),
    specifications: [
      { label: "Construction", value: "Seamless Thermo-Bonded 32 Panels" },
      { label: "Outer Material", value: "High-grade Textured Microfiber PU" },
      { label: "Bladder", value: "Taiwanese Butyl Bladder for Air Retention" },
      { label: "Size", value: "Official Size 5" },
    ],
    materials: ["Microfiber PU", "Butyl Bladder", "Thermal Adhesive"],
    features: [
      "Seamless thermo-bonding eliminates water absorption",
      "Aerodynamic textured surface for true flight",
      "Long-lasting air retention butyl bladder",
      "Official tournament weight and size standard",
    ],
    highlights: [],
    stockQuantity: 200,
    isNew: false,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "4",
    name: "German Stainless Steel Surgical Instruments Kit",
    slug: "german-stainless-steel-surgical-kit",
    sku: "EST-[#00AEF0]04",
    price: 12500,
    currency: "PKR",
    shortDescription:
      "CE and ISO 13485 certified German stainless steel surgical scissors and forceps set.",
    description:
      "Precision-crafted for medical professionals, surgeons, and hospitals, this Estrella Surgical Kit includes Mayo scissors, Iris scissors, Crile hemostatic forceps, and tissue forceps forged from Japanese & German medical-grade stainless steel with satin anti-glare finish.",
    mainImage: { src: "/images/banner-surgical-tools.svg", alt: "Surgical Instruments Kit" },
    hoverImage: pool(1),
    galleryImages: galleryFrom(3, 4),
    thumbnails: [pool(3), pool(1), pool(2)],
    category: "surgical-instruments",
    categoryLabel: "Surgical Instruments",
    subcategory: "General Surgery",
    tags: ["Medical Grade", "German Steel", "CE Certified"],
    sizes: STANDARD_SIZES,
    colors: buildColors(0),
    specifications: [
      { label: "Steel Grade", value: "AISI 420 German Stainless Steel" },
      { label: "Certification", value: "CE Mark, ISO 9001, ISO 13485" },
      { label: "Finish", value: "Satin Anti-Glare Finish" },
      { label: "Autoclavable", value: "Fully Sterilizable & Autoclavable" },
    ],
    materials: ["Medical Stainless Steel"],
    features: [
      "Corrosion-resistant medical grade steel",
      "Precision-ground ultra-sharp cutting edges",
      "Ergonomic finger loops for surgeon comfort",
      "Guaranteed lifetime warranty against defect",
    ],
    highlights: [],
    stockQuantity: 80,
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "5",
    name: "Custom Sublimation Soccer Jersey & Shorts Set",
    slug: "custom-sublimation-soccer-kit",
    sku: "EST-SP-005",
    price: 4200,
    currency: "PKR",
    shortDescription:
      "Lightweight, breathable custom sublimated football uniform kit for academies and clubs.",
    description:
      "Custom sublimated soccer kit engineered with 100% lightweight interlock polyester. Perfect for football academies, semi-pro clubs, and school teams.",
    mainImage: { src: "/images/banner-sublimation-sports.svg", alt: "Custom Soccer Kit" },
    hoverImage: pool(0),
    galleryImages: galleryFrom(0, 4),
    thumbnails: [pool(0), pool(1)],
    category: "sportswear",
    categoryLabel: "Sportswears",
    subcategory: "Soccer Kits",
    tags: ["Sublimation", "Soccer", "Custom"],
    sizes: STANDARD_SIZES,
    colors: buildColors(1),
    specifications: [
      { label: "Material", value: "100% Interlock Polyester" },
      { label: "Printing", value: "Full Digital Sublimation" },
    ],
    materials: ["Interlock Polyester"],
    features: ["Quick-dry fabric", "Custom numbers & logos", "Durable stitching"],
    highlights: [],
    stockQuantity: 120,
    isNew: false,
    isFeatured: true,
    isActive: true,
  },
];

export const productCategories = [
  { id: "sportswear", name: "Sportswears", slug: "sportswear" },
  { id: "boxing-equipment", name: "Boxing Equipment", slug: "boxing-equipment" },
  { id: "soccer-footballs", name: "Soccer Footballs", slug: "soccer-footballs" },
  { id: "surgical-instruments", name: "Surgical Instruments", slug: "surgical-instruments" },
];
