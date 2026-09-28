import Link from "next/link";
import { Home } from "lucide-react";

interface CompanyBreadcrumbProps {
  pageName: string;
}

export default function CompanyBreadcrumb({ pageName }: CompanyBreadcrumbProps) {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="site-container py-3">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/" aria-label="Home" className="inline-flex transition hover:text-red-600">
              <Home size={16} />
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">/</li>
          <li aria-current="page" className="font-semibold text-red-600 uppercase">
            {pageName}
          </li>
        </ol>
      </div>
    </nav>
  );
}
