import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home } from "lucide-react";
import { getPageBySlug } from "@/lib/cms/pages";
import ComplianceContent from "@/components/company/ComplianceContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('compliance');
  return {
    title: page?.meta_title || "Compliance | Torque Motorsports",
    description: page?.meta_description || "Torque's international certifications and compliance standards for motorcycle apparel manufacturing.",
  };
}

export default async function CompliancePage() {
  const page = await getPageBySlug('compliance');
  if (!page || !page.is_published) {
    notFound();
  }

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
            <li aria-current="page" className="font-semibold text-red-600 uppercase">Compliance</li>
          </ol>
        </div>
      </nav>

      <ComplianceContent />
    </main>
  );
}
