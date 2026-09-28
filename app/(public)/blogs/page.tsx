import { getBlogs } from "@/lib/cms/blogs";
import BlogCard from "@/components/blogs/BlogCard";

export const revalidate = 0;

export const metadata = {
  title: "Latest Blogs - Torque",
  description:
    "Stay updated with the latest trends, innovations, and expert insights in the manufacturing and industrial sectors.",
};

export default async function BlogsPage() {
  const displayBlogs = (await getBlogs()) as any[];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-black text-white py-12 sm:py-16 lg:py-20">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Latest Blogs
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300">
              Insights, innovations, and expert perspectives on manufacturing,
              industrial sectors, and motorcycle technology.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          {displayBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-zinc-600">No blogs published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {displayBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
