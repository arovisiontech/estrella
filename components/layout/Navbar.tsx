"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, X, ArrowRight, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import SearchModal from "./SearchModal";
import { getActiveDepartments } from "@/lib/data/departments";
import { DEFAULT_CATEGORIES } from "@/lib/cms/defaultCategories";
import { getCategoriesWithSubcategories } from "@/lib/cms/categories";

type SubmenuItem = {
  name: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  slug?: string;
  isDepartments?: boolean;
  subcategories?: SubmenuItem[];
};

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categoriesData, setCategoriesData] = useState(DEFAULT_CATEGORIES);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { itemCount } = useCart();
  const departmentsList = getActiveDepartments();

  useEffect(() => {
    async function loadCMSCategories() {
      try {
        const fetched = await getCategoriesWithSubcategories();
        if (fetched && fetched.length > 0) {
          setCategoriesData(fetched);
        }
      } catch (err) {
        console.warn("Failed loading live categories for navbar dropdowns:", err);
      }
    }
    loadCMSCategories();
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Helper to build subcategories for WordPress categories
  const getSubcategoriesForCategory = (catSlug: string): SubmenuItem[] => {
    const norm = catSlug.toLowerCase().replace(/s$/, "");
    const matchedCat = categoriesData.find(
      (c) =>
        c.slug.toLowerCase() === catSlug.toLowerCase() ||
        c.slug.toLowerCase().replace(/s$/, "") === norm ||
        c.name.toLowerCase().includes(norm.replace("-equipment", "").replace("-footballs", "").replace("-wear", ""))
    );

    if (matchedCat && matchedCat.subcategories && matchedCat.subcategories.length > 0) {
      return [
        { name: `All ${matchedCat.name}`, href: `/categories/${matchedCat.slug}` },
        ...matchedCat.subcategories.map((sub) => ({
          name: sub.name,
          href: `/categories/${matchedCat.slug}?subcategory=${sub.slug}`,
        })),
      ];
    }

    return [];
  };

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    {
      label: "Sportswears",
      href: "/categories/sportswears",
      slug: "sportswears",
      subcategories: getSubcategoriesForCategory("sportswears"),
    },
    {
      label: "Boxing Equipment",
      href: "/categories/boxing-equipment",
      slug: "boxing-equipment",
      subcategories: getSubcategoriesForCategory("boxing-equipment"),
    },
    {
      label: "Casual Wears",
      href: "/categories/casual-wears",
      slug: "casual-wears",
      subcategories: getSubcategoriesForCategory("casual-wears"),
    },
    {
      label: "Active Wear",
      href: "/categories/active-wear",
      slug: "active-wear",
      subcategories: getSubcategoriesForCategory("active-wear"),
    },
    {
      label: "Soccer Footballs",
      href: "/categories/soccer-footballs",
      slug: "soccer-footballs",
      subcategories: getSubcategoriesForCategory("soccer-footballs"),
    },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 shadow-xs w-full">
      <div className="site-container h-18 sm:h-20 lg:h-22 flex items-center justify-between gap-2 xl:gap-4 px-4 sm:px-6 lg:px-8">

        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center py-1">
            <Image
              src="/images/estrella-logo.png"
              alt="Estrella International"
              width={160}
              height={36}
              className="h-6 sm:h-7 lg:h-8 w-auto object-contain max-h-8"
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* Center: Navigation Menu Buttons */}
        <nav className="hidden lg:flex items-center justify-center gap-1 lg:gap-1.5 xl:gap-3 flex-1 min-w-0 px-1">
          {navItems.map((item) => {
            const hasSubmenu = Boolean(item.isDepartments || (item.subcategories && item.subcategories.length > 0));
            const isOpen = activeDropdown === item.label;

            if (hasSubmenu) {
              return (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`text-[11px] lg:text-[12px] xl:text-[13px] font-bold tracking-tight xl:tracking-wide whitespace-nowrap transition-colors duration-200 flex items-center gap-1 px-1.5 xl:px-2 py-2 ${
                      isActive(item.href)
                        ? "text-[#00AEF0]"
                        : "text-slate-800 hover:text-[#00AEF0]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#00AEF0]" : "text-slate-400"}`} />
                  </Link>

                  {/* Dropdown Submenu */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 z-[99] py-2 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="flex flex-col">
                        {item.isDepartments ? (
                          departmentsList.map((dept) => (
                            <Link
                              key={dept.id}
                              href={`/departments/${dept.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 px-4 py-2.5 text-xs xl:text-sm font-semibold text-slate-800 hover:bg-sky-50/80 hover:text-[#00AEF0] transition-colors group border-b border-slate-50 last:border-0"
                            >
                              <span className="w-2 h-2 rounded-full bg-[#00AEF0] group-hover:scale-125 transition-transform shrink-0" />
                              <span>{dept.name}</span>
                            </Link>
                          ))
                        ) : (
                          item.subcategories?.map((sub, idx) => (
                            <Link
                              key={`${sub.name}-${idx}`}
                              href={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-xs xl:text-sm font-semibold text-slate-800 hover:bg-sky-50/80 hover:text-[#00AEF0] transition-colors group border-b border-slate-50 last:border-0 ${
                                idx === 0 ? "font-bold text-[#00AEF0] bg-sky-50/40" : ""
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-[#00AEF0]" : "bg-slate-300 group-hover:bg-[#00AEF0]"} group-hover:scale-125 transition-all shrink-0`} />
                              <span>{sub.name}</span>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[11px] lg:text-[12px] xl:text-[13px] font-bold tracking-tight xl:tracking-wide whitespace-nowrap transition-colors duration-200 px-1.5 xl:px-2 py-2 ${
                  isActive(item.href)
                    ? "text-[#00AEF0]"
                    : "text-slate-800 hover:text-[#00AEF0]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Buttons (Search, Cart, Catalogue Button) */}
        <div className="hidden lg:flex items-center justify-end gap-1.5 lg:gap-2 xl:gap-3 shrink-0">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="text-slate-700 hover:text-[#00AEF0] transition p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <Link
            href="/cart"
            className="relative text-slate-700 hover:text-[#00AEF0] transition p-1.5 rounded-full hover:bg-slate-100"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-[#00AEF0] text-[10px] font-bold flex items-center justify-center text-white shadow-xs">
              {itemCount}
            </span>
          </Link>

          {/* Cyan Catalogue Pill Button */}
          <Link
            href="/catalogue"
            className="rounded-full bg-[#00AEF0] px-3.5 xl:px-4 py-2 text-[11px] xl:text-xs font-bold text-white shadow-md shadow-sky-500/20 transition-all duration-300 hover:bg-[#0095ce] hover:shadow-sky-500/40 flex items-center gap-1 whitespace-nowrap"
          >
            <span>Catalogue</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Header Toggle Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="text-slate-800 hover:text-[#00AEF0] transition p-1.5"
            aria-label="Search"
          >
            <Search size={22} />
          </button>

          <Link
            href="/cart"
            className="relative text-slate-800 hover:text-[#00AEF0] transition p-1.5"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#00AEF0] text-[9px] font-bold flex items-center justify-center text-white">
              {itemCount}
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-800 p-1.5 rounded-lg hover:bg-slate-100"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 max-h-[calc(100vh-80px)] overflow-y-auto shadow-xl">
          <div className="site-container py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const hasSubmenu = Boolean(item.isDepartments || (item.subcategories && item.subcategories.length > 0));
              const isExpanded = mobileExpandedItem === item.label;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between py-2.5 px-4 rounded-lg">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-bold transition flex-1 ${
                        isActive(item.href)
                          ? "text-[#00AEF0]"
                          : "text-slate-800 hover:text-[#00AEF0]"
                      }`}
                    >
                      {item.label}
                    </Link>

                    {hasSubmenu && (
                      <button
                        onClick={() => setMobileExpandedItem(isExpanded ? null : item.label)}
                        className="p-2 text-slate-500 hover:text-[#00AEF0]"
                        aria-label="Toggle Submenu"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180 text-[#00AEF0]" : ""}`} />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu Accordion */}
                  {hasSubmenu && isExpanded && (
                    <div className="pl-6 py-1 space-y-1 bg-slate-50 rounded-lg mx-2 my-1 border border-slate-100">
                      {item.isDepartments ? (
                        departmentsList.map((dept) => (
                          <Link
                            key={dept.id}
                            href={`/departments/${dept.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2 px-3 text-sm font-semibold text-slate-700 hover:text-[#00AEF0] flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00AEF0]" />
                            <span>{dept.name}</span>
                          </Link>
                        ))
                      ) : (
                        item.subcategories?.map((sub, idx) => (
                          <Link
                            key={`mob-${sub.name}-${idx}`}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`py-2 px-3 text-sm font-semibold flex items-center gap-2 ${
                              idx === 0 ? "text-[#00AEF0] font-bold" : "text-slate-700 hover:text-[#00AEF0]"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? "bg-[#00AEF0]" : "bg-slate-400"}`} />
                            <span>{sub.name}</span>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4 border-t border-slate-100 mt-2">
              <Link
                href="/catalogue"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full rounded-full bg-[#00AEF0] py-3 text-center text-sm font-bold text-white shadow-md flex items-center justify-center gap-2"
              >
                <span>View Catalogue</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

    </header>
  );
}