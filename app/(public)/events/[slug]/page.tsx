import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, MapPin, Calendar } from "lucide-react";
import { getEventBySlug, getActiveEvents } from "@/lib/data/events";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | Torque Motorsports`,
    description: event.shortDescription,
    openGraph: {
      images: [event.featuredImage],
    },
  };
}

export async function generateStaticParams() {
  const events = getActiveEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="site-container py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" aria-label="Home" className="inline-flex transition hover:text-red-600">
                <Home size={16} />
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-400">/</li>
            <li>
              <Link href="/events" className="transition hover:text-red-600 text-zinc-600">
                Events
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-400">/</li>
            <li aria-current="page" className="font-semibold text-red-600 truncate">
              {event.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Image */}
      <section className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src={event.featuredImage}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="max-w-3xl">
            {/* Title & Meta */}
            <div className="mb-8 pb-8 border-b border-zinc-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 px-3 py-1 rounded-full">
                  {event.eventType}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  event.status === "upcoming"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-green-50 text-green-600"
                }`}>
                  {event.status === "upcoming" ? "Upcoming" : "Recent"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
                {event.title}
              </h1>

              {/* Date & Location */}
              <div className="flex flex-col sm:flex-row gap-6 text-sm sm:text-base">
                <div className="flex items-center gap-3 text-zinc-700">
                  <Calendar size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{formattedDate}</p>
                    {event.endDate && (
                      <p className="text-xs text-zinc-500">
                        to {new Date(event.endDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-700">
                  <MapPin size={20} className="text-red-600 flex-shrink-0" />
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
                {event.content}
              </p>
            </div>

            {/* CTA */}
            {event.registrationUrl && event.status === "upcoming" && (
              <div className="flex flex-wrap gap-4 mb-12">
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Register Now
                </a>
              </div>
            )}

            {/* Gallery */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
                  Event Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {event.galleryImages.map((image, index) => (
                    <div key={index} className="relative h-64 overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${event.title} gallery ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Back Link */}
          <div className="mt-16 pt-8 border-t border-zinc-200">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
            >
              <ArrowLeft size={18} />
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
