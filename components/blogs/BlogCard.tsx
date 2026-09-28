"use client";

import Link from "next/link";
import { useState } from "react";
import { Blog } from "@/lib/types/blog";
import BlogImage from "./BlogImage";
import BlogArrowButton from "./BlogArrowButton";

type BlogCardProps = {
  blog: Blog;
};

export default function BlogCard({ blog }: BlogCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const imageSrc =
    blog.featured_image_url ||
    (blog as any).image ||
    (blog as any).featured_image ||
    "/images/banner-our-values.svg";

  return (
    <article
      className="group transition-all duration-500"
      style={{
        transform: isHovering ? "translateY(-8px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/blogs/${blog.slug}`}>
        <BlogImage
          src={imageSrc}
          alt={blog.title}
        />
      </Link>

      {/* Footer Row */}
      <div className="flex items-center justify-between gap-4 mt-4">
        {/* Blog Title */}
        <Link href={`/blogs/${blog.slug}`} className="grow">
          <h3 className="text-base sm:text-lg font-semibold text-black leading-snug group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Arrow Button */}
        <BlogArrowButton href={`/blogs/${blog.slug}`} />
      </div>
    </article>
  );
}
