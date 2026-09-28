'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

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
    const [subRes, catRes] = await Promise.all([
      supabase.from('subcategories').select('*').order('sort_order'),
      supabase.from('categories').select('id, name')
    ]);

    if (subRes.data) setSubcategories(subRes.data);
    if (catRes.data) setCategories(catRes.data);
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

    if (!error) {
      setMessage('✅ Subcategory updated');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function deleteSubcategory(id: string) {
    if (!confirm('Delete this subcategory?')) return;
    const { error } = await supabase.from('subcategories').delete().eq('id', id);
    if (!error) {
      setMessage('✅ Subcategory deleted');
      loadData();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase">Catalogue</p>
            <h1 className="text-4xl font-bold text-white mt-2">Subcategories</h1>
            <p className="text-zinc-400 mt-2">{filteredSubcategories.length} subcategories</p>
          </div>
          <Link
            href="/admin/subcategories/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Add Subcategory
          </Link>
        </div>

        {message && (
          <div className="mb-4 bg-green-900 text-green-100 p-3 rounded">
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-4 bg-zinc-900 p-4 rounded">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="text-left p-4 text-zinc-400">Name</th>
                  <th className="text-left p-4 text-zinc-400">Category</th>
                  <th className="text-left p-4 text-zinc-400">Slug</th>
                  <th className="text-left p-4 text-zinc-400">Order</th>
                  <th className="text-left p-4 text-zinc-400">Status</th>
                  <th className="text-left p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-zinc-400">No subcategories found</td>
                  </tr>
                ) : (
                  filteredSubcategories.map(sub => (
                    <tr key={sub.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                      <td className="p-4 text-white">{sub.name}</td>
                      <td className="p-4 text-zinc-400">{getCategoryName(sub.category_id)}</td>
                      <td className="p-4 text-zinc-400">{sub.slug}</td>
                      <td className="p-4 text-zinc-400">{sub.sort_order}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(sub.id, sub.is_active)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            sub.is_active
                              ? 'bg-green-900 text-green-100'
                              : 'bg-yellow-900 text-yellow-100'
                          }`}
                        >
                          {sub.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 flex gap-2">
                        <Link
                          href={`/admin/subcategories/${sub.id}/edit`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteSubcategory(sub.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
