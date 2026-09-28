import { manufacturingGallery, ManufacturingGalleryItem } from "@/lib/data/manufacturingGallery";

export interface AboutUsFullData {
  // Hero / Intro
  yearsValue: string;
  yearsLabel: string;
  locationText: string;
  mainHeading: string;
  paragraph1: string;
  paragraph2: string;
  gallery: ManufacturingGalleryItem[];

  // Approach
  approachEyebrow: string;
  approachHeading: string;
  approachDescription: string;

  // Tabs: Who We Are
  whoWeAreText: string;
  whoWeAreOffers: string[];

  // Tabs: Production
  productionTitle1: string;
  productionDesc1: string;
  productionTitle2: string;
  productionDesc2: string;
  productionTitle3: string;
  productionDesc3: string;

  // Tabs: Value
  value1Title: string;
  value1Desc: string;
  value2Title: string;
  value2Desc: string;
  value3Title: string;
  value3Desc: string;
}

export const defaultAboutUsData: AboutUsFullData = {
  yearsValue: "40+",
  yearsLabel: "Years of Manufacturing Excellence",
  locationText: "Founded In Sialkot, Pakistan",
  mainHeading:
    "ESTRELLA International Has Grown Into A Trusted Global Manufacturer Of High-Performance Sportswear, Boxing Equipment, Soccer Balls & Precision Surgical Instruments.",
  paragraph1:
    "Our vision is to empower global brands, sports clubs, distributors, and medical professionals with world-class OEM manufacturing and zero-defect quality control.",
  paragraph2:
    "At ESTRELLA International, we drive innovation by combining state-of-the-art sublimation printing technology, medical-grade German stainless steel forging, and ergonomic athletic design tailored to modern international standards.",
  gallery: manufacturingGallery,

  approachEyebrow: "OUR APPROACH",
  approachHeading: "Empowering Sustainable Growth In Industry",
  approachDescription:
    "We Drive Sustainable Solutions In Factory And Industrial Settings, Focusing On Efficiency, Innovation, And Environmental Responsibility To Support Long-Term Growth.",

  whoWeAreText:
    "ESTRELLA INTERNATIONAL is a premier manufacturer of custom sportswear, full sublimation athletic apparel, boxing gear, soccer balls, and surgical medical instruments. We collaborate with global brands, sports clubs, and medical distributors to deliver certified, high-performance OEM manufacturing.",
  whoWeAreOffers: [
    "ON-TIME GLOBAL DELIVERY",
    "COST-EFFICIENT B2B WHOLESALE SOLUTIONS",
    "HIGH-TECH SUBLIMATION & GERMAN STEEL FORGING",
    "CE & ISO 13485 CERTIFIED QUALITY CONTROL",
  ],

  productionTitle1: "Modern Production Environment",
  productionDesc1:
    "ESTRELLA INTERNATIONAL operates state-of-the-art manufacturing facilities equipped with digital sublimation printers, automated laser cutters, and German stainless steel forging machinery.",
  productionTitle2: "Skilled Workforce",
  productionDesc2:
    "Our dedicated team of craftspeople, textile engineers, and surgical technicians brings decades of experience ensuring excellence in design, construction, and quality control.",
  productionTitle3: "Bulk Wholesale Order Capacity",
  productionDesc3:
    "We are fully equipped to handle large-scale international production orders while maintaining our commitment to quality and timely shipping.",

  value1Title: "Innovation",
  value1Desc:
    "We continuously push the boundaries of sublimation printing, performance fabrics, and surgical tool ergonomics.",
  value2Title: "Certified Quality",
  value2Desc:
    "Excellence is non-negotiable. We adhere strictly to ISO 9001, ISO 13485, and CE international standards.",
  value3Title: "Customer Commitment",
  value3Desc:
    "Our global clients are partners in success. We listen, adapt, and deliver custom manufacturing solutions.",
};
