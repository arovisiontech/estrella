import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogs as fallbackBlogs } from "@/lib/data/blogs";

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

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return fallbackBlogs.filter(b => b.is_published).map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: blogData } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  const blog = (blogData ? merged(blogData) : null) || fallbackBlogs.find(b => b.slug === params.slug && b.is_published);

  if (!blog) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [
        {
          url: blog.featured_image_url,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogDetailPage(props: {
  params: Promise<Params>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: blogData } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  const blog = (blogData ? merged(blogData) : null) || fallbackBlogs.find(b => b.slug === params.slug && b.is_published);

  if (!blog) {
    notFound();
  }

  const publishedDate = new Date(blog.published_at || blog.created_at);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-black text-white py-8 sm:py-12 lg:py-16">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center text-red-600 hover:text-red-500 transition-colors mb-6 font-medium"
          >
            ← Back to Blogs
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {blog.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-zinc-400 text-sm">
            <span>{blog.author_name}</span>
            <span>{publishedDate.toLocaleDateString()}</span>
            {blog.reading_time && <span>{blog.reading_time} min read</span>}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src={blog.featured_image_url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
            <div
              className="text-zinc-900 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{
                __html: blog.content
                  .split("\n\n")
                  .map((paragraph: string) => {
                    if (paragraph.startsWith("#")) {
                      const level = paragraph.match(/^#+/)?.[0].length || 1;
                      const text = paragraph.replace(/^#+\s*/, "");
                      const tag = `h${level}`;
                      const className =
                        level === 1
                          ? "text-3xl font-bold mt-8 mb-4"
                          : level === 2
                            ? "text-2xl font-bold mt-6 mb-3"
                            : "text-xl font-semibold mt-4 mb-2";
                      return `<${tag} class="${className}">${text}</${tag}>`;
                    }
                    if (paragraph.startsWith("-")) {
                      return `<li class="ml-6">${paragraph.substring(2)}</li>`;
                    }
                    return `<p>${paragraph}</p>`;
                  })
                  .join(""),
              }}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-zinc-50">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Explore More Insights
            </h2>
            <p className="text-zinc-600 mb-8">
              Discover more articles and stay updated with the latest trends in
              manufacturing and industrial innovation.
            </p>
            <Link
              href="/blogs"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
