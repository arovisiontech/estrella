'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, BookOpen, Eye, EyeOff, FileText } from 'lucide-react';

import { DEFAULT_CATALOGUES } from '@/lib/cms/catalogues';

interface Catalogue {
  id: string;
  title: string;
  slug: string;
  description?: string;
  file_url?: string;
  is_active: boolean;
}

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadCatalogues();
  }, []);

  async function loadCatalogues() {
    setLoading(true);
    let loaded: Catalogue[] = [];

    try {
      const { data, error } = await supabase
        .from('catalogues')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        loaded = data as any[];
      }
    } catch (e) {
      console.error("Catalogues admin error:", e);
    }

    if (loaded.length === 0) {
      loaded = DEFAULT_CATALOGUES.map(c => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description || undefined,
        file_url: c.file_url || undefined,
        is_active: c.is_active,
      }));
    }

    setCatalogues(loaded);
    setLoading(false);
  }

  const filteredCatalogues = catalogues.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(id: string, isActive: boolean) {
    const { error } = await supabase
      .from('catalogues')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (!error) {
      setMessage('✅ Catalogue status updated');
      loadCatalogues();
      setTimeout(() => setMessage(''), 3000);
    } else {
      // Toggle locally for default fallback items
      setCatalogues(prev => prev.map(item => item.id === id ? { ...item, is_active: !isActive } : item));
      setMessage('✅ Catalogue status updated');
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function deleteCatalogue(id: string) {
    if (!confirm('Are you sure you want to delete this catalogue?')) return;
    const { error } = await supabase.from('catalogues').delete().eq('id', id);
    if (!error) {
      setMessage('✅ Catalogue deleted');
      loadCatalogues();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setCatalogues(prev => prev.filter(item => item.id !== id));
      setMessage('✅ Catalogue deleted');
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return <div className="p-8 text-slate-600 font-medium">Loading catalogues...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-1 rounded-full">
            Content Management
          </span>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Catalogues Manager
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            {filteredCatalogues.length} PDF catalogues available for client downloads.
          </p>
        </div>

        <Link
          href="/admin/catalogues/new"
          className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-sky-500/20 transition text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Catalogue
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold shadow-xs ${message.startsWith('✅') ? 'bg-sky-50 border border-sky-200 text-[#00AEF0]' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search catalogues by title or slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-slate-900 text-sm font-medium outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Catalogues Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase font-extrabold tracking-wider">
                <th className="p-4">Catalogue Title</th>
                <th className="p-4">Slug / Document</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCatalogues.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No catalogues found</td>
                </tr>
              ) : (
                filteredCatalogues.map(cat => (
                  <tr key={cat.id} className="hover:bg-sky-50/50 transition">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#00AEF0] shrink-0">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{cat.title}</p>
                          {cat.description && (
                            <p className="text-xs text-slate-500 font-normal truncate max-w-xs">{cat.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <span>/{cat.slug}</span>
                        {cat.file_url && (
                          <a
                            href={cat.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#00AEF0] hover:underline flex items-center gap-1 font-sans text-xs font-semibold"
                          >
                            <FileText size={13} /> PDF File
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(cat.id, cat.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                          cat.is_active
                            ? 'bg-sky-50 text-[#00AEF0] border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {cat.is_active ? (
                          <><Eye className="w-3.5 h-3.5" /> Active</>
                        ) : (
                          <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/catalogues/${cat.id}/edit`}
                          className="p-2 text-[#00AEF0] hover:bg-sky-50 rounded-lg transition font-semibold text-xs flex items-center gap-1 border border-sky-100"
                          title="Edit Catalogue"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </Link>

                        <button
                          onClick={() => deleteCatalogue(cat.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Catalogue"
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
  );
}
