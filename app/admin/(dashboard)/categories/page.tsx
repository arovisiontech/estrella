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

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalog</p>
            <h1 className="text-4xl font-bold text-white mt-2">Categories</h1>
            <p className="text-zinc-400 mt-2">{categories.length} categories, {subcategories.length} subcategories</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/subcategories/new"
              className="flex items-center gap-2 bg-[#00AEF0]/20 hover:bg-[#00AEF0]/30 text-[#00AEF0] border border-[#00AEF0]/40 px-4 py-2 rounded text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" /> Add Subcategory
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] text-white px-4 py-2 rounded text-sm font-medium transition shadow"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Link>
          </div>
        </div>

        {message && <div className="mb-4 bg-green-900 text-green-100 p-3 rounded">{message}</div>}

        <div className="mb-6 flex items-center gap-4 bg-zinc-900 p-4 rounded">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="text-left p-4 text-zinc-400">Name</th>
                <th className="text-left p-4 text-zinc-400">Slug</th>
                <th className="text-left p-4 text-zinc-400">Type</th>
                <th className="text-left p-4 text-zinc-400">Sort</th>
                <th className="text-left p-4 text-zinc-400">Active</th>
                <th className="text-left p-4 text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-zinc-400">No categories found</td>
                </tr>
              ) : (
                filteredCategories.map(cat => {
                  const subs = subCategoriesByParent(cat.id);
                  const isExp = expanded.has(cat.id);
                  return (
                    <Fragment key={cat.id}>
                      <tr className="border-b border-zinc-800 hover:bg-zinc-900">
                        <td className="p-4 text-white flex items-center gap-2">
                          {subs.length > 0 && (
                            <button onClick={() => toggleExpanded(cat.id)} className="text-zinc-400">
                              {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                          {cat.name}
                        </td>
                        <td className="p-4 text-zinc-400">{cat.slug}</td>
                        <td className="p-4 text-zinc-400">Parent</td>
                        <td className="p-4 text-zinc-400">{cat.sort_order}</td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleActive(cat.id, cat.is_active, false)}
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              cat.is_active ? 'bg-green-900 text-green-100' : 'bg-yellow-900 text-yellow-100'
                            }`}
                          >
                            {cat.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-4 flex gap-2">
                          <Link href={`/admin/categories/${cat.id}/edit`} className="text-blue-400">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => deleteCategory(cat.id, cat.name, false)} className="text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      {isExp && subs.map(sub => (
                        <tr key={sub.id} className="border-b border-zinc-800 hover:bg-zinc-900 bg-zinc-950/50">
                          <td className="p-4 pl-12 text-zinc-300">{sub.name}</td>
                          <td className="p-4 text-zinc-400">{sub.slug}</td>
                          <td className="p-4 text-zinc-400 text-xs">Subcategory</td>
                          <td className="p-4 text-zinc-400">{sub.sort_order}</td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleActive(sub.id, sub.is_active, true)}
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                sub.is_active ? 'bg-green-900 text-green-100' : 'bg-yellow-900 text-yellow-100'
                              }`}
                            >
                              {sub.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="p-4 flex gap-2">
                            <Link href={`/admin/subcategories/${sub.id}/edit`} className="text-blue-400">
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteCategory(sub.id, sub.name, true)} className="text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
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
  );
}
