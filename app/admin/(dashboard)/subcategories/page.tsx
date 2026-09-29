'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

import { DEFAULT_CATEGORIES } from '@/lib/cms/defaultCategories';
import { getStoredSubcategories, deleteStoredSubcategory } from '@/lib/cms/clientStorage';

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
}

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const defaultSubsList: Subcategory[] = [];
    DEFAULT_CATEGORIES.forEach((c) => {
      (c.subcategories || []).forEach((s) => {
        defaultSubsList.push({
          id: s.id,
          category_id: c.id,
          name: s.name,
          slug: s.slug,
          is_active: s.is_active !== false,
          sort_order: s.sort_order ?? 0,
        });
      });
    });

    const storedSubs = getStoredSubcategories();
    storedSubs.forEach((sub: any) => {
      const idx = defaultSubsList.findIndex((s) => s.id === sub.id);
      if (idx >= 0) defaultSubsList[idx] = { ...defaultSubsList[idx], ...sub };
      else defaultSubsList.push(sub);
    });

    const defaultCatsList: Category[] = DEFAULT_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    try {
      const [subRes, catRes] = await Promise.all([
        supabase.from('subcategories').select('*').order('sort_order'),
        supabase.from('categories').select('id, name')
      ]);

      if (subRes.data && subRes.data.length > 0) {
        const subIds = new Set(subRes.data.map((s: any) => s.id));
        setSubcategories([...subRes.data, ...defaultSubsList.filter((s) => !subIds.has(s.id))]);
      } else {
        setSubcategories(defaultSubsList);
      }

      if (catRes.data && catRes.data.length > 0) {
        const catIds = new Set(catRes.data.map((c: any) => c.id));
        setCategories([...catRes.data, ...defaultCatsList.filter((c) => !catIds.has(c.id))]);
      } else {
        setCategories(defaultCatsList);
      }
    } catch {
      setSubcategories(defaultSubsList);
      setCategories(defaultCatsList);
    }
    setLoading(false);
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const filteredSubcategories = subcategories.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(id: string, isActive: boolean) {
    const { error } = await supabase
      .from('subcategories')
      .update({ is_active: !isActive })
      .eq('id', id);

    setMessage('✅ Subcategory updated');
    loadData();
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteSubcategory(id: string) {
    if (!confirm('Delete this subcategory?')) return;
    deleteStoredSubcategory(id);
    await supabase.from('subcategories').delete().eq('id', id);
    setMessage('✅ Subcategory deleted');
    loadData();
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) {
    return <div className="p-6 text-slate-600 font-medium">Loading subcategories...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalogue</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Subcategories</h1>
            <p className="text-slate-500 text-sm mt-1">{filteredSubcategories.length} subcategories</p>
          </div>
          <Link
            href="/admin/subcategories/new"
            className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Subcategory
          </Link>
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
            placeholder="Search by name or slug..."
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
                  <th className="p-4">Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Order</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      No subcategories found.
                    </td>
                  </tr>
                ) : (
                  filteredSubcategories.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-slate-900 font-semibold">{sub.name}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#00AEF0] border border-sky-200">
                          {getCategoryName(sub.category_id)}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{sub.slug}</td>
                      <td className="p-4 text-slate-500">{sub.sort_order}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(sub.id, sub.is_active)}
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
                            onClick={() => deleteSubcategory(sub.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition cursor-pointer"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
