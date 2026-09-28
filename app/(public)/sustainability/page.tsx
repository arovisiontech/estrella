import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Sustainability | Torque Motorsports",
  description: "Learn about Torque's commitment to sustainable and eco-friendly motorcycle gear manufacturing.",
};

export default function SustainabilityPage() {
  return (
    <main className="bg-white">
      {/* Breadcrumb */}
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
              Sustainability
            </li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <div className="site-container py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Sustainability</h1>
          <p className="text-lg text-zinc-600">Coming soon</p>
        </div>
      </div>
    </main>
  );
}
