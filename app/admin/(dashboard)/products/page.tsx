'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  FolderOpen,
  Layers,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { deleteProducts } from '@/lib/actions/admin/products';
import { useSearchParams } from 'next/navigation';
import { DEFAULT_CATEGORIES } from '@/lib/cms/defaultCategories';
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
  categoryLabel?: string;
  subcategory?: string;
  subcategory_id?: string;
  main_image_url?: string;
  source_data?: any;
}

const ITEMS_PER_PAGE = 25;

function getImageUrlStr(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img !== null) {
    return img.src || img.url || img.href || '';
  }
  return '';
}

function normalizeSlug(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ProductsListContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const categoryFilterParam = searchParams.get('category')?.trim().toLowerCase() || '';
  const subcategoryFilterParam = searchParams.get('subcategory')?.trim().toLowerCase() || '';

  const supabase = createClient();

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [categoryFilterParam, subcategoryFilterParam, search]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    let loadedList: Product[] = [];

    // 1. Read stored products (which includes all 345 WordPress products + user edits)
    const stored = getStoredProducts();
    const defaultsMapped: Product[] = stored.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      sku: p.sku || `EST-WP-${p.id}`,
      slug: p.slug,
      price: Number(p.price) || 0,
      sale_price: p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : (p.salePrice || undefined),
      stock_quantity: p.stock_quantity ?? p.stockQuantity ?? 100,
      is_featured: Boolean(p.is_featured ?? p.isFeatured),
      is_active: p.is_active !== false && p.isActive !== false,
      is_published: p.is_published !== false && p.isPublished !== false,
      category_id: p.category_id || p.category || 'sportswears',
      category: p.category || p.category_id || 'sportswears',
      subcategory: p.subcategory || p.source_data?.subcategory || '',
      subcategory_id: p.subcategory_id || p.source_data?.subcategory_id || '',
      main_image_url: getImageUrlStr(p.main_image_url) || getImageUrlStr(p.mainImage) || '/images/about/gallery-1.jpg',
      source_data: p,
    }));

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Merge Supabase overrides with stored items
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
            subcategory: localOverride?.subcategory || d.subcategory || '',
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
    } catch {
      loadedList = defaultsMapped;
    }

    setProducts(loadedList);
    setLoading(false);
  }

  // Categories list from DEFAULT_CATEGORIES
  const categoriesList = DEFAULT_CATEGORIES;

  // Active category object if a category tab is selected
  const activeCategory = useMemo(() => {
    if (!categoryFilterParam) return null;
    return categoriesList.find(
      (c) =>
        c.slug.toLowerCase() === categoryFilterParam ||
        c.slug.toLowerCase() === `${categoryFilterParam}s` ||
        categoryFilterParam.includes(c.slug.replace('-equipment', '').replace('-footballs', '').replace('s', ''))
    );
  }, [categoryFilterParam, categoriesList]);

  // Active subcategories list
  const activeSubcategories = activeCategory?.subcategories || [];

  // Filter products by category, subcategory, search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pName = (p.name || '').toLowerCase();
      const pSku = (p.sku || '').toLowerCase();
      const pSub = (p.subcategory || p.source_data?.subcategory || '').toLowerCase();
      const pSubId = (p.subcategory_id || '').toLowerCase();
      const pCat = (p.category || p.category_id || '').toLowerCase();

      // Search match
      if (search) {
        const q = search.toLowerCase();
        const matches = pName.includes(q) || pSku.includes(q) || pSub.includes(q) || pCat.includes(q);
        if (!matches) return false;
      }

      // Category match
      if (categoryFilterParam) {
        const targetSlug = activeCategory ? activeCategory.slug.toLowerCase() : categoryFilterParam;
        const matchesCat =
          pCat === targetSlug ||
          pCat === targetSlug.replace(/s$/, '') ||
          `${pCat}s` === targetSlug ||
          (targetSlug.includes('sport') && pCat.includes('sport')) ||
          (targetSlug.includes('box') && pCat.includes('box')) ||
          (targetSlug.includes('casual') && pCat.includes('casual')) ||
          (targetSlug.includes('active') && pCat.includes('active')) ||
          (targetSlug.includes('soccer') && (pCat.includes('soccer') || pCat.includes('football')));

        if (!matchesCat) return false;
      }

      // Subcategory match
      if (subcategoryFilterParam) {
        const targetSubSlug = normalizeSlug(subcategoryFilterParam);
        const matchesSub =
          normalizeSlug(pSub) === targetSubSlug ||
          normalizeSlug(pSubId) === targetSubSlug ||
          pSub.includes(subcategoryFilterParam) ||
          targetSubSlug.includes(normalizeSlug(pSub));

        if (!matchesSub) return false;
      }

      return true;
    });
  }, [products, search, categoryFilterParam, subcategoryFilterParam, activeCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const isAllCurrentSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedIds.includes(p.id));

  function toggleSelectAllCurrent() {
    if (isAllCurrentSelected) {
      const currentSet = new Set(paginatedProducts.map((p) => p.id));
      setSelectedIds((prev) => prev.filter((id) => !currentSet.has(id)));
    } else {
      const currentIds = paginatedProducts.map((p) => p.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  }

  function toggleSelectProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function togglePublished(id: string, isPublished: boolean) {
    const targetProd = products.find((p) => p.id === id);
    if (targetProd) {
      saveStoredProduct({ ...targetProd, is_published: !isPublished });
    }
    await supabase.from('products').update({ is_published: !isPublished }).eq('id', id);

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
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (!confirm(`Are you sure you want to delete ${count} selected product(s)? This cannot be undone.`)) return;

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
    await supabase.from('products').update({ is_published: publishState }).in('id', selectedIds);

    setMessage(`✅ ${selectedIds.length} product(s) marked as ${publishState ? 'Published' : 'Draft'}`);
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) {
    return <div className="p-8 text-slate-700 font-medium">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalogue Management</p>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Live WordPress Sync
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Products & Categories</h1>
            <p className="text-slate-500 text-sm mt-1">
              Showing {filteredProducts.length} products
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
              Manage Categories ({categoriesList.length})
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

        {/* Primary Category Tabs from WordPress */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <Link
            href="/admin/products"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              !categoryFilterParam
                ? 'bg-[#00AEF0] text-white shadow-sky-500/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#00AEF0] hover:text-[#00AEF0]'
            }`}
          >
            All Products ({products.length})
          </Link>

          {categoriesList.map((cat) => {
            const isCatActive =
              categoryFilterParam === cat.slug.toLowerCase() ||
              (activeCategory && activeCategory.slug === cat.slug);

            const catCount = products.filter((p) => {
              const pCat = (p.category || p.category_id || '').toLowerCase();
              return (
                pCat === cat.slug.toLowerCase() ||
                pCat === cat.slug.toLowerCase().replace(/s$/, '') ||
                `${pCat}s` === cat.slug.toLowerCase() ||
                (cat.slug.includes('sport') && pCat.includes('sport')) ||
                (cat.slug.includes('box') && pCat.includes('box')) ||
                (cat.slug.includes('casual') && pCat.includes('casual')) ||
                (cat.slug.includes('active') && pCat.includes('active')) ||
                (cat.slug.includes('soccer') && (pCat.includes('soccer') || pCat.includes('football')))
              );
            }).length;

            return (
              <Link
                key={cat.slug}
                href={`/admin/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isCatActive
                    ? 'bg-[#00AEF0] text-white shadow-sky-500/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#00AEF0] hover:text-[#00AEF0]'
                }`}
              >
                {cat.name} ({catCount})
              </Link>
            );
          })}
        </div>

        {/* Subcategories Filter Pills */}
        {activeCategory && activeSubcategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 pl-1 mr-1">
              {activeCategory.name} Subcategories:
            </span>
            <Link
              href={`/admin/products?category=${activeCategory.slug}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !subcategoryFilterParam
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All {activeCategory.name}
            </Link>
            {activeSubcategories.map((sub) => {
              const isSubActive =
                subcategoryFilterParam === sub.slug.toLowerCase() ||
                subcategoryFilterParam === normalizeSlug(sub.name);

              const subCount = products.filter((p) => {
                const pSub = p.subcategory || p.source_data?.subcategory || p.subcategory_id || '';
                return (
                  normalizeSlug(pSub) === normalizeSlug(sub.slug) ||
                  normalizeSlug(pSub) === normalizeSlug(sub.name) ||
                  pSub.toLowerCase().includes(sub.slug.toLowerCase())
                );
              }).length;

              return (
                <Link
                  key={sub.slug}
                  href={`/admin/products?category=${activeCategory.slug}&subcategory=${sub.slug}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isSubActive
                      ? 'bg-[#00AEF0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{sub.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSubActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {subCount}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Notification Toast */}
        {message && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600" />
            {message}
          </div>
        )}

        {/* Search & Bulk Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 345 products by name, SKU, or subcategory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

            {paginatedProducts.length > 0 && (
              <button
                type="button"
                onClick={toggleSelectAllCurrent}
                className="text-xs font-bold text-slate-600 hover:text-[#00AEF0] transition-colors cursor-pointer flex items-center gap-1 ml-2"
              >
                {isAllCurrentSelected ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-[#00AEF0]" /> Deselect Page
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-slate-400" /> Select Page ({paginatedProducts.length})
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
                      checked={isAllCurrentSelected}
                      onChange={toggleSelectAllCurrent}
                      title={isAllCurrentSelected ? 'Deselect page' : 'Select page'}
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
                {paginatedProducts.map((product) => {
                  const imageUrl =
                    getImageUrlStr(product.main_image_url) ||
                    getImageUrlStr(product.source_data?.mainImage) ||
                    '/images/placeholder.png';
                  const isSelected = selectedIds.includes(product.id);
                  const catLabel = product.categoryLabel || product.category || 'Product';
                  const subLabel = product.subcategory || product.source_data?.subcategory;

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-sky-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#00AEF0] focus:ring-[#00AEF0] cursor-pointer accent-[#00AEF0]"
                        />
                      </td>

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

                      <td className="p-4 max-w-[280px]">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-bold text-slate-900 hover:text-[#00AEF0] transition line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{product.slug}</p>
                      </td>

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

                      <td className="p-4 text-slate-700 font-mono font-bold text-xs">
                        {product.sku}
                      </td>

                      <td className="p-4 text-slate-900 font-bold">
                        Rs. {product.price?.toLocaleString()}
                        {product.sale_price ? (
                          <span className="block text-[11px] text-emerald-600 font-medium">
                            Sale: Rs. {product.sale_price.toLocaleString()}
                          </span>
                        ) : null}
                      </td>

                      <td className="p-4 font-semibold text-slate-600">
                        {product.stock_quantity || 100}
                      </td>

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
                      <p className="text-xs text-slate-400 mt-1">Try selecting another subcategory or searching another name.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
              <div>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{' '}
                {filteredProducts.length} products
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
