import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfoPanel from "@/components/products/ProductInfoPanel";
import ProductTabs from "@/components/products/ProductTabs";
import ProductHighlights from "@/components/products/ProductHighlights";
import RelatedProducts from "@/components/products/RelatedProducts";
import { getProductBySlug, getProducts, DEFAULT_PRODUCTS } from "@/lib/cms/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  let product = await getProductBySlug(decodedSlug);
  if (!product) {
    product = DEFAULT_PRODUCTS.find((p) => p.slug === decodedSlug) || DEFAULT_PRODUCTS[0];
  }

  return {
    title: `${product.name} | Estrella International`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.name} | Estrella International`,
      description: product.shortDescription || product.description,
      images: [{ url: product.mainImage?.src || "/images/about/gallery-1.jpg" }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();

  let product = await getProductBySlug(decodedSlug);
  if (!product) {
    product = DEFAULT_PRODUCTS.find((p) => p.slug === decodedSlug) || DEFAULT_PRODUCTS[0];
  }

  const allProducts = await getProducts();
  const relatedProducts = (allProducts || DEFAULT_PRODUCTS)
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <main className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-200 bg-zinc-50">
        <nav aria-label="Breadcrumb" className="site-container py-3 text-xs text-zinc-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" aria-label="Home" className="flex items-center transition hover:text-[#00AEF0]">
                <Home size={14} />
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/categories/${product.category}`} className="uppercase transition hover:text-[#00AEF0]">
                {product.categoryLabel || product.category}
              </Link>
            </li>
            {product.subcategory && (
              <>
                <li aria-hidden="true">/</li>
                <li className="uppercase">{product.subcategory}</li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="uppercase text-[#00AEF0] font-semibold truncate max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="site-container px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="lg:flex lg:items-start lg:gap-12">
          <div className="lg:w-[58%] xl:w-[60%]">
            <ProductGallery
              productName={product.name}
              images={
                product.galleryImages && product.galleryImages.length > 0
                  ? product.galleryImages
                  : [
                      product.mainImage,
                      product.hoverImage || { src: product.mainImage?.src || "/images/about/gallery-1.jpg", alt: `${product.name} back view` },
                    ].filter((img) => img && img.src)
              }
              videoUrl={product.videoUrl}
              videoPoster={product.videoPoster ? { src: product.videoPoster, alt: product.name } : undefined}
            />
          </div>

          <div className="mt-10 lg:sticky lg:top-24 lg:mt-0 lg:w-[42%] lg:self-start xl:w-[40%]">
            <ProductInfoPanel product={product as any} />
            <ProductTabs product={product as any} />
          </div>
        </div>

        {product.highlights && product.highlights.length > 0 && (
          <ProductHighlights highlights={product.highlights} />
        )}
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts as any} />
      )}
    </main>
  );
}
