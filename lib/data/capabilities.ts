export type Capability = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const capabilities: Capability[] = [
  {
    id: "oem-private-label",
    title: "OEM And Private Label",
    description:
      "We Manufacture To Your Brand Specifications With Full Confidentiality And Compliance Support.",
    icon: "Factory",
  },
  {
    id: "bulk-production",
    title: "Bulk Production Excellence",
    description:
      "Equipped With Modern Manufacturing Facilities, We Efficiently Handle Bulk Orders While Maintaining Consistency, Precision, And Superior Product Quality.",
    icon: "Package",
  },
  {
    id: "quality-assurance",
    title: "Quality Assurance",
    description:
      "Serving Fashion Brands, Retailers, Wholesalers, And Distributors Worldwide, We Provide Reliable Manufacturing Solutions.",
    icon: "CheckCircle",
  },
  {
    id: "innovation-sustainability",
    title: "Innovation & Sustainability",
    description:
      "We Manufacture To Your Brand Specifications With Full Confidentiality And Compliance Support.",
    icon: "Lightbulb",
  },
];
