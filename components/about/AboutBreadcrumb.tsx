import Link from "next/link";
import { Home } from "lucide-react";

export default function AboutBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-zinc-200 bg-white"
    >
      <div className="site-container py-3">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/" aria-label="Home" className="inline-flex transition hover:text-[#00AEF0]">
              <Home size={16} />
            </Link>
          </li>
          <li aria-hidden="true" className="text-zinc-400">
            /
          </li>
          <li aria-current="page" className="font-semibold text-[#00AEF0] uppercase">
            About Us
          </li>
        </ol>
      </div>
    </nav>
  );
}
