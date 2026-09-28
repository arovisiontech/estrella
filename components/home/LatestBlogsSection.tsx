import { getLatestBlogs } from "@/lib/cms/blogs";
import BlogCard from "@/components/blogs/BlogCard";

export default async function LatestBlogsSection() {
  const latestBlogs = (await getLatestBlogs(2)) as any[];

  if (!latestBlogs || latestBlogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="site-container px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 lg:mb-20">
          {/* Heading Block */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-black">
              <span className="block font-normal">Insights From Our</span>
              <span className="block font-bold">Latest Blogs</span>
            </h2>
          </div>

          {/* Description Block */}
          <div className="flex flex-col justify-center">
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
              Stay Updated With The Latest Trends, Innovations, And Expert
              Insights In The Manufacturing And Industrial Sectors
            </p>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
