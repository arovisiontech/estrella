'use client';

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
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
  main_image_url?: string;
  source_data?: any;
}

function getImageUrlStr(img: any): string {
  if (!img) return '';
  if (typeof img === 'string') return img;
  if (typeof img === 'object' && img !== null) {
    return img.src || img.url || img.href || '';
  }
  return '';
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

  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    let loadedList: Product[] = [];

    // 1. Read stored products (which includes user's latest edited images, text, prices)
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
      p.sku.toLowerCase().includes(search.toLowerCase());

    if (!categoryFilterParam) return matchesSearch;

    const pCategory = (p.category || p.category_id || '').toLowerCase();
    const matchesCategory =
      pCategory === categoryFilterParam ||
      (categoryFilterParam.includes('sport') && pCategory.includes('sport')) ||
      (categoryFilterParam.includes('box') && pCategory.includes('box')) ||
      (categoryFilterParam.includes('soccer') && (pCategory.includes('soccer') || pCategory.includes('football')));

    return matchesSearch && matchesCategory;
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
      saveStoredProduct({ ...targetProd, is_published: !isPublished });
    }
    await supabase
      .from('products')
      .update({ is_published: !isPublished })
      .eq('id', id);

    setMessage('✅ Product updated');
    loadProducts();
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    setIsDeleting(true);
    deleteStoredProduct(id);
    const res = await deleteProducts([id]);
    setIsDeleting(false);

    setMessage('✅ Product deleted');
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

  if (loading) {
    return <div className="p-6 text-slate-700">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalogue</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Products</h1>
            <p className="text-slate-500 text-sm mt-1">
              {filteredProducts.length} products
              {selectedIds.length > 0 && (
                <span className="ml-2 font-medium text-[#00AEF0]">
                  ({selectedIds.length} selected)
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}
              </button>
            )}
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
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

        {message && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-lg text-sm font-medium">
            {message}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-400 text-sm"
            />
          </div>

          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="hover:text-slate-800 underline underline-offset-2 transition-colors cursor-pointer"
              >
                {isAllSelected ? 'Deselect All' : `Select All (${filteredProducts.length})`}
              </button>
            </div>
          )}
        </div>

        <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
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
                  <th className="p-4">Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Published</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map(product => {
                  const imageUrl =
                    getImageUrlStr(product.main_image_url) ||
                    getImageUrlStr(product.source_data?.mainImage) ||
                    '/images/placeholder.png';
                  const isSelected = selectedIds.includes(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-sky-50/60' : 'hover:bg-slate-50/80'
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
                        <div className="w-11 h-11 relative bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="p-4 text-slate-900 font-semibold">{product.name}</td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                      <td className="p-4 text-slate-900 font-medium">Rs. {product.price}</td>
                      <td className="p-4 text-slate-500">{product.stock_quantity || 0}</td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublished(product.id, product.is_published)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                            product.is_published
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {product.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-[#00AEF0] hover:text-[#0090c8] hover:bg-sky-50 p-2 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
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
                    <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                      No products found.
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
    <Suspense fallback={<div className="p-6 text-slate-700 font-medium">Loading products...</div>}>
      <ProductsListContent />
    </Suspense>
  );
}
