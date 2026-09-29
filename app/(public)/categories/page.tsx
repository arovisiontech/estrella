import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategoriesWithSubcategories } from "@/lib/cms/categories";
import CategoryHero from "@/components/categories/CategoryHero";
import CategoryBreadcrumb from "@/components/categories/CategoryBreadcrumb";
import { ArrowRight } from "lucide-react";

export const revalidate = 60; // Cache and revalidate every 60s for high performance

export const metadata: Metadata = {
  title: "Product Categories | Estrella International",
  description: "Explore our complete range of custom digital sublimation sportswear, boxing equipment, soccer footballs, and athletic gear.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithSubcategories();

  return (
    <main className="bg-white min-h-screen">
      {/* Category Hero Banner */}
      <CategoryHero
        categoryName="Estrella Categories"
        bannerSrc="/images/brochure-parallax.jpeg"
        bannerAlt="Estrella International Categories"
      >
        <CategoryBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
          ]}
        />
      </CategoryHero>

      {/* Main Categories Section */}
      <div className="site-container px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[#00AEF0] font-bold uppercase tracking-wider text-xs">Explore Range</span>
          <h2 className="text-3xl font-extrabold text-black tracking-tight mt-1 sm:text-4xl uppercase">
            Estrella Apparel & Gear Categories
          </h2>
          <p className="text-zinc-600 text-sm mt-3">
            High-performance custom sportswear, boxing equipment, and soccer footballs engineered for precision and durability.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-zinc-500 text-sm">No categories available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const imageSrc = category.image_url || category.banner_url || category.image?.src || "/images/brochure-parallax.jpeg";
              const subcats = category.subcategories || [];

              return (
                <div
                  key={category.id || category.slug}
                  className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#00AEF0]/60"
                >
                  {/* Category Image */}
                  <Link href={`/categories/${category.slug}`} className="relative aspect-[4/3] overflow-hidden block">
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold uppercase text-white tracking-wide group-hover:text-[#00AEF0] transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </Link>

                  {/* Subcategories list */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                    {subcats.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider block">
                          Subcategories ({subcats.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {subcats.map((sub) => (
                            <Link
                              key={sub.id || sub.slug}
                              href={`/categories/${category.slug}?subcategory=${sub.slug}`}
                              className="text-xs text-slate-700 hover:text-[#00AEF0] bg-slate-50 hover:bg-sky-50 px-2.5 py-1 rounded-md border border-slate-200 hover:border-[#00AEF0]/40 transition font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 mb-4 italic">Complete collection of {category.name}</p>
                    )}

                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#00AEF0] hover:text-[#0090c8] tracking-wider pt-3 border-t border-slate-100 transition"
                    >
                      View All {category.name} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
