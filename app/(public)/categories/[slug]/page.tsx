import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryHero from "@/components/categories/CategoryHero";
import CategoryBreadcrumb from "@/components/categories/CategoryBreadcrumb";
import SubcategoryPills from "@/components/categories/SubcategoryPills";
import CategorySidebar from "@/components/categories/CategorySidebar";
import CategoryToolbar from "@/components/categories/CategoryToolbar";
import CategoryProductGrid from "@/components/categories/CategoryProductGrid";
import { adaptProductFromRow, type AdaptedProduct } from "@/lib/cms/types";
import { getCategoriesWithSubcategories, getCategoryBySlug, DEFAULT_CATEGORIES } from "@/lib/cms/categories";
import { getProductsByCategorySlug, DEFAULT_PRODUCTS } from "@/lib/cms/products";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ subcategory?: string; sort?: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const decodedSlug = decodeURIComponent(rawSlug).trim().toLowerCase();

  const categoryData = await getCategoryBySlug(decodedSlug);

  if (!categoryData) {
    return { title: "Category | Estrella International" };
  }

  const bannerImg = categoryData.banner_url || categoryData.image_url || "/images/brochure-parallax.jpeg";

  return {
    title: `${categoryData.name} | Estrella International`,
    description: categoryData.description || `Browse our ${categoryData.name} collection`,
    openGraph: {
      title: `${categoryData.name} | Estrella International`,
      description: categoryData.description || `Browse our ${categoryData.name} collection`,
      images: [{ url: bannerImg }],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug: rawSlug } = await params;
  const decodedSlug = decodeURIComponent(rawSlug).trim().toLowerCase();
  const { subcategory: activeSubcategorySlug, sort: sortOption } = await searchParams;

  // 1. Fetch category data with fast fallback
  let categoryData = await getCategoryBySlug(decodedSlug);

  if (!categoryData) {
    // Check if slug matches one of the 3 primary categories
    if (decodedSlug.includes("sport")) {
      categoryData = DEFAULT_CATEGORIES[0];
    } else if (decodedSlug.includes("box")) {
      categoryData = DEFAULT_CATEGORIES[1];
    } else if (decodedSlug.includes("soccer") || decodedSlug.includes("football")) {
      categoryData = DEFAULT_CATEGORIES[2];
    } else {
      categoryData = DEFAULT_CATEGORIES[0]; // Graceful fallback
    }
  }

  // 2. Fetch all active categories with their subcategories for the left sidebar
  const allActiveCategories = await getCategoriesWithSubcategories();

  // 3. Active subcategories for pills
  const activeSubcategories = categoryData.subcategories || [];

  let currentSubcategory: any = null;
  if (activeSubcategorySlug) {
    const decodedSubSlug = decodeURIComponent(activeSubcategorySlug).trim().toLowerCase();
    currentSubcategory = activeSubcategories.find(
      (s) =>
        s.slug.trim().toLowerCase() === decodedSubSlug ||
        s.name.trim().toLowerCase() === decodedSubSlug ||
        s.slug.trim().toLowerCase().replace(/-/g, "") === decodedSubSlug.replace(/-/g, "")
    );
  }

  // 4. Products for this category
  let categoryProducts = await getProductsByCategorySlug(categoryData.slug);

  if (!categoryProducts || categoryProducts.length === 0) {
    categoryProducts = DEFAULT_PRODUCTS.filter(
      (p) =>
        p.category === categoryData?.slug ||
        (categoryData?.slug.includes("sport") && p.category === "sportswear") ||
        (categoryData?.slug.includes("box") && p.category === "boxing-equipment") ||
        (categoryData?.slug.includes("soccer") && p.category === "soccer-footballs")
    );
  }

  const matchesSubcategory = (p: any, sub: any) => {
    if (!p || !sub) return false;
    const pSub = (p.subcategory || "").trim().toLowerCase();
    const pSubId = (p.subcategory_id || "").trim().toLowerCase();
    const sName = (sub.name || "").trim().toLowerCase();
    const sSlug = (sub.slug || "").trim().toLowerCase();
    return (
      pSub === sName ||
      pSub === sSlug ||
      pSubId === sSlug ||
      pSub.replace(/-/g, " ") === sName.replace(/-/g, " ") ||
      pSub.replace(/[^a-z0-9]/g, "") === sSlug.replace(/[^a-z0-9]/g, "")
    );
  };

  // Calculate real product counts for subcategory pills BEFORE filtering by selected subcategory
  const subcategoryPills = activeSubcategories.map((sub) => {
    const matchingCount = categoryProducts.filter((p) => matchesSubcategory(p, sub)).length;

    return {
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      count: matchingCount,
    };
  });

  if (currentSubcategory) {
    categoryProducts = categoryProducts.filter((p) => matchesSubcategory(p, currentSubcategory));
  }

  // Apply sorting
  if (sortOption === "price-low") {
    categoryProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === "price-high") {
    categoryProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === "name-asc") {
    categoryProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const bannerSrc = categoryData.banner_url || categoryData.image_url || "/images/brochure-parallax.jpeg";
  const bannerAlt = `${categoryData.name} collection`;

  return (
    <main className="bg-white min-h-screen">
      {/* Hero with breadcrumb (Matches SS 2) */}
      <CategoryHero
        categoryName={categoryData.name}
        bannerSrc={bannerSrc}
        bannerAlt={bannerAlt}
      >
        <CategoryBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: categoryData.name, href: `/categories/${categoryData.slug}` },
            ...(currentSubcategory
              ? [{ label: currentSubcategory.name, href: `/categories/${categoryData.slug}?subcategory=${currentSubcategory.slug}` }]
              : []),
          ]}
        />
      </CategoryHero>

      {/* Subcategory Pills Strip (Matches SS 2) */}
      {subcategoryPills.length > 0 && (
        <SubcategoryPills
          parentSlug={categoryData.slug}
          subcategories={subcategoryPills}
          activeSubcategory={currentSubcategory?.slug}
        />
      )}

      {/* Main Content Area: Left Categories Sidebar + Products Column (Matches SS 3 & SS 4) */}
      <div className="site-container px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-12 lg:py-16">
        <div className="lg:flex lg:gap-8 xl:gap-12 2xl:gap-16 items-start">
          {/* Left Categories & Subcategories Sidebar (Matches SS 3 & SS 4) */}
          <CategorySidebar
            currentCategorySlug={categoryData.slug}
            currentSubcategorySlug={currentSubcategory?.slug}
            categories={allActiveCategories}
          />

          {/* Products Column */}
          <div className="flex-1 min-w-0">
            <CategoryToolbar
              productCount={categoryProducts.length}
              activeSubcategoryName={currentSubcategory?.name}
            />

            <CategoryProductGrid products={categoryProducts as any} />
          </div>
        </div>
      </div>
    </main>
  );
}
