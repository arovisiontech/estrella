import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { events as fallbackEvents } from "@/lib/data/events";
import { blogs as fallbackBlogs } from "@/lib/data/blogs";
import EventCard from "@/components/events/EventCard";

/**
 * source_data is a snapshot captured at migration time. Live columns are the
 * source of truth for anything the admin can edit, so they win the merge; the
 * snapshot only fills in extra shape the presentation components still expect.
 */
function merged(row: Record<string, any>): Record<string, any> {
  const { source_data, ...columns } = row ?? {};
  const live = Object.fromEntries(
    Object.entries(columns).filter(([, v]) => v !== null && v !== undefined)
  );
  return { ...(source_data ?? {}), ...live };
}

export const metadata: Metadata = {
  title: "Events | Torque Motorsports",
  description: "Explore Torque's exhibitions, product launches, and motorcycle industry events.",
};

export default async function EventsPage() {
  const supabase = await createClient();

  const [{ data: eventsData }, { data: blogsData }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
  ]);

  // Migrated rows keep their date in source_data.eventDate while rows added
  // through the admin panel use the event_date column, so resolve both and
  // sort here rather than relying on either column being populated.
  const whenOf = (e: any): number => {
    const raw = e.event_date ?? e.eventDate;
    const t = raw ? new Date(raw).getTime() : NaN;
    return Number.isNaN(t) ? 0 : t;
  };

  const allEvents = (
    eventsData
      ? eventsData.filter(e => e.is_active !== false).map(e => merged(e) as unknown as (typeof fallbackEvents)[number])
      : fallbackEvents
  ).slice().sort((a: any, b: any) => whenOf(b) - whenOf(a));

  const blogs = blogsData
    ? blogsData.map(b => merged(b))
    : fallbackBlogs.filter(b => b.is_published);

  // `status` is not a column on the events table — it only exists inside
  // source_data for rows created by the original migration. Derive it from
  // event_date so events added through the admin panel are grouped too, and
  // fall back to the legacy value when there is no date to judge by.
  const statusOf = (e: any): "recent" | "upcoming" => {
    const when = whenOf(e);
    if (when) return when >= Date.now() ? "upcoming" : "recent";
    return e.status === "upcoming" ? "upcoming" : "recent";
  };

  const recentEvents = allEvents.filter((e: any) => statusOf(e) === "recent").slice(0, 3);
  const upcomingEvents = allEvents.filter((e: any) => statusOf(e) === "upcoming").slice(0, 3);

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
            <li aria-current="page" className="font-semibold text-red-600 uppercase">
              Events
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24 text-center">
          <div className="mb-4">
            <p className="text-red-600 text-sm font-semibold uppercase tracking-wider">
              TORQUE — EVENTS
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            News, Exhibitions & Rider Experiences
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
            Explore Torque exhibitions, product launches, manufacturing events and motorcycle industry experiences.
          </p>
        </div>
      </section>

      {/* Recent Events Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Recent Events
            </h2>
            <Link
              href="/events/recent"
              className="text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-600 py-12">No recent events available.</p>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-zinc-50 py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Upcoming Events
            </h2>
            <Link
              href="/events/upcoming"
              className="text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {upcomingEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-600 py-12">No upcoming events scheduled.</p>
          )}
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
              Latest News & Insights
            </h2>
            <Link
              href="/blogs"
              className="text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.slice(0, 3).map((blog, index) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                  <article className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={blog.featured_image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                          {blog.reading_time} min read
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-black mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                        <span className="text-xs text-zinc-500">
                          {new Date(blog.published_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-red-600 hover:text-red-700 font-semibold text-sm">
                          Read →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-600 py-12">No blogs available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
