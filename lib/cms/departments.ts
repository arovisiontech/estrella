import { createClient } from "@/lib/supabase/client";
import { type AdaptedDepartment, adaptDepartmentRow } from "./types";
import { withTimeout } from "@/lib/utils/timeout";
import { readLocalStore } from "./localStore";

export { adaptDepartmentRow };

export const DEFAULT_DEPARTMENTS: AdaptedDepartment[] = [
  {
    id: "dept-1",
    name: "Administration",
    slug: "administration",
    description: "Administration oversees strategic planning, operational management, corporate compliance, financial controls, and inter-departmental coordination across all manufacturing and export divisions.",
    shortDescription: "Strategic planning, corporate compliance, and global operations management.",
    image: { src: "/images/about/gallery-1.jpg", alt: "Administration Department" },
    icon: "Shield",
    badge: "Management",
    features: ["Global Supply Chain Planning", "ISO 9001 Compliance Audits", "Client Relationship Management"],
    capabilities: ["ERP Resource Planning", "Production Scheduling", "Financial Compliance"],
    equipment: ["Enterprise SAP/ERP Systems", "High-Speed Secure Fiber Network"],
    qualityStandards: ["100% On-Time Delivery Tracking", "ISO 9001:2015 Management System"],
    workflowSteps: [
      { step: "1", title: "Order Audit", description: "Review specs and production feasibility" },
      { step: "2", title: "Resource Allocation", description: "Assign raw materials & line schedules" },
    ],
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "dept-2",
    name: "Materials & Sourcing",
    slug: "materials-sourcing",
    description: "Responsible for evaluating, testing, and procuring top-tier technical fabrics, high-grade leather, moisture-wicking micro-polyester, and specialized threads from certified global mills.",
    shortDescription: "Procurement of technical fabrics, premium leather, and certified raw materials.",
    image: { src: "/images/about/gallery-2.jpg", alt: "Materials & Sourcing Department" },
    icon: "Layers",
    badge: "Material Science",
    features: ["OEKO-TEX Standard 100 Fabrics", "Genuine Cowhide & Aniline Leather Grading", "Tensile Strength & Shrinkage Testing"],
    capabilities: ["Global Supplier Audits", "Custom Color Dyeing", "Eco-Friendly Polymer Sourcing"],
    equipment: ["Fabric GSM Testers", "Digital Color Spectrophotometers"],
    qualityStandards: ["Zero Harmful Chemical Certification", "Batch-to-Batch Color Consistency"],
    workflowSteps: [
      { step: "1", title: "Inspection", description: "Test incoming yarn & fabric rolls for GSM and elasticity" },
      { step: "2", title: "Approval", description: "Issue lab dips and swatch cards for client sign-off" },
    ],
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "dept-3",
    name: "Cutting & Pattern Making",
    slug: "cutting-pattern-making",
    description: "Computerized automatic laser cutting and CAD pattern grading ensuring 100% dimensional accuracy, zero fabric distortion, and optimized material consumption across all athletic sizes.",
    shortDescription: "CAD computerized automatic laser pattern cutting & multi-size grading.",
    image: { src: "/images/about/gallery-3.jpg", alt: "Cutting & Pattern Making Department" },
    icon: "Scissors",
    badge: "Precision Cutting",
    features: ["Automated Vacuum Spreading", "Zero-Waste Laser Cutting", "Multi-Size CAD Grading"],
    capabilities: ["3D Digital Pattern Making", "Panel Identification Barcoding", "Material Yield Optimization"],
    equipment: ["Gerber Automatic Laser Cutters", "Digitizing CAD Pattern Tables"],
    qualityStandards: ["Panel Dimensional Tolerance ±0.5mm"],
    workflowSteps: [
      { step: "1", title: "Pattern Grading", description: "Generate digital CAD nested markers" },
      { step: "2", title: "Laser Cutting", description: "Automated high-precision fabric stack slicing" },
    ],
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "dept-4",
    name: "Production",
    slug: "production",
    description: "Advanced manufacturing facility equipped with heavy-duty Japanese automatic sewing machines for reinforced double stitching, flatlock seam assembly, and thermo-bonded panel joining.",
    shortDescription: "High-capacity garment assembly, stitching, and thermo-bonded manufacturing.",
    image: { src: "/images/about/gallery-4.jpg", alt: "Production Department" },
    icon: "Cpu",
    badge: "Manufacturing",
    features: ["High-Tenacity Nylon Seaming", "Ergonomic Athletic Fit Assembly", "Thermo-Bonded Seams"],
    capabilities: ["Sublimated Uniform Assembly", "Boxing Glove Hand Construction", "Protective Gear Assembly"],
    equipment: ["Juki Flatlock Machines", "Brother Automatic Sewing Units", "Thermal Bonding Presses"],
    qualityStandards: ["100% Seam Pull-Test Verification"],
    workflowSteps: [
      { step: "1", title: "Line Assembly", description: "Sequential panel stitching by specialized teams" },
      { step: "2", title: "Reinforcement", description: "Double-tack high stress points and seams" },
    ],
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "dept-5",
    name: "Embellishment",
    slug: "embellishment",
    description: "State-of-the-art Italian digital sublimation printers, multi-head Tajima embroidery machines, screen printing, 3D silicone badging, and metallic foil branding.",
    shortDescription: "Digital sublimation, multi-head embroidery, and 3D silicone badging.",
    image: { src: "/images/about/gallery-1.jpg", alt: "Embellishment Department" },
    icon: "Printer",
    badge: "Branding",
    features: ["Fade-Resistant Eco-Sublimation Inks", "High-Density 3D Silicone Transfers", "Multi-Thread Metallic Embroidery"],
    capabilities: ["Digital Artwork Vectorization", "Full-Bleed Sublimation Transfer", "Reflective Vinyl Heat-Press"],
    equipment: ["Large-Format Sublimation Printers", "Tajima 15-Needle Embroidery Heads"],
    qualityStandards: ["Wash-Fastness Grade 5 Rating"],
    workflowSteps: [
      { step: "1", title: "RIP Printing", description: "Print digital vector artwork on transfer paper" },
      { step: "2", title: "Heat Press", description: "Sublimate pigment directly into polyester fibers" },
    ],
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "dept-6",
    name: "Quality Control",
    slug: "quality-control",
    description: "Rigorous multi-stage quality control checking every seam, measurement, print accuracy, fabric elasticity, and finish before issuing final export release clearance.",
    shortDescription: "100% piece-by-piece multi-stage quality inspection & lab testing.",
    image: { src: "/images/about/gallery-5.jpg", alt: "Quality Control Department" },
    icon: "CheckCircle",
    badge: "AQL 1.0 Audit",
    features: ["100% Piece-by-Piece Inspection", "Spectrophotometer Color Audits", "Garment Sizing Precision Checks"],
    capabilities: ["Tensile Seam Testing", "Water Repellency Audits", "Packaging & Labeling Audit"],
    equipment: ["Digital Vernier Calipers", "Fabric Hydrostatic Head Testers"],
    qualityStandards: ["Strict AQL 1.0 Acceptance Level"],
    workflowSteps: [
      { step: "1", title: "Inline Inspection", description: "Audit stitching accuracy at assembly stations" },
      { step: "2", title: "Final Clearance", description: "24-point comprehensive pre-packing inspection" },
    ],
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "dept-7",
    name: "Packing & Dispatching",
    slug: "packing-dispatching",
    description: "Custom branded poly-bagging, silica desiccant inserts, barcode labeling, custom hangtags, and heavy-duty 7-ply corrugated export master cartoning.",
    shortDescription: "Custom poly-bagging, barcode tagging, and global export packaging.",
    image: { src: "/images/about/gallery-6.jpg", alt: "Packing & Dispatching Department" },
    icon: "Box",
    badge: "Global Logistics",
    features: ["Individual Sealed Poly Bags", "Custom Retail Hangtag Attachment", "Palletized Container Loading"],
    capabilities: ["Custom Barcode Generation", "Export Documentation", "Air & Sea Freight Dispatch"],
    equipment: ["Automatic Polybag Sealing Machines", "Pneumatic Carton Strapping Rigs"],
    qualityStandards: ["Drop-Tested ISTA 3A Master Cartons"],
    workflowSteps: [
      { step: "1", title: "Garment Folding", description: "Steam press, fold, and insert hangtags" },
      { step: "2", title: "Carton Packing", description: "Pack per size ratio into moisture-sealed cartons" },
    ],
    sortOrder: 7,
    isActive: true,
  },
  {
    id: "dept-8",
    name: "Research & Development",
    slug: "research-development",
    description: "Continuous innovation in moisture-wicking synthetic fabrics, high-impact shock-absorbing EVA foam padding, aerodynamic match ball surfaces, and athletic fits.",
    shortDescription: "Material science innovation, aerodynamic testing & athletic prototyping.",
    image: { src: "/images/about/gallery-7.jpg", alt: "Research & Development Department" },
    icon: "Activity",
    badge: "R&D Innovation",
    features: ["Aerodynamic Ball Panel Surface Tech", "Multi-Layer Density Foam Cushioning", "Ergonomic 3D Motion Fitting"],
    capabilities: ["Prototyping & Sample Development", "Lab Performance Testing", "Bio-Mechanical Fit Studies"],
    equipment: ["Fabric Breathability Chamber", "Impact Acceleration Simulation Sensors"],
    qualityStandards: ["Performance Spec Certification"],
    workflowSteps: [
      { step: "1", title: "Concepting", description: "Analyze athlete feedback and engineer prototype specs" },
      { step: "2", title: "Lab Testing", description: "Simulate extreme abrasion, impact, and sweat conditions" },
    ],
    sortOrder: 8,
    isActive: true,
  },
];

function getLocalDepartments(): AdaptedDepartment[] {
  try {
    const store = readLocalStore();
    if (!store.departments || store.departments.length === 0) return DEFAULT_DEPARTMENTS;

    const adapted = store.departments
      .map((d) => adaptDepartmentRow(d))
      .filter((d): d is AdaptedDepartment => d !== null);

    return adapted.length > 0 ? adapted : DEFAULT_DEPARTMENTS;
  } catch (err) {
    console.error("Failed reading local departments:", err);
    return DEFAULT_DEPARTMENTS;
  }
}

export async function getDepartments(): Promise<AdaptedDepartment[]> {
  const fallback = getLocalDepartments();

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return fallback;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallback;
    }

    const adapted = data
      .map((d) => adaptDepartmentRow(d))
      .filter((d): d is AdaptedDepartment => d !== null);

    return adapted.length > 0 ? adapted : fallback;
  };

  return await withTimeout(fetchFn(), fallback, 600);
}

export async function getDepartmentBySlug(slug: string): Promise<AdaptedDepartment | null> {
  const normSlug = slug.trim().toLowerCase();
  const allLocal = getLocalDepartments();
  const defaultMatch = allLocal.find(
    (d) =>
      d.slug === normSlug ||
      d.id === normSlug ||
      d.slug.replace(/-/g, "") === normSlug.replace(/-/g, "") ||
      d.name.toLowerCase().replace(/[^a-z0-9]/g, "").includes(normSlug.replace(/[^a-z0-9]/g, ""))
  );

  const fetchFn = async () => {
    const isConfigured = Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
    if (!isConfigured) return defaultMatch || null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return defaultMatch || null;
    }

    return adaptDepartmentRow(data);
  };

  return await withTimeout(fetchFn(), defaultMatch || null, 600);
}

export async function getDepartmentCount(): Promise<number> {
  const list = await getDepartments();
  return list.length;
}
