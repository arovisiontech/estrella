"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { blogs as allBlogs } from "@/lib/data/blogs";
import { useState, useMemo } from "react";
import type { Blog } from "@/lib/types/blog";

interface NewsContentProps {
  initialBlogs?: any[];
}

export default function NewsContent({ initialBlogs }: NewsContentProps) {
  const blogs = initialBlogs && initialBlogs.length > 0 ? initialBlogs : allBlogs;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: Blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [blogs, searchTerm]);

  return (
    <>
      {/* Hero */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-28">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4">LATEST UPDATES</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Torque News & Articles</h1>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl">
              Stay Informed With The Latest From Torque. Industry Insights, Manufacturing Updates And Rider Stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border-b border-zinc-200 py-8 sm:py-10 lg:py-12 sticky top-20 z-40">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-lg border border-zinc-300 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition"
            />

            {/* Results Count */}
            <p className="text-sm text-zinc-600">
              Showing <span className="font-bold text-black">{filteredBlogs.length}</span> article
              {filteredBlogs.length !== 1 ? "s" : ""}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          {filteredBlogs.length > 0 ? (
            <div className="space-y-8">
              {filteredBlogs.map((blog: Blog, index: number) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="border-b border-zinc-200 pb-8 last:border-b-0 last:pb-0 hover:bg-zinc-50 p-6 sm:p-8 -mx-6 sm:-mx-8 lg:p-0 lg:m-0 lg:hover:bg-white transition"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Content */}
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">{blog.title}</h2>
                      <p className="text-base sm:text-lg text-zinc-700 mb-6 leading-relaxed">{blog.excerpt}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>{blog.author_name}</span>
                        </div>
                        <div className="text-zinc-500">
                          {blog.reading_time || 5} min read
                        </div>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition group"
                      >
                        Read Article
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <p className="text-lg text-zinc-600 mb-4">No articles found matching your search.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-red-600 font-semibold hover:text-red-700 transition"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Stay Updated</h2>
            <p className="text-lg sm:text-xl text-zinc-300 mb-8">
              Subscribe to Torque News to receive the latest articles, product updates and industry insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
