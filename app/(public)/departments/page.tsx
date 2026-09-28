import type { Metadata } from "next";
import Link from "next/link";
import { Home } from "lucide-react";
import DepartmentsIntro from "@/components/departments/DepartmentsIntro";
import DepartmentFilters from "@/components/departments/DepartmentFilters";
import DepartmentGrid from "@/components/departments/DepartmentGrid";
import { getDepartments } from "@/lib/cms/departments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Manufacturing Departments | Estrella International",
  description: "Explore Estrella International's 8 manufacturing departments and specialized production workflow.",
};

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ dept?: string }>;
}) {
  const departments = await getDepartments();
  const params = searchParams ? await searchParams : undefined;
  const selectedDept = params?.dept || "all";

  return (
    <main className="bg-white">
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
              Departments
            </li>
          </ol>
        </div>
      </nav>

      {/* Introduction Section */}
      <DepartmentsIntro />

      {/* Filters */}
      <DepartmentFilters departments={departments} selectedDept={selectedDept} />

      {/* Grid */}
      <DepartmentGrid departments={departments} selectedDept={selectedDept} />
    </main>
  );
}
