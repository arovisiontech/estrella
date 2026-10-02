import fs from 'fs';
import path from 'path';

const storePath = path.resolve('lib/cms/localStore.json');
const defaultProductsPath = path.resolve('lib/cms/defaultProducts.ts');

const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

// Filter out any existing products with missing subcategories if already present
const existingIds = new Set(store.products.map(p => p.id));
const existingSkus = new Set(store.products.map(p => p.sku));

const newProducts = [
  // ==========================================
  // BOXING GLOVES (8 Products)
  // ==========================================
  {
    id: "prod-bg-001",
    name: "Pro Leather Training Boxing Gloves",
    slug: "pro-leather-training-boxing-gloves",
    sku: "EST-BG-001",
    price: 6500,
    currency: "PKR",
    shortDescription: "Handcrafted genuine leather boxing gloves with multi-layer gel foam padding.",
    description: "Designed for professional fighters, constructed from premium cowhide leather with ergonomic thumb-lock and secure hook-and-loop wrist strap.",
    mainImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/79.jpg", alt: "Pro Leather Boxing Gloves" },
    hoverImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/78.jpg", alt: "Pro Leather Boxing Gloves Detail" },
    galleryImages: [
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/79.jpg", alt: "Pro Leather Boxing Gloves" },
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/78.jpg", alt: "Pro Leather Boxing Gloves Detail" }
    ],
    category: "boxing-equipment",
    categoryLabel: "Boxing Equipment",
    subcategory: "Boxing Gloves",
    subcategory_id: "boxing-gloves",
    tags: ["Boxing Gloves", "Leather", "Sparring", "Pro Fight"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 100,
  },
  {
    id: "prod-bg-002",
    name: "Lace-Up Competition Fight Gloves",
    slug: "lace-up-competition-fight-gloves",
    sku: "EST-BG-002",
    price: 7200,
    currency: "PKR",
    shortDescription: "Professional fight gloves with precision lace closure for elite tournament bouts.",
    description: "Built strictly to international boxing commission standards. Features dense horsehair padding and water-resistant satin lining.",
    mainImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/77.jpg", alt: "Lace-Up Competition Fight Gloves" },
    hoverImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/76.jpg", alt: "Lace-Up Fight Gloves Detail" },
    galleryImages: [
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/77.jpg", alt: "Lace-Up Competition Fight Gloves" },
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/76.jpg", alt: "Lace-Up Fight Gloves Detail" }
    ],
    category: "boxing-equipment",
    categoryLabel: "Boxing Equipment",
    subcategory: "Boxing Gloves",
    subcategory_id: "boxing-gloves",
    tags: ["Boxing Gloves", "Lace-Up", "Tournament"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 80,
  },
  {
    id: "prod-bg-003",
    name: "Gel-Tech Sparring & Bag Gloves",
    slug: "gel-tech-sparring-bag-gloves",
    sku: "EST-BG-003",
    price: 5800,
    currency: "PKR",
    shortDescription: "Impact shock-dispersing gel knuckle core with reinforced wrist cuff.",
    description: "Engineered for intense sparring rounds and heavy bag workouts, delivering superior knuckle protection without sacrificing punch feel.",
    mainImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/75.jpg", alt: "Gel-Tech Sparring Gloves" },
    hoverImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/74.jpg", alt: "Gel-Tech Sparring Gloves Detail" },
    galleryImages: [
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/75.jpg", alt: "Gel-Tech Sparring Gloves" },
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/74.jpg", alt: "Gel-Tech Sparring Gloves Detail" }
    ],
    category: "boxing-equipment",
    categoryLabel: "Boxing Equipment",
    subcategory: "Boxing Gloves",
    subcategory_id: "boxing-gloves",
    tags: ["Boxing Gloves", "Gel-Tech", "Sparring"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 95,
  },
  {
    id: "prod-bg-004",
    name: "Elite Cowhide Hook & Loop Boxing Gloves",
    slug: "elite-cowhide-hook-loop-boxing-gloves",
    sku: "EST-BG-004",
    price: 6200,
    currency: "PKR",
    shortDescription: "Premium full-grain cowhide leather with quick-wrap Velcro strap.",
    description: "Crafted for durability and comfort with ventilated palm perforations and pre-curved anatomical fist structure.",
    mainImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/73.jpg", alt: "Elite Cowhide Boxing Gloves" },
    hoverImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/72.jpg", alt: "Elite Cowhide Boxing Gloves Detail" },
    galleryImages: [
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/73.jpg", alt: "Elite Cowhide Boxing Gloves" },
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/72.jpg", alt: "Elite Cowhide Boxing Gloves Detail" }
    ],
    category: "boxing-equipment",
    categoryLabel: "Boxing Equipment",
    subcategory: "Boxing Gloves",
    subcategory_id: "boxing-gloves",
    tags: ["Boxing Gloves", "Cowhide", "Training"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 110,
  },
  {
    id: "prod-bg-005",
    name: "Mexican Style Fighter Boxing Gloves",
    slug: "mexican-style-fighter-boxing-gloves",
    sku: "EST-BG-005",
    price: 7800,
    currency: "PKR",
    shortDescription: "Authentic sleek Mexican profile glove with firm contact punch surface.",
    description: "Features long cuff design for wrist alignment, water-repellent nylon lining, and premium latex foam padding.",
    mainImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/71.jpg", alt: "Mexican Style Boxing Gloves" },
    hoverImage: { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/79.jpg", alt: "Mexican Style Boxing Gloves Detail" },
    galleryImages: [
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/71.jpg", alt: "Mexican Style Boxing Gloves" },
      { src: "https://estrella.graphixals.com/wp-content/uploads/2026/08/79.jpg", alt: "Mexican Style Boxing Gloves Detail" }
    ],
    category: "boxing-equipment",
    categoryLabel: "Boxing Equipment",
    subcategory: "Boxing Gloves",
    subcategory_id: "boxing-gloves",
    tags: ["Boxing Gloves", "Mexican Style", "Fighter"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 75,
  },

  // ==========================================
  // THERMO BONDED SOCCER BALLS (5 Products)
  // ==========================================
  {
    id: "prod-tb-001",
    name: "FIFA Quality Pro Thermo-Bonded Match Ball",
    slug: "fifa-quality-pro-thermo-bonded-match-ball",
    sku: "EST-TB-001",
    price: 4200,
    currency: "PKR",
    shortDescription: "Seamless thermal-bonded official match ball with micro-textured aerotrac casing.",
    description: "Zero water absorption construction certified for international tournament play. Features butyl bladder and high-elasticity EVA foam underlayer.",
    mainImage: { src: "/images/footballs/football-1.jpg", alt: "FIFA Quality Pro Thermo Match Ball" },
    hoverImage: { src: "/images/footballs/football-2.jpg", alt: "FIFA Quality Pro Match Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-1.jpg", alt: "FIFA Quality Pro Thermo Match Ball" },
      { src: "/images/footballs/football-2.jpg", alt: "FIFA Quality Pro Match Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Thermo Bonded Soccer Balls",
    subcategory_id: "thermo-bonded-soccer-balls",
    tags: ["Thermo Bonded", "FIFA Match Ball", "Tournament"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 120,
  },
  {
    id: "prod-tb-002",
    name: "Seamless Tournament Thermo-Bonded Football",
    slug: "seamless-tournament-thermo-bonded-football",
    sku: "EST-TB-002",
    price: 3800,
    currency: "PKR",
    shortDescription: "High-grade textured PU surface with precision thermal panel joints.",
    description: "Engineered for optimal ball trajectory and explosive rebound in both wet and dry conditions. 32-panel aerodynamic symmetry.",
    mainImage: { src: "/images/footballs/football-2.jpg", alt: "Seamless Tournament Thermo Football" },
    hoverImage: { src: "/images/footballs/football-3.jpg", alt: "Seamless Tournament Thermo Football Detail" },
    galleryImages: [
      { src: "/images/footballs/football-2.jpg", alt: "Seamless Tournament Thermo Football" },
      { src: "/images/footballs/football-3.jpg", alt: "Seamless Tournament Thermo Football Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Thermo Bonded Soccer Balls",
    subcategory_id: "thermo-bonded-soccer-balls",
    tags: ["Thermo Bonded", "Tournament", "Match Ball"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 100,
  },
  {
    id: "prod-tb-003",
    name: "Elite Aerodynamic Thermo Match Ball",
    slug: "elite-aerodynamic-thermo-match-ball",
    sku: "EST-TB-003",
    price: 4500,
    currency: "PKR",
    shortDescription: "Official size 5 thermal bonded ball with structured micro-dimples for true flight.",
    description: "Designed for elite clubs and professional stadiums with seamless casing and reinforced latex-wound core.",
    mainImage: { src: "/images/footballs/football-3.jpg", alt: "Elite Aerodynamic Thermo Match Ball" },
    hoverImage: { src: "/images/footballs/football-4.jpg", alt: "Elite Aerodynamic Thermo Match Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-3.jpg", alt: "Elite Aerodynamic Thermo Match Ball" },
      { src: "/images/footballs/football-4.jpg", alt: "Elite Aerodynamic Thermo Match Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Thermo Bonded Soccer Balls",
    subcategory_id: "thermo-bonded-soccer-balls",
    tags: ["Thermo Bonded", "Elite", "Pro Flight"],
    isNew: true,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 90,
  },
  {
    id: "prod-tb-004",
    name: "Premier League Spec Thermal Match Football",
    slug: "premier-league-spec-thermal-match-football",
    sku: "EST-TB-004",
    price: 4100,
    currency: "PKR",
    shortDescription: "Top-tier thermo-bonded construction with maximum shape retention.",
    description: "Passed rigorous pressure and rebound tests. Multi-laminate backing ensures zero seam distortion after thousands of kicks.",
    mainImage: { src: "/images/footballs/football-4.jpg", alt: "Premier Thermal Football" },
    hoverImage: { src: "/images/footballs/football-5.jpg", alt: "Premier Thermal Football Detail" },
    galleryImages: [
      { src: "/images/footballs/football-4.jpg", alt: "Premier Thermal Football" },
      { src: "/images/footballs/football-5.jpg", alt: "Premier Thermal Football Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Thermo Bonded Soccer Balls",
    subcategory_id: "thermo-bonded-soccer-balls",
    tags: ["Thermo Bonded", "Premier Spec"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 85,
  },

  // ==========================================
  // HAND STITCHED SOCCER BALLS (4 Products)
  // ==========================================
  {
    id: "prod-hs-001",
    name: "Traditional 32-Panel Hand-Stitched Soccer Ball",
    slug: "traditional-32-panel-hand-stitched-soccer-ball",
    sku: "EST-HS-001",
    price: 2800,
    currency: "PKR",
    shortDescription: "Classic 32-panel hand-stitched soccer ball using heavy-duty 5-ply polyester thread.",
    description: "Traditional hand-stitched craftsmanship from Sialkot. Premium shiny PU outer layer with double-coated latex bladder for consistent touch.",
    mainImage: { src: "/images/footballs/football-5.jpg", alt: "Traditional Hand-Stitched Soccer Ball" },
    hoverImage: { src: "/images/footballs/football-6.jpg", alt: "Hand-Stitched Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-5.jpg", alt: "Traditional Hand-Stitched Soccer Ball" },
      { src: "/images/footballs/football-6.jpg", alt: "Hand-Stitched Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Hand Stitched Soccer Balls",
    subcategory_id: "hand-stitched-soccer-balls",
    tags: ["Hand Stitched", "Classic", "Academy"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 150,
  },
  {
    id: "prod-hs-002",
    name: "Academy Club Tournament Hand-Stitched Football",
    slug: "academy-club-tournament-hand-stitched-football",
    sku: "EST-HS-002",
    price: 2600,
    currency: "PKR",
    shortDescription: "Ultra-durable hand-crafted training and tournament ball for sports academies.",
    description: "Reinforced 4-ply cotton and polyester lamination beneath a scuff-resistant grain PU casing. Perfect for grass and turf.",
    mainImage: { src: "/images/footballs/football-6.jpg", alt: "Academy Hand-Stitched Football" },
    hoverImage: { src: "/images/footballs/football-7.jpg", alt: "Academy Football Detail" },
    galleryImages: [
      { src: "/images/footballs/football-6.jpg", alt: "Academy Hand-Stitched Football" },
      { src: "/images/footballs/football-7.jpg", alt: "Academy Football Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Hand Stitched Soccer Balls",
    subcategory_id: "hand-stitched-soccer-balls",
    tags: ["Hand Stitched", "Club Training"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 130,
  },
  {
    id: "prod-hs-003",
    name: "Classic Retro Leather Hand-Stitched Football",
    slug: "classic-retro-leather-hand-stitched-football",
    sku: "EST-HS-003",
    price: 3200,
    currency: "PKR",
    shortDescription: "Vintage aesthetics with modern high-performance hand-stitched durability.",
    description: "Top-grain genuine leather finish with waxed hand-stitching and reinforced butyl bladder for timeless look and superior feel.",
    mainImage: { src: "/images/footballs/football-7.jpg", alt: "Retro Leather Football" },
    hoverImage: { src: "/images/footballs/football-1.jpg", alt: "Retro Leather Football Detail" },
    galleryImages: [
      { src: "/images/footballs/football-7.jpg", alt: "Retro Leather Football" },
      { src: "/images/footballs/football-1.jpg", alt: "Retro Leather Football Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Hand Stitched Soccer Balls",
    subcategory_id: "hand-stitched-soccer-balls",
    tags: ["Hand Stitched", "Vintage Leather"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 70,
  },

  // ==========================================
  // FUTSAL BALLS (4 Products)
  // ==========================================
  {
    id: "prod-fs-001",
    name: "Pro Low-Bounce Official Futsal Match Ball",
    slug: "pro-low-bounce-official-futsal-match-ball",
    sku: "EST-FS-001",
    price: 3400,
    currency: "PKR",
    shortDescription: "Official size 4 low-bounce futsal ball engineered for hard indoor surfaces.",
    description: "Stuffed synthetic fiber bladder provides controlled low bounce for fast-paced technical footwork. Microfiber PU cover with deep grip texture.",
    mainImage: { src: "/images/footballs/football-1.jpg", alt: "Pro Low-Bounce Futsal Ball" },
    hoverImage: { src: "/images/footballs/football-2.jpg", alt: "Futsal Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-1.jpg", alt: "Pro Low-Bounce Futsal Ball" },
      { src: "/images/footballs/football-2.jpg", alt: "Futsal Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Futsal Balls",
    subcategory_id: "futsal-balls",
    tags: ["Futsal", "Low Bounce", "Indoor Match"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 90,
  },
  {
    id: "prod-fs-002",
    name: "Indoor Court Speed Control Futsal Ball",
    slug: "indoor-court-speed-control-futsal-ball",
    sku: "EST-FS-002",
    price: 3100,
    currency: "PKR",
    shortDescription: "High-visibility optic pattern futsal ball with cushioned touch response.",
    description: "32-panel hand-stitched indoor match ball featuring scuff-resistant finish for wooden gym floors and turf cages.",
    mainImage: { src: "/images/footballs/football-3.jpg", alt: "Indoor Court Futsal Ball" },
    hoverImage: { src: "/images/footballs/football-4.jpg", alt: "Indoor Futsal Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-3.jpg", alt: "Indoor Court Futsal Ball" },
      { src: "/images/footballs/football-4.jpg", alt: "Indoor Futsal Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Futsal Balls",
    subcategory_id: "futsal-balls",
    tags: ["Futsal", "Speed Control"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 85,
  },

  // ==========================================
  // HAND BALLS (4 Products)
  // ==========================================
  {
    id: "prod-hb-001",
    name: "Official Match Grip Competition Handball Size 3",
    slug: "official-match-grip-competition-handball-size-3",
    sku: "EST-HB-001",
    price: 2900,
    currency: "PKR",
    shortDescription: "IHF specification competition handball with soft resin-ready grip surface.",
    description: "Constructed with soft polyurethane and zero-wing latex bladder for optimal roundness, bounce, and superior one-handed grip.",
    mainImage: { src: "/images/footballs/football-7.jpg", alt: "Competition Handball" },
    hoverImage: { src: "/images/footballs/football-6.jpg", alt: "Competition Handball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-7.jpg", alt: "Competition Handball" },
      { src: "/images/footballs/football-6.jpg", alt: "Competition Handball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Hand Balls",
    subcategory_id: "hand-balls",
    tags: ["Handball", "IHF Spec", "Match Grip"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 75,
  },
  {
    id: "prod-hb-002",
    name: "Resin-Friendly Training Handball Size 2",
    slug: "resin-friendly-training-handball-size-2",
    sku: "EST-HB-002",
    price: 2600,
    currency: "PKR",
    shortDescription: "High-tack synthetic leather handball designed for academy training.",
    description: "Maintains high friction grip with or without glue. Durable hand-stitched seams handle heavy indoor impact.",
    mainImage: { src: "/images/footballs/football-5.jpg", alt: "Training Handball" },
    hoverImage: { src: "/images/footballs/football-4.jpg", alt: "Training Handball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-5.jpg", alt: "Training Handball" },
      { src: "/images/footballs/football-4.jpg", alt: "Training Handball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Hand Balls",
    subcategory_id: "hand-balls",
    tags: ["Handball", "Size 2", "Training"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 80,
  },

  // ==========================================
  // KIDS FOAMING BALLS (4 Products)
  // ==========================================
  {
    id: "prod-kf-001",
    name: "Safe Soft-Touch Kids Foam Training Soccer Ball",
    slug: "safe-soft-touch-kids-foam-training-soccer-ball",
    sku: "EST-KF-001",
    price: 1800,
    currency: "PKR",
    shortDescription: "Ultra-safe lightweight foam ball for kids indoor and outdoor football fun.",
    description: "High-density non-toxic PU foam prevents injury and window damage while teaching young children shooting and dribbling mechanics.",
    mainImage: { src: "/images/footballs/football-2.jpg", alt: "Kids Foam Training Ball" },
    hoverImage: { src: "/images/footballs/football-3.jpg", alt: "Kids Foam Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-2.jpg", alt: "Kids Foam Training Ball" },
      { src: "/images/footballs/football-3.jpg", alt: "Kids Foam Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Kids Foaming Balls",
    subcategory_id: "kids-foaming-balls",
    tags: ["Kids Ball", "Foam", "Safe Play"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 150,
  },
  {
    id: "prod-kf-002",
    name: "High-Density Coated Foam Junior Football",
    slug: "high-density-coated-foam-junior-football",
    sku: "EST-KF-002",
    price: 1600,
    currency: "PKR",
    shortDescription: "Durable washable vinyl-coated foam football for schools and toddler play.",
    description: "Tear-resistant hygienic skin coating ensures long-lasting fun in grass, school halls, and backyards.",
    mainImage: { src: "/images/footballs/football-4.jpg", alt: "Coated Foam Junior Football" },
    hoverImage: { src: "/images/footballs/football-5.jpg", alt: "Junior Foam Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-4.jpg", alt: "Coated Foam Junior Football" },
      { src: "/images/footballs/football-5.jpg", alt: "Junior Foam Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Kids Foaming Balls",
    subcategory_id: "kids-foaming-balls",
    tags: ["Kids Ball", "Junior Football"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 140,
  },

  // ==========================================
  // RUGBY BALLS (4 Products)
  // ==========================================
  {
    id: "prod-rb-001",
    name: "Pro Match Grip Official Size 5 Rugby Ball",
    slug: "pro-match-grip-official-size-5-rugby-ball",
    sku: "EST-RB-001",
    price: 3500,
    currency: "PKR",
    shortDescription: "Official size 5 4-panel rugby ball with multipoint rubber pimple grip.",
    description: "Engineered with 3-ply poly-cotton lining and Truflight valve in-seam for precise spiral kicks and handling in muddy or wet conditions.",
    mainImage: { src: "/images/footballs/football-4.jpg", alt: "Pro Match Rugby Ball" },
    hoverImage: { src: "/images/footballs/football-5.jpg", alt: "Pro Rugby Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-4.jpg", alt: "Pro Match Rugby Ball" },
      { src: "/images/footballs/football-5.jpg", alt: "Pro Rugby Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Rugby Balls",
    subcategory_id: "rugby-balls",
    tags: ["Rugby", "Size 5", "Match Grip"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 80,
  },
  {
    id: "prod-rb-002",
    name: "Club All-Weather Rubber Grip Rugby Ball",
    slug: "club-all-weather-rubber-grip-rugby-ball",
    sku: "EST-RB-002",
    price: 3100,
    currency: "PKR",
    shortDescription: "High-durability training rugby ball with deep pyramid grain traction.",
    description: "Long-wearing natural rubber surface with water-resistant polyester backing for club practices and heavy tackle drills.",
    mainImage: { src: "/images/footballs/football-6.jpg", alt: "All-Weather Rugby Ball" },
    hoverImage: { src: "/images/footballs/football-7.jpg", alt: "All-Weather Rugby Ball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-6.jpg", alt: "All-Weather Rugby Ball" },
      { src: "/images/footballs/football-7.jpg", alt: "All-Weather Rugby Ball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Rugby Balls",
    subcategory_id: "rugby-balls",
    tags: ["Rugby", "Club Training"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 95,
  },

  // ==========================================
  // VOLLEY BALLS (4 Products)
  // ==========================================
  {
    id: "prod-vb-001",
    name: "Official 18-Panel Soft-Touch Match Volleyball",
    slug: "official-18-panel-soft-touch-match-volleyball",
    sku: "EST-VB-001",
    price: 3200,
    currency: "PKR",
    shortDescription: "Official regulation size and weight volleyball with soft micro-fiber composite leather.",
    description: "Features laminated 18-panel construction and nylon-wound butyl bladder for zero sting impact during power spikes and setting drills.",
    mainImage: { src: "/images/footballs/football-6.jpg", alt: "Official Match Volleyball" },
    hoverImage: { src: "/images/footballs/football-7.jpg", alt: "Match Volleyball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-6.jpg", alt: "Official Match Volleyball" },
      { src: "/images/footballs/football-7.jpg", alt: "Match Volleyball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Volley Balls",
    subcategory_id: "volley-balls",
    tags: ["Volleyball", "Match Ball", "Soft Touch"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    isPublished: true,
    stockQuantity: 110,
  },
  {
    id: "prod-vb-002",
    name: "Pro Outdoor Sand & Beach Volleyball",
    slug: "pro-outdoor-sand-beach-volleyball",
    sku: "EST-VB-002",
    price: 2900,
    currency: "PKR",
    shortDescription: "Water-resistant stitched beach volleyball with high-visibility color blocking.",
    description: "Designed specifically for beach volleyball and outdoor tournaments with sponge-backed composite synthetic leather.",
    mainImage: { src: "/images/footballs/football-1.jpg", alt: "Beach Volleyball" },
    hoverImage: { src: "/images/footballs/football-2.jpg", alt: "Beach Volleyball Detail" },
    galleryImages: [
      { src: "/images/footballs/football-1.jpg", alt: "Beach Volleyball" },
      { src: "/images/footballs/football-2.jpg", alt: "Beach Volleyball Detail" }
    ],
    category: "soccer-footballs",
    categoryLabel: "Soccer Footballs",
    subcategory: "Volley Balls",
    subcategory_id: "volley-balls",
    tags: ["Volleyball", "Beach Volleyball"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    isPublished: true,
    stockQuantity: 100,
  }
];

// Append new products, ensuring no duplicate IDs
const formattedNew = newProducts.map((p, idx) => ({
  ...p,
  thumbnails: p.galleryImages,
  sortOrder: store.products.length + idx + 1,
}));

const existingFiltered = store.products.filter(p => !existingIds.has(p.id) && !existingSkus.has(p.sku));
const combined = [...store.products, ...formattedNew];

store.products = combined;
fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');

const tsContent = `import type { AdaptedProduct } from "./types";\n\nexport const DEFAULT_PRODUCTS: AdaptedProduct[] = ${JSON.stringify(
  combined,
  null,
  2
)};\n`;

fs.writeFileSync(defaultProductsPath, tsContent, 'utf8');
console.log(`Successfully added ${formattedNew.length} subcategory products! Total products now: ${combined.length}`);
