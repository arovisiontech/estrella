import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import { getRecentEvents } from "@/lib/data/events";
import EventCard from "@/components/events/EventCard";

export const metadata: Metadata = {
  title: "Recent Events | Torque Motorsports",
  description: "Browse our recent exhibitions and events.",
};

export default function RecentEventsPage() {
  const events = getRecentEvents();

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
            <li aria-current="page" className="font-semibold text-red-600 uppercase">
              Recent Events
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-black text-white py-12 sm:py-16 lg:py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Recent Events
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl">
            Explore our past exhibitions, product showcases, and rider experiences.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          {events.length > 0 ? (
            <div className="space-y-12 lg:space-y-16">
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} layout="horizontal" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-zinc-600 mb-8">No recent events are available.</p>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
              >
                Back to Events
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
