'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setHomeSectionVisible, swapHomeSectionOrder, deleteHomeSection } from '@/lib/actions/admin/home-sections';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Layers } from 'lucide-react';

interface HomeSection {
  id: string;
  section_key: string;
  title: string;
  component_type: string;
  content?: any;
  image_url?: string;
  is_visible: boolean;
  sort_order: number;
}

export default function HomeSectionsPage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        setSections([]);
      } else if (data) {
        setSections(data);
      }
    } catch (err) {
      setSections([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisible(id: string, isVisible: boolean) {
    const previous = sections;
    setSavingId(id);
    setSections(sections.map((s) => (s.id === id ? { ...s, is_visible: !isVisible } : s)));

    const result = await setHomeSectionVisible(id, !isVisible);
    setSavingId(null);

    if (!result.success) {
      setSections(previous);
      setMessage(`❌ ${result.message}`);
    } else {
      setMessage(`✅ ${result.message}`);
    }
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteSection(id: string) {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    const result = await deleteHomeSection(id);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadSections();
    setTimeout(() => setMessage(''), 3000);
  }

  async function moveSection(id: string, direction: 'up' | 'down') {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const a = sections[idx];
    const b = sections[newIdx];

    setSavingId(id);
    const result = await swapHomeSectionOrder(a.id, a.sort_order, b.id, b.sort_order);
    setSavingId(null);

    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadSections();
    setTimeout(() => setMessage(''), 3000);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full">
            Content Sections
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Homepage Sections</h1>
          <p className="text-slate-500 text-sm mt-1">{sections.length} layout sections</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/banners"
            className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm transition"
          >
            <Layers className="w-4 h-4" /> Manage Hero Banners
          </Link>
          <Link
            href="/admin/home-sections/new"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg font-semibold transition"
          >
            <Plus className="w-4 h-4" /> Add Section
          </Link>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg border text-sm font-medium ${message.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          {message}
        </div>
      )}

      <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left p-4 text-slate-600 font-bold uppercase text-xs">Title</th>
                <th className="text-left p-4 text-slate-600 font-bold uppercase text-xs">Type</th>
                <th className="text-left p-4 text-slate-600 font-bold uppercase text-xs">Key</th>
                <th className="text-left p-4 text-slate-600 font-bold uppercase text-xs">Status</th>
                <th className="text-left p-4 text-slate-600 font-bold uppercase text-xs">Order</th>
                <th className="text-left p-4 text-slate-600 font-bold uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No home sections found. You can manage your Hero Slider banners in the <Link href="/admin/banners" className="text-[#00AEF0] underline font-semibold">Hero Banners Manager</Link>.
                  </td>
                </tr>
              ) : (
                sections.map((section, idx) => (
                  <tr key={section.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 font-semibold text-slate-900">{section.title}</td>
                    <td className="p-4 text-slate-500 text-xs">{section.component_type || '-'}</td>
                    <td className="p-4 text-slate-500 text-xs font-mono">{section.section_key || '-'}</td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => toggleVisible(section.id, section.is_visible)}
                        disabled={savingId === section.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          section.is_visible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {section.is_visible ? (
                          <><Eye className="w-3.5 h-3.5" /> Visible</>
                        ) : (
                          <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">#{section.sort_order}</td>
                    <td className="p-4 flex gap-2">
                      <Link
                        href={`/admin/home-sections/${section.id}/edit`}
                        className="text-sky-600 hover:text-sky-700 p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={idx === 0}
                        className="text-slate-400 hover:text-slate-700 disabled:opacity-30 p-1"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={idx === sections.length - 1}
                        className="text-slate-400 hover:text-slate-700 disabled:opacity-30 p-1"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="text-rose-600 hover:text-rose-700 p-1"
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
  );
}
