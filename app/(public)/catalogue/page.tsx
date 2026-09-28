'use client';

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Home, Search, X, BookOpen } from "lucide-react";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import CataloguePreviewModal from "@/components/catalogue/CataloguePreviewModal";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { adaptCatalogueRow, type AdaptedCatalogue } from "@/lib/cms/types";

import { DEFAULT_CATALOGUES } from "@/lib/cms/catalogues";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 6;
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function CataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCatalogue, setSelectedCatalogue] = useState<AdaptedCatalogue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catalogues, setCatalogues] = useState<AdaptedCatalogue[]>(DEFAULT_CATALOGUES);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadCatalogues() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("catalogues")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const adapted = data
            .map((c) => adaptCatalogueRow(c))
            .filter((c): c is AdaptedCatalogue => c !== null);
          if (adapted.length > 0) {
            setCatalogues(adapted);
          }
        }
      } catch {
        setCatalogues(DEFAULT_CATALOGUES);
      }
      setLoading(false);
    }
    loadCatalogues();
  }, []);

  // Filter and sort catalogues
  const filteredCatalogues = useMemo(() => {
    let result = [...catalogues];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (cat) =>
          cat.title?.toLowerCase().includes(query) ||
          cat.description?.toLowerCase().includes(query) ||
          cat.category?.toLowerCase().includes(query)
      );
    }

    // Category filter: "all" shows all catalogues
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((cat) => {
        const catVal = (cat.category || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        return catVal === target || catVal.includes(target) || target.includes(catVal);
      });
    }

    // Sort
    result.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (sortBy !== "newest") {
      switch (sortBy) {
        case "oldest":
          result.sort((a, b) => new Date(a.updatedDate || 0).getTime() - new Date(b.updatedDate || 0).getTime());
          break;
        case "name-asc":
          result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
          break;
        case "name-desc":
          result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
          break;
      }
    }

    return result;
  }, [catalogues, searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCatalogues.length / ITEMS_PER_PAGE));
  const paginatedCatalogues = filteredCatalogues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePreview = (catalogue: AdaptedCatalogue) => {
    setSelectedCatalogue(catalogue);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <main className="bg-white min-h-[60vh]">
      {/* Breadcrumb */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="site-container py-3">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" aria-label="Home" className="inline-flex transition hover:text-[#00AEF0]">
                <Home size={16} />
              </Link>
            </li>
            <li aria-hidden="true" className="text-zinc-400">/</li>
            <li aria-current="page" className="font-semibold text-[#00AEF0] uppercase">
              Catalogue
            </li>
          </ol>
        </div>
      </nav>

      {/* Search & Filters Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-50 py-8 sm:py-12 border-b border-zinc-200"
      >
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col md:flex-row gap-3 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search catalogues by name, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-zinc-300 bg-white text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#00AEF0] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3.5 text-zinc-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-semibold text-black whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto py-3 px-4 rounded-lg border border-zinc-300 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00AEF0]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-zinc-600">
            <span>
              Showing <strong className="text-black">{filteredCatalogues.length}</strong> catalogue
              {filteredCatalogues.length !== 1 ? "s" : ""}
            </span>
            {(searchQuery || selectedCategory !== "all" || sortBy !== "newest") && (
              <button
                onClick={clearFilters}
                className="text-[#00AEF0] hover:text-[#0089bd] font-semibold text-sm transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Catalogues Grid Section */}
      <section className="py-12 sm:py-16">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00AEF0] border-r-transparent align-[-0.125em]" />
              <p className="mt-4 text-zinc-600">Loading catalogues...</p>
            </div>
          ) : filteredCatalogues.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-300 rounded-lg p-12 bg-zinc-50">
              <BookOpen className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-lg font-bold text-black mb-2">No Catalogues Found</h3>
              <p className="text-zinc-500 max-w-md mx-auto mb-6 text-sm">
                There are currently no active product catalogues available matching your criteria.
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#00AEF0] text-white rounded text-sm font-semibold hover:bg-[#0089bd] transition shadow-md shadow-sky-500/20"
                >
                  Clear search filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCatalogues.map((catalogue) => (
                  <CatalogueCard
                    key={catalogue.id}
                    catalogue={catalogue}
                    onPreview={handlePreview}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded border border-zinc-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded text-sm font-semibold transition ${
                        currentPage === page
                          ? "bg-[#00AEF0] text-white shadow-md shadow-sky-500/20"
                          : "border border-zinc-300 text-black hover:border-black"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded border border-zinc-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      <CataloguePreviewModal
        catalogue={selectedCatalogue}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCatalogue(null);
        }}
      />
    </main>
  );
}
