import Link from "next/link";
import { Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

type CategoryBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function CategoryBreadcrumb({ items }: CategoryBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {/* Home link */}
        <li>
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center transition hover:text-red-600"
          >
            <Home size={16} />
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-white/60">
              /
            </span>

            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="transition hover:text-red-600"
              >
                <span className="uppercase text-white">{item.label}</span>
              </Link>
            ) : (
              <span
                className={`uppercase ${
                  item.isActive ? "text-red-600 font-semibold" : "text-white"
                }`}
                aria-current={item.isActive ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </ol>
    </nav>
  );
}
