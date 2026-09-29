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

const sidebarSections = [
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
    items: [
      { label: "Sportswears", href: "/admin/products?category=sportswear", icon: ShoppingBag },
      { label: "Boxing Equipment", href: "/admin/products?category=boxing-equipment", icon: FolderOpen },
      { label: "Soccer Footballs", href: "/admin/products?category=soccer-footballs", icon: FolderOpen },
      { label: "All Categories", href: "/admin/categories", icon: FolderOpen },
      { label: "All Products", href: "/admin/products", icon: ShoppingBag },
    ],
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
      return pathname === "/admin/products" && !searchParams.get("category");
    }

    return pathname === href || (pathname.startsWith(`${href}/`) && href !== "/admin");
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

              return (
                <Link
                  key={item.href}
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
