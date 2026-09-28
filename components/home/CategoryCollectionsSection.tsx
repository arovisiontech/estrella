import { getCategories } from "@/lib/cms";
import CategoryTile from "@/components/categories/CategoryTile";

export default async function CategoryCollectionsSection() {
  const categories = await getCategories();

  return (
    <section className="bg-white mt-0 py-0 w-full">
      <div className="w-full px-0">
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
