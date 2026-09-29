"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderOpen,
  Layers,
  Edit2,
  ExternalLink,
  Search,
  CheckCircle,
  Briefcase,
  BookMarked,
  Plus,
} from "lucide-react";
import DashboardCard from "./DashboardCard";
import { getStoredCategories, getStoredProducts } from "@/lib/cms/clientStorage";
import { DEFAULT_CATEGORIES } from "@/lib/cms/defaultCategories";
import { DEFAULT_PRODUCTS } from "@/lib/cms/defaultProducts";

interface DashboardOverviewProps {
  initialCounts: {
    productCount: number;
    categoryCount: number;
    subcategoryCount: number;
    departmentCount: number;
    catalogueCount: number;
  };
}

function getImageUrlStr(img: any): string {
  if (!img) return "/images/about/gallery-1.jpg";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img !== null) {
    return img.src || img.url || "/images/about/gallery-1.jpg";
  }
  return "/images/about/gallery-1.jpg";
}

export default function DashboardOverview({ initialCounts }: DashboardOverviewProps) {
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<any[]>(DEFAULT_PRODUCTS);
  const [search, setSearch] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("all");

  useEffect(() => {
    // Load persisted local data + defaults
    const storedCats = getStoredCategories();
    const storedProds = getStoredProducts();
    setCategories(storedCats);
    setProducts(storedProds);

    const onCatsUpdated = () => setCategories(getStoredCategories());
    const onProdsUpdated = () => setProducts(getStoredProducts());

    window.addEventListener("estrella_categories_updated", onCatsUpdated);
    window.addEventListener("estrella_products_updated", onProdsUpdated);

    return () => {
      window.removeEventListener("estrella_categories_updated", onCatsUpdated);
      window.removeEventListener("estrella_products_updated", onProdsUpdated);
    };
  }, []);

  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + (cat.subcategories?.length || 4),
    0
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase());

    if (selectedCatFilter === "all") return matchesSearch;

    const pCat = (p.category_id || p.category || "").toLowerCase();
    const matchesCat =
      pCat === selectedCatFilter ||
      (selectedCatFilter.includes("sport") && pCat.includes("sport")) ||
      (selectedCatFilter.includes("box") && pCat.includes("box")) ||
      (selectedCatFilter.includes("soccer") && (pCat.includes("soccer") || pCat.includes("football")));

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-10">
      {/* Top Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/products" className="group">
          <DashboardCard
            title="Total Products"
            count={products.length}
            icon={Package}
            description="Active products in catalogue"
          />
        </Link>

        <Link href="/admin/categories" className="group">
          <DashboardCard
            title="Total Categories"
            count={categories.length}
            icon={FolderOpen}
            description="Product categories on website"
          />
        </Link>

        <Link href="/admin/subcategories" className="group">
          <DashboardCard
            title="Total Subcategories"
            count={totalSubcategories}
            icon={Layers}
            description="Subdivisions & lines"
          />
        </Link>

        <Link href="/admin/departments" className="group">
          <DashboardCard
            title="Departments"
            count={initialCounts.departmentCount || 4}
            icon={Briefcase}
            description="Active departments"
          />
        </Link>
      </div>

      {/* 1. All Categories Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-0.5 rounded-full">
                Website Catalog
              </span>
              <span className="text-xs text-slate-400 font-medium">({categories.length} Active Categories)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">All Categories on Website</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live product categories displayed in navigation, header and homepage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Link>
            <Link
              href="/admin/categories"
              className="border border-slate-200 hover:border-[#00AEF0] text-slate-700 hover:text-[#00AEF0] px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-50"
            >
              Manage Categories →
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catImage = cat.image_url || cat.banner_url || "/images/about/gallery-1.jpg";
            const subsCount = cat.subcategories?.length || 4;

            return (
              <div
                key={cat.id || cat.slug}
                className="group flex flex-col justify-between border border-slate-200 hover:border-[#00AEF0] rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white transition-all shadow-xs"
              >
                {/* Image & Header */}
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={catImage}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00AEF0] px-2 py-0.5 rounded-md shadow-xs">
                        {subsCount} Subcategories
                      </span>
                      <h3 className="text-base font-bold mt-1 text-white drop-shadow-sm">{cat.name}</h3>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cat.description || "Category products and custom sportswear manufacturing."}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400">
                      slug: <span className="text-slate-700 font-semibold">{cat.slug}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <Link
                    href={`/admin/products?category=${cat.slug}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#00AEF0] hover:text-[#008dbf] transition"
                  >
                    <Package className="w-3.5 h-3.5" /> View Products
                  </Link>

                  <Link
                    href={`/admin/categories/${cat.id || cat.slug}/edit`}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#00AEF0] bg-white border border-slate-200 hover:border-[#00AEF0] px-3 py-1.5 rounded-lg shadow-2xs transition"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. All Products in Catalogue Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-0.5 rounded-full">
                Catalogue List
              </span>
              <span className="text-xs text-slate-400 font-medium">({filteredProducts.length} Products Showing)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">All Products on Website</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete inventory of products across all categories with real-time status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
            <Link
              href="/admin/products"
              className="border border-slate-200 hover:border-[#00AEF0] text-slate-700 hover:text-[#00AEF0] px-4 py-2 rounded-xl text-xs font-bold transition bg-slate-50"
            >
              Full Products Table →
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCatFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                selectedCatFilter === "all"
                  ? "bg-[#00AEF0] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setSelectedCatFilter("sportswear")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                selectedCatFilter === "sportswear"
                  ? "bg-[#00AEF0] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Sportswears ({products.filter((p) => (p.category_id || p.category || "").toLowerCase().includes("sport")).length})
            </button>
            <button
              onClick={() => setSelectedCatFilter("boxing-equipment")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                selectedCatFilter === "boxing-equipment"
                  ? "bg-[#00AEF0] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Boxing Equipment ({products.filter((p) => (p.category_id || p.category || "").toLowerCase().includes("box")).length})
            </button>
            <button
              onClick={() => setSelectedCatFilter("soccer-footballs")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                selectedCatFilter === "soccer-footballs"
                  ? "bg-[#00AEF0] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Soccer Footballs ({products.filter((p) => (p.category_id || p.category || "").toLowerCase().includes("soccer") || (p.category_id || p.category || "").toLowerCase().includes("football")).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search product by name, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5 pl-4">Product</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredProducts.map((p) => {
                  const imageSrc =
                    getImageUrlStr(p.main_image_url) ||
                    getImageUrlStr(p.mainImage) ||
                    "/images/about/gallery-1.jpg";
                  const catLabel =
                    p.categoryLabel ||
                    (p.category_id && p.category_id.includes("box")
                      ? "Boxing Equipment"
                      : p.category_id && (p.category_id.includes("soc") || p.category_id.includes("foot"))
                      ? "Soccer Footballs"
                      : "Sportswears");

                  return (
                    <tr key={p.id || p.sku} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <Image
                              src={imageSrc}
                              alt={p.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {p.short_description || p.shortDescription || "Premium quality sportswear product"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 font-medium">{p.sku || "N/A"}</td>
                      <td className="p-3.5">
                        <span className="bg-sky-50 text-[#00AEF0] border border-sky-100 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {catLabel}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        Rs. {(p.price || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-slate-600">{p.stock_quantity ?? p.stockQuantity ?? 100}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <CheckCircle className="w-2.5 h-2.5" /> In Stock
                        </span>
                      </td>
                      <td className="p-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="inline-flex items-center gap-1 bg-white hover:bg-sky-50 text-[#00AEF0] border border-slate-200 hover:border-[#00AEF0] px-2.5 py-1 rounded-lg font-semibold text-[11px] shadow-2xs transition"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                      No products matching &quot;{search}&quot;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
