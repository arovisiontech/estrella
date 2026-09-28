export type EventStatus = "recent" | "upcoming" | "completed" | "cancelled";
export type EventType = "Exhibition" | "Product Launch" | "Manufacturing" | "Motorcycle Show" | "Conference" | "Community Event";

export interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  featuredImage: string;
  eventType: EventType;
  eventDate: string;
  endDate?: string;
  location: string;
  organizer: string;
  registrationUrl?: string;
  videoUrl?: string;
  status: EventStatus;
  isFeatured: boolean;
  isActive: boolean;
  galleryImages?: string[];
  sortOrder: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCategory {
  id: string;
  label: string;
  value: EventType;
}
