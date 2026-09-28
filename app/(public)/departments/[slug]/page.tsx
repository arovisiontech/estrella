import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, ArrowRight, CheckCircle2, Wrench, Shield, Cpu, Sparkles } from "lucide-react";
import { getDepartmentBySlug, getDepartments } from "@/lib/cms/departments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DepartmentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);

  if (!department) {
    return {
      title: "Department Not Found | Estrella International",
    };
  }

  return {
    title: `${department.name} | Estrella International`,
    description: department.shortDescription || department.description,
  };
}

export default async function DepartmentDetailPage({
  params,
}: DepartmentPageProps) {
  const { slug } = await params;
  const department = await getDepartmentBySlug(slug);

  if (!department || department.isActive === false) {
    notFound();
  }

  const allDepartments = await getDepartments();
  const currentIndex = allDepartments.findIndex((d) => d.slug === slug || d.id === department.id);
  const prevDepartment = currentIndex > 0 ? allDepartments[currentIndex - 1] : null;
  const nextDepartment =
    currentIndex >= 0 && currentIndex < allDepartments.length - 1
      ? allDepartments[currentIndex + 1]
      : null;

  const imgSrc = typeof department.image === "string" ? department.image : department.image?.src || "/images/brochure-parallax.jpeg";

  return (
    <main className="bg-white min-h-screen font-sans">
      {/* Breadcrumb */}
      <nav className="border-b border-slate-200 bg-slate-50/60">
        <div className="site-container py-3 px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-xs sm:text-sm">
            <li>
              <Link href="/" aria-label="Home" className="inline-flex transition hover:text-[#00AEF0] text-slate-500">
                <Home size={15} />
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li>
              <Link
                href="/departments"
                className="transition hover:text-[#00AEF0] text-slate-600 font-medium"
              >
                Departments
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li aria-current="page" className="font-bold text-[#00AEF0] uppercase tracking-wide">
              {department.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-80 sm:h-[420px] lg:h-[520px] overflow-hidden bg-slate-950">
        <Image
          src={imgSrc}
          alt={department.name}
          fill
          className="object-cover opacity-80"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="site-container px-4 sm:px-6 lg:px-8 pb-12">
            {department.badge && (
              <span className="inline-block px-3.5 py-1 bg-[#00AEF0] text-white text-xs font-black uppercase tracking-wider rounded-full mb-3 shadow-md">
                {department.badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              {department.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Overview & Key Highlights */}
      <section className="py-12 sm:py-16 lg:py-20 border-b border-slate-100">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Department Overview</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {department.shortDescription || "Precision Engineering & Manufacturing Operations"}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                {department.description}
              </p>

              {/* Department Features List */}
              {department.features && department.features.length > 0 && (
                <div className="pt-6">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00AEF0]" /> Key Operational Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {department.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                        <CheckCircle2 className="w-5 h-5 text-[#00AEF0] shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-800">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Specifications & Equipment */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-3">
                Department Specs
              </h3>

              {department.equipment && department.equipment.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#00AEF0]" /> Equipment & Machinery
                  </h4>
                  <ul className="space-y-1.5 text-xs font-semibold text-slate-700">
                    {department.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00AEF0]" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {department.qualityStandards && department.qualityStandards.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#00AEF0]" /> Quality & ISO Standards
                  </h4>
                  <ul className="space-y-1.5 text-xs font-semibold text-slate-700">
                    {department.qualityStandards.map((qs, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{qs}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="block text-center w-full bg-[#00AEF0] hover:bg-[#0090c8] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition"
                >
                  Inquire About Custom Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="py-10 bg-slate-50/50">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {prevDepartment ? (
              <Link
                href={`/departments/${prevDepartment.slug}`}
                className="group p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-[#00AEF0] transition shadow-xs"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-[#00AEF0] mb-1">
                  <ArrowLeft size={14} />
                  <span>PREVIOUS DEPARTMENT</span>
                </div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#00AEF0] transition-colors truncate">
                  {prevDepartment.name}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextDepartment ? (
              <Link
                href={`/departments/${nextDepartment.slug}`}
                className="group p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-[#00AEF0] transition text-right shadow-xs"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-500 group-hover:text-[#00AEF0] mb-1">
                  <span>NEXT DEPARTMENT</span>
                  <ArrowRight size={14} />
                </div>
                <p className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#00AEF0] transition-colors truncate">
                  {nextDepartment.name}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
