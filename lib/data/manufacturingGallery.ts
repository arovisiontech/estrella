export type ManufacturingGalleryItem = {
  id: string;
  src: string;
  alt: string;
  placement:
    | "center"
    | "top"
    | "upper-left"
    | "upper-right"
    | "lower-left"
    | "lower-right"
    | "bottom";
};

export const manufacturingGallery: ManufacturingGalleryItem[] = [
  {
    id: "center",
    src: "/images/about/gallery-1.jpg",
    alt: "Estrella Custom Sportswear Manufacturing",
    placement: "center",
  },
  {
    id: "top",
    src: "/images/about/gallery-2.jpg",
    alt: "High-Tech Sublimation Printing",
    placement: "top",
  },
  {
    id: "upper-left",
    src: "/images/about/gallery-3.jpg",
    alt: "Precision Garment Cutting & Panel Assembly",
    placement: "upper-left",
  },
  {
    id: "upper-right",
    src: "/images/about/gallery-4.jpg",
    alt: "Custom Boxing Gear & Fightwear Production",
    placement: "upper-right",
  },
  {
    id: "lower-left",
    src: "/images/about/gallery-5.jpg",
    alt: "Soccer Football Hand Stitching & Inspection",
    placement: "lower-left",
  },
  {
    id: "lower-right",
    src: "/images/about/gallery-6.jpg",
    alt: "Precision Stainless Steel Tools Forging",
    placement: "lower-right",
  },
  {
    id: "bottom",
    src: "/images/about/gallery-7.jpg",
    alt: "Estrella Global Export Packaging",
    placement: "bottom",
  },
];
