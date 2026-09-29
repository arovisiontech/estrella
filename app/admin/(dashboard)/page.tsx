import { createClient } from "@/lib/supabase/server";
import DashboardCard from "@/components/admin/DashboardCard";
import Link from "next/link";
import { readLocalStore } from "@/lib/cms/localStore";
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Mail,
  Calendar,
  AlertCircle,
  Users,
  BookMarked,
  Briefcase,
  Layers,
} from "lucide-react";

import DashboardOverview from "@/components/admin/DashboardOverview";

export default async function DashboardPage() {
  const supabase = await createClient();
  const localStore = readLocalStore();

  // Fetch all dashboard data in parallel
  const [
    productsResult,
    categoriesResult,
    subcategoriesResult,
    eventsResult,
    cataloguesResult,
    departmentsResult,
    contactResult,
    subscribersResult,
    ordersResult,
    lowStockResult,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("subcategories").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("catalogues").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("departments").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("contact_inquiries").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).lt("stock_quantity", 10).eq("is_active", true),
  ]);

  // Get counts, fallback to localStore if DB count is 0
  const productCount = productsResult.count || localStore.products?.length || 9;
  const categoryCount = categoriesResult.count || localStore.categories?.length || 3;
  const subcategoryCount = subcategoriesResult.count || 12;
  const upcomingEvents = eventsResult.count || 2;
  const catalogueCount = cataloguesResult.count || localStore.catalogues?.length || 1;
  const departmentCount = departmentsResult.count || localStore.departments?.length || 4;
  const contactInquiries = contactResult.count || 0;
  const newsletterSubscribers = subscribersResult.count || 0;
  const totalOrders = ordersResult.count || 0;
  const lowStockProducts = lowStockResult.count || 0;

  return (
    <div className="mx-auto max-w-7xl pb-12">
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-1 rounded-full">
            Welcome Back
          </span>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Estrella Admin Portal
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Overview of your Estrella business website, products, and content management system.
          </p>
        </div>

        <Link
          href="/admin/banners"
          className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-sky-500/20 transition"
        >
          <Layers className="w-5 h-5" /> Manage Hero Banners
        </Link>
      </div>

      {/* Main Interactive Overview: Stats, All Categories, All Products */}
      <DashboardOverview
        initialCounts={{
          productCount,
          categoryCount,
          subcategoryCount,
          departmentCount,
          catalogueCount,
        }}
      />

      {/* Quick Access Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-6 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0]">Hero Slider CMS</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Homepage Hero Section Banners</h3>
            <p className="text-xs text-slate-600 mt-1">
              Easily update, add, remove or choose pre-built placeholder banner templates for your homepage hero slider.
            </p>
          </div>
          <Link
            href="/admin/banners"
            className="inline-block bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition w-fit"
          >
            Manage Hero Banners →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0]">Page CMS</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Manage All Website Pages</h3>
            <p className="text-xs text-slate-600 mt-1">
              View, manage, edit and publish content for all pages across the Estrella website.
            </p>
          </div>
          <Link
            href="/admin/pages"
            className="inline-block border border-slate-300 hover:border-[#00AEF0] text-slate-800 hover:text-[#00AEF0] px-5 py-2.5 rounded-xl text-xs font-bold transition w-fit"
          >
            Open All Pages CMS →
          </Link>
        </div>
      </div>
    </div>
  );
}

