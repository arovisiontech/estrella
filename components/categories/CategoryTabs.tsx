import Link from "next/link";
import { productMenuCategories } from "@/lib/data/productMenuCategories";

type CategoryTabsProps = {
  activeSlug: string;
};

export default function CategoryTabs({ activeSlug }: CategoryTabsProps) {
  return (
    <nav
      className="overflow-x-auto scrollbar-hide border-b border-zinc-200"
      aria-label="Product categories"
    >
      <div className="flex gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-4 min-w-max lg:min-w-full">
        {productMenuCategories.map((category) => {
          const isActive = category.slug === activeSlug;

          return (
            <Link
              key={category.id}
              href={category.href}
              className="flex-none text-sm font-medium transition-all duration-300 pb-3 relative group"
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`${
                  isActive ? "text-red-600" : "text-zinc-700 hover:text-black"
                }`}
              >
                {category.name}
              </span>

              {/* Active underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}

              {/* Hover underline for inactive */}
              {!isActive && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-red-600 w-0 group-hover:w-full transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
