import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import NewsContent from "@/components/company/NewsContent";
import { getBlogs } from "@/lib/cms/blogs";

export const metadata: Metadata = {
  title: "News | Torque Motorsports",
  description: "Latest news, articles and updates from Torque Motorsports.",
};

export const revalidate = 0;

export default async function NewsPage() {
  const liveBlogs = await getBlogs();

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
            <li aria-current="page" className="font-semibold text-red-600 uppercase">News</li>
          </ol>
        </div>
      </nav>

      <NewsContent initialBlogs={liveBlogs as any} />
    </main>
  );
}
