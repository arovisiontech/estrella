"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  BookOpen,
  Mail,
  FolderOpen,
  HelpCircle,
  Sparkles,
  Users,
  Image as ImageIcon,
} from "lucide-react";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: any;
  children?: NavChild[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

import { DEFAULT_CATEGORIES } from "@/lib/cms/defaultCategories";

const productCategoryItems: NavItem[] = [
  ...DEFAULT_CATEGORIES.map((cat) => ({
    label: cat.name,
    href: `/admin/products?category=${cat.slug}`,
    icon: cat.slug.includes("box") ? FolderOpen : ShoppingBag,
    children: (cat.subcategories || []).map((sub) => ({
      label: sub.name,
      href: `/admin/products?category=${cat.slug}&subcategory=${sub.slug}`,
    })),
  })),
  { label: "All Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "All Subcategories", href: "/admin/subcategories", icon: FolderOpen },
  { label: "All Products", href: "/admin/products", icon: ShoppingBag },
];

const sidebarSections: NavSection[] = [
  {
    title: "HOMEPAGE SECTIONS",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Hero Banners", href: "/admin/banners", icon: Layers },
      { label: "Discover Categories", href: "/admin/discover-categories", icon: Layers },
      { label: "Football Collection", href: "/admin/football-collection", icon: Layers },
      { label: "Concept to Creation", href: "/admin/concept-to-creation", icon: Layers },
      { label: "How We Work", href: "/admin/how-we-work", icon: Layers },
      { label: "Who We Manufacture For", href: "/admin/who-we-manufacture-for", icon: Users },
      { label: "Parallax Banner", href: "/admin/parallax-banner", icon: ImageIcon },
      { label: "Manufacturing Process", href: "/admin/manufacturing-process", icon: Sparkles },
      { label: "FAQ Manager", href: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    title: "PRODUCT PAGES",
    items: productCategoryItems,
  },
  {
    title: "PAGES & CONTACT",
    items: [
      { label: "About Us Page CMS", href: "/admin/about", icon: BookOpen },
      { label: "Contact Us Page CMS", href: "/admin/contact-page", icon: Mail },
      { label: "Catalogues Manager", href: "/admin/catalogues", icon: FolderOpen },
      { label: "Events Manager", href: "/admin/events", icon: FolderOpen },
      { label: "Departments Manager", href: "/admin/departments", icon: FolderOpen },
      { label: "All Pages", href: "/admin/pages", icon: BookOpen },
      { label: "Contact Inquiries", href: "/admin/inquiries", icon: Mail },
    ],
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";

    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (pathname !== path) return false;
      const targetParams = new URLSearchParams(query);
      for (const [key, val] of targetParams.entries()) {
        if (searchParams.get(key) !== val) return false;
      }
      return true;
    }

    if (href === "/admin/products") {
      return (
        pathname === "/admin/products" &&
        !searchParams.get("category") &&
        !searchParams.get("subcategory")
      );
    }

    return pathname === href || (pathname.startsWith(`${href}/`) && href !== "/admin");
  };

  const isParentExpanded = (item: NavItem) => {
    if (!item.children || item.children.length === 0) return false;
    if (isActive(item.href)) return true;
    return item.children.some((c) => isActive(c.href));
  };

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
      {sidebarSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            {section.title}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const expanded = isParentExpanded(item);

              return (
                <div key={item.href} className="space-y-1">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[#00AEF0] text-white shadow-md shadow-sky-500/20"
                        : "text-slate-700 hover:text-[#00AEF0] hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>

                  {/* Nested Subcategories */}
                  {item.children && item.children.length > 0 && (
                    <div className="pl-7 pr-1 py-1 space-y-0.5 border-l-2 border-slate-200 ml-4 my-1">
                      {item.children.map((child) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs font-medium transition ${
                              childActive
                                ? "text-[#00AEF0] bg-sky-50 font-bold"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${childActive ? "bg-[#00AEF0]" : "bg-slate-300"}`} />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {

  return (
    <div className={`flex h-full flex-col bg-white border-r border-slate-200 ${isOpen ? "w-64" : "w-0 overflow-hidden"} transition-all duration-300 shadow-xs`}>
      
      {/* Clean Header Logo Area */}
      <div className="border-b border-slate-200 p-5 bg-slate-50 flex flex-col items-start gap-2">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/images/estrella-logo.png"
            alt="Estrella Admin"
            width={140}
            height={32}
            className="h-6 sm:h-7 w-auto object-contain max-h-7"
            priority
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold bg-[#00AEF0] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            Admin Portal
          </span>
          <span className="text-[10px] text-slate-400 font-medium">v1.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <Suspense fallback={<div className="flex-1 p-4" />}>
        <SidebarNav onClose={onClose} />
      </Suspense>

      {/* Footer link to view website */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-slate-700 border border-slate-300 rounded-lg hover:bg-white hover:text-[#00AEF0] transition shadow-xs"
        >
          <span>View Live Website ↗</span>
        </Link>
      </div>

    </div>
  );
}
