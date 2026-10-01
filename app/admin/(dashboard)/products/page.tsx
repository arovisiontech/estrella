'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Check, FolderOpen, Layers, CheckSquare, Square } from 'lucide-react';
import Image from 'next/image';
import { deleteProducts } from '@/lib/actions/admin/products';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_PRODUCTS } from '@/lib/cms/defaultProducts';
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
  deleteStoredProducts,
} from '@/lib/cms/clientStorage';

interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  is_published: boolean;
  category_id: string;
  category?: string;
  subcategory?: string;
  subcategory_id?: string;
  main_image_url?: string;
  source_data?: any;
}

const SUBCATS_MAP: Record<string, { id: string; label: string }[]> = {
  sportswear: [
    { id: 'tracksuits', label: 'Tracksuits' },
    { id: 'sublimation-shirts', label: 'Sublimation Shirts' },
    { id: 'hoodies', label: 'Hoodies & Sweatshirts' },
    { id: 'fitness-wear', label: 'Gym & Fitness Wear' },
  ],
  'boxing-equipment': [
    { id: 'pro-boxing-gloves', label: 'Pro Boxing Gloves' },
    { id: 'focus-pads', label: 'Focus Mitts & Target Pads' },
    { id: 'head-guards', label: 'Head Guards & Protection' },
    { id: 'punching-bags', label: 'Punching Bags' },
  ],
  'soccer-footballs': [
    { id: 'match-footballs', label: 'Official Match Footballs' },
    { id: 'training-footballs', label: 'Training Footballs' },
    { id: 'futsal-balls', label: 'Futsal Balls' },
    { id: 'sublimated-footballs', label: 'Sublimated Footballs' },
  ],
};

function getCategoryLabel(cat?: string): string {
  if (!cat) return 'Sportswears';
  const c = cat.toLowerCase();
  if (c.includes('sport')) return 'Sportswears';
  if (c.includes('box')) return 'Boxing Equipment';
  if (c.includes('soccer') || c.includes('football')) return 'Soccer Footballs';
  return cat;
}

function getImageUrlStr(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img !== null) {
    return img.src || img.url || img.href || '';
  }
  return '';
}

function isSubcategoryMatch(productSub: string, filterSub: string): boolean {
  if (!filterSub) return true;
  const pSub = (productSub || '').toLowerCase();
  const fSub = filterSub.toLowerCase();

  if (pSub === fSub) return true;
  if (pSub.includes(fSub) || fSub.includes(pSub)) return true;

  if (fSub === 'fitness-wear' && (pSub.includes('fitness') || pSub.includes('gym') || pSub.includes('basketball'))) return true;
  if (fSub === 'tracksuits' && pSub.includes('tracksuit')) return true;
  if (fSub === 'sublimation-shirts' && (pSub.includes('sublimat') || pSub.includes('shirt') || pSub.includes('jersey'))) return true;
  if (fSub === 'hoodies' && (pSub.includes('hoodie') || pSub.includes('sweat'))) return true;

  if (fSub === 'pro-boxing-gloves' && pSub.includes('glove')) return true;
  if (fSub === 'focus-pads' && (pSub.includes('focus') || pSub.includes('mitt') || pSub.includes('pad'))) return true;
  if (fSub === 'head-guards' && (pSub.includes('head') || pSub.includes('guard'))) return true;
  if (fSub === 'punching-bags' && (pSub.includes('punch') || pSub.includes('bag'))) return true;

  if (fSub === 'match-footballs' && (pSub.includes('match') || pSub.includes('thermo'))) return true;
  if (fSub === 'training-footballs' && pSub.includes('training')) return true;
  if (fSub === 'futsal-balls' && pSub.includes('futsal')) return true;
  if (fSub === 'sublimated-footballs' && (pSub.includes('sublimat') || pSub.includes('custom'))) return true;

  return false;
}

function ProductsListContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const categoryFilterParam = searchParams.get('category')?.trim().toLowerCase() || '';
  const subcategoryFilterParam = searchParams.get('subcategory')?.trim().toLowerCase() || '';

  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    let loadedList: Product[] = [];

    // 1. Read stored products (persisted in client storage across all browser refreshes)
    const stored = getStoredProducts();
    const defaultsMapped: Product[] = stored.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      sku: p.sku,
      slug: p.slug,
      price: Number(p.price) || 0,
      sale_price: p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : (p.salePrice || undefined),
      stock_quantity: p.stock_quantity ?? p.stockQuantity ?? 100,
      is_featured: Boolean(p.is_featured ?? p.isFeatured),
      is_active: p.is_active !== false && p.isActive !== false,
      is_published: p.is_published !== false && p.isPublished !== false,
      category_id: p.category_id || p.category || 'sportswear',
      category: p.category || p.category_id || 'sportswear',
      subcategory: p.subcategory || p.source_data?.subcategory || '',
      subcategory_id: p.subcategory_id || p.source_data?.subcategory_id || '',
      main_image_url: getImageUrlStr(p.main_image_url) || getImageUrlStr(p.mainImage) || '/images/banner-sublimation-sports.svg',
      source_data: p,
    }));

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge Supabase data with stored overrides
        const storedMap = new Map(defaultsMapped.map((p) => [p.id, p]));
        const dbItems = data.map((d: any) => {
          const localOverride = storedMap.get(String(d.id));
          return {
            id: String(d.id),
            name: localOverride?.name || d.name,
            sku: localOverride?.sku || d.sku,
            slug: localOverride?.slug || d.slug,
            price: localOverride?.price ?? d.price,
            sale_price: localOverride?.sale_price ?? d.sale_price,
            stock_quantity: localOverride?.stock_quantity ?? d.stock_quantity ?? 100,
            is_featured: localOverride?.is_featured ?? d.is_featured,
            is_active: localOverride?.is_active ?? d.is_active,
            is_published: localOverride?.is_published ?? d.is_published,
            category_id: localOverride?.category_id || d.category_id,
            category: localOverride?.category || d.category_id,
            subcategory: localOverride?.subcategory || d.subcategory || d.subcategory_id || '',
            subcategory_id: localOverride?.subcategory_id || d.subcategory_id || '',
            main_image_url: localOverride?.main_image_url || getImageUrlStr(d.main_image_url),
            source_data: localOverride?.source_data || d.source_data,
          };
        });

        const dbIds = new Set(dbItems.map((p: any) => p.id));
        const extraDefaults = defaultsMapped.filter((d) => !dbIds.has(d.id));
        loadedList = [...dbItems, ...extraDefaults];
      } else {
        loadedList = defaultsMapped;
      }
    } catch (e) {
      console.error("Error loading products from DB:", e);
      loadedList = defaultsMapped;
    }

    setProducts(loadedList);
    setLoading(false);
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.subcategory || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by Category
    if (categoryFilterParam) {
      const pCat = (p.category || p.category_id || '').toLowerCase();
      const matchesCat =
        pCat === categoryFilterParam ||
        (categoryFilterParam.includes('sport') && pCat.includes('sport')) ||
        (categoryFilterParam.includes('box') && pCat.includes('box')) ||
        (categoryFilterParam.includes('soccer') && (pCat.includes('soccer') || pCat.includes('football')));
      if (!matchesCat) return false;
    }

    // Filter by Subcategory
    if (subcategoryFilterParam) {
      const pSub = p.subcategory || p.subcategory_id || p.source_data?.subcategory || '';
      if (!isSubcategoryMatch(pSub, subcategoryFilterParam)) {
        return false;
      }
    }

    return true;
  });

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every(p => selectedIds.includes(p.id));

  function toggleSelectAll() {
    if (isAllSelected) {
      const filteredSet = new Set(filteredProducts.map(p => p.id));
      setSelectedIds(prev => prev.filter(id => !filteredSet.has(id)));
    } else {
      const filteredIds = filteredProducts.map(p => p.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...filteredIds])));
    }
  }

  function toggleSelectProduct(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  async function togglePublished(id: string, isPublished: boolean) {
    const targetProd = products.find(p => p.id === id);
    if (targetProd) {
      const updated = { ...targetProd, is_published: !isPublished };
      saveStoredProduct(updated);
    }
    await supabase
      .from('products')
      .update({ is_published: !isPublished })
      .eq('id', id);

    setMessage('✅ Product status updated & saved');
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product? This will remove it from the website.')) return;
    setIsDeleting(true);
    deleteStoredProduct(id);
    await deleteProducts([id]);
    setIsDeleting(false);

    setMessage('✅ Product deleted successfully');
    setSelectedIds(prev => prev.filter(i => i !== id));
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (
      !confirm(
        `Are you sure you want to delete ${count} selected product(s)? This cannot be undone.`
      )
    )
      return;

    setIsDeleting(true);
    deleteStoredProducts(selectedIds);
    await deleteProducts(selectedIds);
    setIsDeleting(false);

    setMessage(`✅ ${count} product(s) deleted successfully`);
    setSelectedIds([]);
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleBulkPublish(publishState: boolean) {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => {
      const p = products.find((prod) => prod.id === id);
      if (p) {
        saveStoredProduct({ ...p, is_published: publishState });
      }
    });
    await supabase
      .from('products')
      .update({ is_published: publishState })
      .in('id', selectedIds);

    setMessage(`✅ ${selectedIds.length} product(s) updated to ${publishState ? 'Published' : 'Draft'}`);
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  // Active subcategories list for currently selected category tab
  const activeCategoryKey = categoryFilterParam.includes('sport')
    ? 'sportswear'
    : categoryFilterParam.includes('box')
    ? 'boxing-equipment'
    : categoryFilterParam.includes('soccer') || categoryFilterParam.includes('football')
    ? 'soccer-footballs'
    : '';

  const activeSubcategories = activeCategoryKey ? SUBCATS_MAP[activeCategoryKey] || [] : [];

  if (loading) {
    return <div className="p-8 text-slate-700 font-medium">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalogue Management</p>
              <span className="text-slate-300">•</span>
              <p className="text-xs font-semibold text-slate-500">Live Website Sync</p>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Products & Categories</h1>
            <p className="text-slate-500 text-sm mt-1">
              Showing {filteredProducts.length} of {products.length} total products
              {selectedIds.length > 0 && (
                <span className="ml-2 font-semibold text-[#00AEF0]">
                  ({selectedIds.length} selected)
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/categories"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Manage Categories
            </Link>
            <Link
              href="/admin/subcategories"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              Manage Subcategories
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-md shadow-sky-500/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        {/* Primary Category Filter Tabs */}
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <Link
            href="/admin/products"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              !categoryFilterParam
                ? "bg-[#00AEF0] text-white shadow-sky-500/20"
                : "bg-white text-slate-700 border border-slate-200 hover:border-[#00AEF0] hover:text-[#00AEF0]"
            }`}
          >
            All Products ({products.length})
          </Link>
          <Link
            href="/admin/products?category=sportswear"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              categoryFilterParam === "sportswear"
                ? "bg-[#00AEF0] text-white shadow-sky-500/20"
                : "bg-white text-slate-700 border border-slate-200 hover:border-[#00AEF0] hover:text-[#00AEF0]"
            }`}
          >
            Sportswears ({products.filter(p => (p.category_id || p.category || '').toLowerCase().includes('sport')).length})
          </Link>
          <Link
            href="/admin/products?category=boxing-equipment"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              categoryFilterParam === "boxing-equipment"
                ? "bg-[#00AEF0] text-white shadow-sky-500/20"
                : "bg-white text-slate-700 border border-slate-200 hover:border-[#00AEF0] hover:text-[#00AEF0]"
            }`}
          >
            Boxing Equipment ({products.filter(p => (p.category_id || p.category || '').toLowerCase().includes('box')).length})
          </Link>
          <Link
            href="/admin/products?category=soccer-footballs"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              categoryFilterParam === "soccer-footballs"
                ? "bg-[#00AEF0] text-white shadow-sky-500/20"
                : "bg-white text-slate-700 border border-slate-200 hover:border-[#00AEF0] hover:text-[#00AEF0]"
            }`}
          >
            Soccer Footballs ({products.filter(p => (p.category_id || p.category || '').toLowerCase().includes('soccer') || (p.category_id || p.category || '').toLowerCase().includes('football')).length})
          </Link>
        </div>

        {/* Subcategories Filter Pills (Interactive, as shown in SS 1, 2, 3 website dropdowns) */}
        {activeSubcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 pl-1 mr-1">
              Subcategories:
            </span>
            <Link
              href={`/admin/products?category=${activeCategoryKey}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !subcategoryFilterParam
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All {getCategoryLabel(activeCategoryKey)}
            </Link>
            {activeSubcategories.map((sub) => {
              const isActiveSub = subcategoryFilterParam === sub.id;
              const subCount = products.filter((p) => {
                const pCat = (p.category || p.category_id || '').toLowerCase();
                const matchesCat =
                  pCat === activeCategoryKey ||
                  (activeCategoryKey.includes('sport') && pCat.includes('sport')) ||
                  (activeCategoryKey.includes('box') && pCat.includes('box')) ||
                  (activeCategoryKey.includes('soccer') && (pCat.includes('soccer') || pCat.includes('football')));
                if (!matchesCat) return false;
                const pSub = p.subcategory || p.subcategory_id || p.source_data?.subcategory || '';
                return isSubcategoryMatch(pSub, sub.id);
              }).length;

              return (
                <Link
                  key={sub.id}
                  href={`/admin/products?category=${activeCategoryKey}&subcategory=${sub.id}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActiveSub
                      ? "bg-[#00AEF0] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{sub.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActiveSub ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {subCount}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Global Subcategories Shortcuts if on "All Products" view */}
        {!categoryFilterParam && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Quick Filter by Website Subcategories (SS 1, 2, 3)
              </span>
              <span className="text-xs text-slate-400">12 Subcategories Available</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded">Sportswears:</span>
              {SUBCATS_MAP.sportswear.map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/products?category=sportswear&subcategory=${s.id}`}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-sky-50 hover:text-[#00AEF0] transition"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">Boxing:</span>
              {SUBCATS_MAP['boxing-equipment'].map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/products?category=boxing-equipment&subcategory=${s.id}`}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Soccer:</span>
              {SUBCATS_MAP['soccer-footballs'].map((s) => (
                <Link
                  key={s.id}
                  href={`/admin/products?category=soccer-footballs&subcategory=${s.id}`}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Message notification */}
        {message && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600" />
            {message}
          </div>
        )}

        {/* Search & Bulk Action Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or subcategory..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-400 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkPublish(true)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Publish ({selectedIds.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkPublish(false)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Set Draft ({selectedIds.length})
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
                </button>
              </div>
            ) : null}

            {filteredProducts.length > 0 && (
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-xs font-bold text-slate-600 hover:text-[#00AEF0] transition-colors cursor-pointer flex items-center gap-1 ml-2"
              >
                {isAllSelected ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-[#00AEF0]" /> Deselect All
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-slate-400" /> Select All ({filteredProducts.length})
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      title={isAllSelected ? "Deselect all" : "Select all"}
                      className="w-4 h-4 rounded border-slate-300 text-[#00AEF0] focus:ring-[#00AEF0] cursor-pointer accent-[#00AEF0]"
                    />
                  </th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category & Subcategory</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map(product => {
                  const imageUrl =
                    getImageUrlStr(product.main_image_url) ||
                    getImageUrlStr(product.source_data?.mainImage) ||
                    '/images/placeholder.png';
                  const isSelected = selectedIds.includes(product.id);
                  const catLabel = getCategoryLabel(product.category || product.category_id);
                  const subLabel = product.subcategory || product.source_data?.subcategory || product.subcategory_id;

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-sky-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#00AEF0] focus:ring-[#00AEF0] cursor-pointer accent-[#00AEF0]"
                        />
                      </td>

                      {/* Image */}
                      <td className="p-4">
                        <div className="w-12 h-12 relative bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="p-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-bold text-slate-900 hover:text-[#00AEF0] transition line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{product.slug}</p>
                      </td>

                      {/* Category & Subcategory Badge */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-[#00AEF0] border border-sky-100">
                            {catLabel}
                          </span>
                          {subLabel ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              ↳ {subLabel}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4 text-slate-700 font-mono font-bold text-xs">
                        {product.sku}
                      </td>

                      {/* Price */}
                      <td className="p-4 text-slate-900 font-bold">
                        Rs. {product.price?.toLocaleString()}
                        {product.sale_price ? (
                          <span className="block text-[11px] text-emerald-600 font-medium">
                            Sale: Rs. {product.sale_price.toLocaleString()}
                          </span>
                        ) : null}
                      </td>

                      {/* Stock */}
                      <td className="p-4 font-semibold text-slate-600">
                        {product.stock_quantity || 0}
                      </td>

                      {/* Status / Publish Toggle */}
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => togglePublished(product.id, product.is_published)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition shadow-xs cursor-pointer ${
                            product.is_published
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {product.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-[#00AEF0] hover:text-[#0090c8] hover:bg-sky-50 p-2 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-400 font-medium">
                      <p className="text-base font-bold text-slate-600">No products found matching your filter.</p>
                      <p className="text-xs text-slate-400 mt-1">Try selecting another subcategory or adding a new product.</p>
                      <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-1.5 mt-4 bg-[#00AEF0] text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Product Now
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-700 font-medium">Loading products...</div>}>
      <ProductsListContent />
    </Suspense>
  );
}
