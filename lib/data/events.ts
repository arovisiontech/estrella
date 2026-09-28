import { Event, EventCategory, EventType } from "@/lib/types/event";

export const eventCategories: EventCategory[] = [
  { id: "1", label: "Exhibitions", value: "Exhibition" },
  { id: "2", label: "Product Launches", value: "Product Launch" },
  { id: "3", label: "Manufacturing", value: "Manufacturing" },
  { id: "4", label: "Medical Expos", value: "Motorcycle Show" },
  { id: "5", label: "Conferences", value: "Conference" },
  { id: "6", label: "Community Events", value: "Community Event" },
];

export const events: Event[] = [
  {
    id: "1",
    title: "Estrella Global Sports & Apparel Expo 2026",
    slug: "estrella-global-sports-expo-2026",
    shortDescription: "Explore our latest collection of premium sublimated sportswear and soccer equipment.",
    content: "Join us for an exclusive showcase of Estrella International's premium sportswear collection. Experience cutting-edge designs, breathable fabrics, and customized teamwear options. Meet our team, view samples, and discuss custom OEM partnerships.",
    featuredImage: "/images/banner-sublimation-sports.svg",
    eventType: "Exhibition",
    eventDate: "2026-06-15",
    endDate: "2026-06-17",
    location: "Lahore Expo Center, Lahore, Pakistan",
    organizer: "Estrella International",
    registrationUrl: "https://example.com/register",
    status: "recent",
    isFeatured: true,
    isActive: true,
    galleryImages: [
      "/images/banner-sublimation-sports.svg",
      "/images/banner-surgical-tools.svg",
      "/images/banner-our-values.svg",
    ],
    sortOrder: 1,
    publishedAt: "2026-05-01",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-01",
  },
  {
    id: "2",
    title: "International Surgical & Dental Tools Fair",
    slug: "international-surgical-tools-fair",
    shortDescription: "Precision surgical instruments exhibition for medical professionals and distributors.",
    content: "Experience Estrella International's precision-crafted surgical and dental tools catalog. Certified under ISO 13485 and FDA standards, our medical instruments showcase exceptional durability and ergonomic accuracy.",
    featuredImage: "/images/banner-surgical-tools.svg",
    eventType: "Exhibition",
    eventDate: "2026-05-20",
    endDate: "2026-05-22",
    location: "Karachi Expo Center, Karachi, Pakistan",
    organizer: "Estrella International",
    registrationUrl: "https://example.com/register",
    status: "recent",
    isFeatured: false,
    isActive: true,
    galleryImages: ["/images/banner-surgical-tools.svg"],
    sortOrder: 2,
    publishedAt: "2026-04-15",
    createdAt: "2026-04-15",
    updatedAt: "2026-04-15",
  },
  {
    id: "3",
    title: "Pro Boxing Gear Launch 2026",
    slug: "pro-boxing-gear-launch-2026",
    shortDescription: "Introducing Estrella's new genuine leather boxing gloves and combat protective gear.",
    content: "Discover our new Combat Sports Collection featuring genuine cowhide leather gloves, high-density padding, and wrist stabilization technology.",
    featuredImage: "/images/banner-our-values.svg",
    eventType: "Product Launch",
    eventDate: "2026-10-01",
    endDate: "2026-10-01",
    location: "Estrella Headquarters, Sialkot, Pakistan",
    organizer: "Estrella International",
    registrationUrl: "https://example.com/register",
    status: "upcoming",
    isFeatured: true,
    isActive: true,
    galleryImages: ["/images/banner-our-values.svg"],
    sortOrder: 3,
    publishedAt: "2026-06-01",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
];

export const getEventBySlug = (slug: string): Event | undefined => {
  return events.find((event) => event.slug === slug && event.isActive);
};

export const getRecentEvents = (): Event[] => {
  return events
    .filter((event) => event.status === "recent" && event.isActive)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
};

export const getUpcomingEvents = (): Event[] => {
  return events
    .filter((event) => event.status === "upcoming" && event.isActive)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
};

export const getEventsByType = (type: EventType): Event[] => {
  return events
    .filter((event) => event.eventType === type && event.isActive)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
};

export const getFeaturedEvents = (): Event[] => {
  return events
    .filter((event) => event.isFeatured && event.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3);
};

export const getActiveEvents = (): Event[] => {
  return events.filter((event) => event.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
};
