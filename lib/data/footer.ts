export type FooterLink = {
  id?: string;
  label: string;
  href?: string;
  count?: number;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const quickLinks: FooterLink[] = [
  { id: "1", label: "About Us", href: "/about" },
  { id: "2", label: "Catalogue PDFs", href: "/catalogue" },
  { id: "3", label: "Quality Control", href: "/quality" },
  { id: "4", label: "Compliance & Certifications", href: "/compliance" },
  { id: "5", label: "Contact Us", href: "/contact" },
];

export const productLinks: FooterLink[] = [
  { id: "p1", label: "Sportswears & Sublimation", href: "/categories/sportswear", count: 45 },
  { id: "p2", label: "Boxing Equipment", href: "/categories/boxing-equipment", count: 32 },
  { id: "p3", label: "Soccer Footballs", href: "/categories/soccer-footballs", count: 28 },
  { id: "p4", label: "Surgical & Medical Instruments", href: "/categories/surgical-instruments", count: 60 },
  { id: "p5", label: "Custom OEM Manufacturing", href: "/contact", count: 50 },
];

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
  },
];

export const contactInfo = {
  company: "ESTRELLA INTERNATIONAL SOLUTIONS",
  location: "Sialkot 51310 - Pakistan",
  phone: "+92-52-3561460",
  email: "info@estrella-international.com",
  ctaLink: "/contact",
};

export const agencyInfo = {
  name: "Estrella Digital Team",
  url: "#",
};
