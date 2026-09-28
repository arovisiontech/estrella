export default function EventDetailLoading() {
  return (
    <main className="bg-white">
      {/* Breadcrumb Skeleton */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="site-container py-3">
          <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
        </div>
      </nav>

      {/* Hero Image Skeleton */}
      <section className="h-96 sm:h-[500px] lg:h-[600px] bg-zinc-200 animate-pulse" />

      {/* Content Skeleton */}
      <section className="py-16">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <div className="max-w-3xl">
            {/* Title Section */}
            <div className="mb-8 pb-8 border-b border-zinc-200">
              <div className="flex gap-3 mb-4">
                <div className="h-6 w-24 bg-zinc-200 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-zinc-200 rounded-full animate-pulse" />
              </div>
              <div className="h-12 w-full bg-zinc-200 rounded animate-pulse mb-6" />
              <div className="flex gap-6">
                <div className="h-6 w-40 bg-zinc-200 rounded animate-pulse" />
                <div className="h-6 w-40 bg-zinc-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <div className="space-y-3">
                <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-200 rounded animate-pulse" />
              </div>
            </div>

            {/* CTA */}
            <div className="mb-12">
              <div className="h-10 w-32 bg-zinc-200 rounded-lg animate-pulse" />
            </div>

            {/* Gallery */}
            <div>
              <div className="h-8 w-40 bg-zinc-200 rounded animate-pulse mb-6" />
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-zinc-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
