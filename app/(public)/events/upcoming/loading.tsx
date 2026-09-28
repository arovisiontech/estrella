export default function UpcomingEventsLoading() {
  return (
    <main className="bg-white">
      {/* Breadcrumb Skeleton */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="site-container py-3">
          <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="bg-black py-16">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="h-10 w-48 bg-zinc-700 rounded animate-pulse mb-4" />
          <div className="h-6 w-full max-w-2xl bg-zinc-700 rounded animate-pulse" />
        </div>
      </section>

      {/* Events Skeleton */}
      <section className="py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-2 gap-8 pb-12 border-b border-zinc-200">
                <div className="h-80 bg-zinc-200 rounded-lg animate-pulse" />
                <div>
                  <div className="h-8 w-3/4 bg-zinc-200 rounded animate-pulse mb-4" />
                  <div className="h-4 w-full bg-zinc-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-full bg-zinc-200 rounded animate-pulse mb-3" />
                  <div className="h-4 w-2/3 bg-zinc-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
