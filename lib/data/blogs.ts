import { Blog } from "@/lib/types/blog";

export const blogs: Blog[] = [
  {
    id: "1",
    title: "The Technology Behind High-Performance Motorcycles",
    slug: "technology-behind-high-performance-motorcycles",
    excerpt:
      "Discover the engineering innovations that power modern high-performance motorcycles and how they deliver exceptional speed and handling.",
    content: `# The Technology Behind High-Performance Motorcycles

High-performance motorcycles represent the pinnacle of engineering excellence. From advanced engine designs to cutting-edge materials, every component is optimized for maximum performance.

## Engine Technology

Modern motorcycle engines utilize advanced fuel injection systems, variable valve timing, and lightweight titanium components to achieve incredible power outputs while maintaining reliability.

## Aerodynamic Design

The aerodynamic profiles of racing motorcycles are meticulously crafted to reduce drag and improve stability at high speeds. Every curve and angle serves a purpose.

## Suspension Systems

Contemporary suspension systems use adaptive damping technology that adjusts in real-time to road conditions, providing superior handling and comfort.

## Materials Innovation

The shift to carbon fiber and aluminum alloys has reduced weight while increasing rigidity, fundamental to achieving better performance metrics.

## Braking Technology

Advanced ceramic brake systems provide consistent performance and shorter stopping distances, critical for safety at high speeds.

The continuous evolution of motorcycle technology ensures that riders can experience the ultimate combination of power, precision, and control.`,
    featured_image_url: "/images/Rectangle 557.png",
    author_name: "Torque Engineering Team",
    is_published: true,
    published_at: "2026-07-28",
    created_at: "2026-07-28",
    meta_title: "The Technology Behind High-Performance Motorcycles",
    meta_description:
      "Explore the cutting-edge engineering that powers high-performance motorcycles.",
    reading_time: 5,
  },
  {
    id: "2",
    title: "Motorcycle Gear Innovation: Safety Meets Style",
    slug: "motorcycle-gear-innovation-safety-meets-style",
    excerpt:
      "Explore the latest innovations in protective motorcycle gear that combine advanced safety features with contemporary design.",
    content: `# Motorcycle Gear Innovation: Safety Meets Style

Modern motorcycle protective gear has evolved far beyond basic protection. Today's gear combines cutting-edge materials with sophisticated design to provide riders with both safety and style.

## Material Science

Innovative textiles and composites now offer superior abrasion resistance, water resistance, and breathability. Materials like CORDURA and advanced neoprene provide multiple layers of protection.

## Impact Protection

Modern armor systems use non-Newtonian materials that remain flexible during normal movement but harden instantly upon impact, providing maximum protection without sacrificing comfort.

## Thermal Management

Ventilation systems in modern jackets and gear keep riders cool in summer while providing insulation in cold weather conditions. Mesh panels and strategic venting optimize airflow.

## Design Philosophy

Contemporary gear emphasizes sleek, urban aesthetics that work both on and off the bike. Designers now focus on creating protective equipment that riders want to wear.

## Technology Integration

Some premium gear now includes integrated communication systems, GPS tracking, and smart heating elements, bringing motorcycling into the digital age.

## Durability Standards

Modern manufacturing processes ensure that protective gear maintains its integrity over years of use, with reinforced seams and premium construction throughout.

The future of motorcycle gear is about seamless integration of protection, performance, and personal style.`,
    featured_image_url: "/images/Rectangle 558.png",
    author_name: "Torque Design Team",
    is_published: true,
    published_at: "2026-07-25",
    created_at: "2026-07-25",
    meta_title: "Motorcycle Gear Innovation: Safety Meets Style",
    meta_description:
      "Discover how modern motorcycle gear combines advanced safety with contemporary design.",
    reading_time: 6,
  },
];

export function getLatestPublishedBlogs(limit: number = 2): Blog[] {
  return blogs
    .filter((blog) => blog.is_published)
    .sort(
      (a, b) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    )
    .slice(0, limit);
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((blog) => blog.slug === slug && blog.is_published);
}

export function getPublishedBlogs(): Blog[] {
  return blogs
    .filter((blog) => blog.is_published)
    .sort(
      (a, b) =>
        new Date(b.published_at || b.created_at).getTime() -
        new Date(a.published_at || a.created_at).getTime()
    );
}
