'use client';

import { useState, useEffect, Fragment } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, ChevronDown, ChevronRight } from 'lucide-react';

import { DEFAULT_CATEGORIES } from '@/lib/cms/defaultCategories';

interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

interface Subcategory extends Category {
  category_id: string;
  category_name?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    let fetchedCats: any[] = [];
    let fetchedSubcats: any[] = [];

    const defaultCatsList = DEFAULT_CATEGORIES.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      is_active: c.is_active,
      sort_order: c.sort_order,
    }));

    const defaultSubsList: any[] = [];
    DEFAULT_CATEGORIES.forEach(c => {
      (c.subcategories || []).forEach(sub => {
        defaultSubsList.push({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          category_id: c.id,
          category_name: c.name,
          is_active: sub.is_active,
          sort_order: sub.sort_order,
        });
      });
    });

    try {
      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('subcategories').select('*').order('sort_order')
      ]);

      if (catsRes.data && catsRes.data.length > 0) {
        const catIds = new Set(catsRes.data.map(c => c.id));
        fetchedCats = [...catsRes.data, ...defaultCatsList.filter(d => !catIds.has(d.id))];
      } else {
        fetchedCats = defaultCatsList;
      }

      if (subcatsRes.data && subcatsRes.data.length > 0) {
        const subIds = new Set(subcatsRes.data.map(s => s.id));
        fetchedSubcats = [...subcatsRes.data, ...defaultSubsList.filter(s => !subIds.has(s.id))];
      } else {
        fetchedSubcats = defaultSubsList;
      }
    } catch (e) {
      console.error("Categories admin fetch error:", e);
      fetchedCats = defaultCatsList;
      fetchedSubcats = defaultSubsList;
    }

    fetchedSubcats = fetchedSubcats.map((s) => {
      const parentCat = fetchedCats.find((c: any) => c.id === s.category_id);
      return { ...s, category_name: parentCat?.name || s.category_name };
    });

    setCategories(fetchedCats);
    setSubcategories(fetchedSubcats);
    setLoading(false);
  }

  const toggleExpanded = (catId: string) => {
    const newExpanded = new Set(expanded);
    newExpanded.has(catId) ? newExpanded.delete(catId) : newExpanded.add(catId);
    setExpanded(newExpanded);
  };

  async function toggleActive(id: string, isActive: boolean, isSubcat: boolean) {
    const table = isSubcat ? 'subcategories' : 'categories';
    const { error } = await supabase.from(table).update({ is_active: !isActive }).eq('id', id);
    if (!error) {
      setMessage('✅ Updated');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function deleteCategory(id: string, name: string, isSubcat: boolean) {
    if (!confirm(`Delete ${name}?`)) return;
    const table = isSubcat ? 'subcategories' : 'categories';
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      setMessage('✅ Deleted');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  const subCategoriesByParent = (parentId: string) =>
    subcategories.filter(s => s.category_id === parentId);

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6 text-slate-600 font-medium">Loading categories...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalogue</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Categories</h1>
            <p className="text-slate-500 text-sm mt-1">{categories.length} categories, {subcategories.length} subcategories</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/subcategories/new"
              className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-[#00AEF0] border border-sky-200 px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Subcategory
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Link>
          </div>
        </div>

        {message && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-lg text-sm font-medium">
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-400 text-sm"
          />
        </div>

        <div className="border border-slate-200 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Sort</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map(cat => {
                    const subs = subCategoriesByParent(cat.id);
                    const isExp = expanded.has(cat.id);
                    return (
                      <Fragment key={cat.id}>
                        <tr className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 text-slate-900 font-semibold flex items-center gap-2">
                            {subs.length > 0 && (
                              <button
                                onClick={() => toggleExpanded(cat.id)}
                                className="text-slate-400 hover:text-[#00AEF0] transition-colors p-0.5 rounded cursor-pointer"
                                title={isExp ? "Collapse subcategories" : "Expand subcategories"}
                              >
                                {isExp ? <ChevronDown className="w-4 h-4 text-[#00AEF0]" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            )}
                            {cat.name}
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#00AEF0] border border-sky-200">
                              Parent
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">{cat.sort_order}</td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleActive(cat.id, cat.is_active, false)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs cursor-pointer ${
                                cat.is_active
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {cat.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/categories/${cat.id}/edit`}
                                className="text-[#00AEF0] hover:text-[#0090c8] hover:bg-sky-50 p-2 rounded-lg transition"
                                title="Edit Category"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => deleteCategory(cat.id, cat.name, false)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExp && subs.map(sub => (
                          <tr key={sub.id} className="bg-sky-50/30 hover:bg-sky-50/60 transition-colors border-l-4 border-l-[#00AEF0]">
                            <td className="p-4 pl-12 text-slate-800 font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00AEF0]" />
                              {sub.name}
                            </td>
                            <td className="p-4 text-slate-500 font-mono text-xs">{sub.slug}</td>
                            <td className="p-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                Subcategory
                              </span>
                            </td>
                            <td className="p-4 text-slate-500">{sub.sort_order}</td>
                            <td className="p-4">
                              <button
                                onClick={() => toggleActive(sub.id, sub.is_active, true)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs cursor-pointer ${
                                  sub.is_active
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {sub.is_active ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/subcategories/${sub.id}/edit`}
                                  className="text-[#00AEF0] hover:text-[#0090c8] hover:bg-sky-50 p-2 rounded-lg transition"
                                  title="Edit Subcategory"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => deleteCategory(sub.id, sub.name, true)}
                                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer"
                                  title="Delete Subcategory"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
