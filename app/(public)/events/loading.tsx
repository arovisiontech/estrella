export default function EventsLoading() {
  return (
    <main className="bg-white">
      {/* Breadcrumb Skeleton */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="site-container py-3">
          <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="bg-black py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24 text-center">
          <div className="mb-4 h-6 w-40 mx-auto bg-zinc-700 rounded animate-pulse" />
          <div className="h-12 w-full max-w-2xl mx-auto bg-zinc-700 rounded animate-pulse mb-4" />
          <div className="h-6 w-full max-w-2xl mx-auto bg-zinc-700 rounded animate-pulse" />
        </div>
      </section>

      {/* Events Grid Skeleton */}
      <section className="py-20">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="h-10 w-48 bg-zinc-200 rounded animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="h-64 bg-zinc-200 animate-pulse mb-4" />
                <div className="h-6 bg-zinc-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-3/4 bg-zinc-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
