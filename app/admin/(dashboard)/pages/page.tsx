'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setPagePublished, deletePage } from '@/lib/actions/admin/pages';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, ExternalLink, Globe } from 'lucide-react';

interface PageItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  is_published: boolean;
  edit_url?: string;
}

const DEFAULT_WEBSITE_PAGES: PageItem[] = [
  { id: 'p-home', title: 'Home Page', slug: '', description: 'Main landing page featuring hero banners, products, and departments.', is_published: true, edit_url: '/admin/banners' },
  { id: 'p-about', title: 'About Us Page', slug: 'about', description: 'Company overview, mission, honeycomb gallery, and values.', is_published: true, edit_url: '/admin/about' },
  { id: 'p-contact', title: 'Contact Us Page', slug: 'contact', description: 'Contact form, location details, phone, email, and Google map.', is_published: true, edit_url: '/admin/contact-page' },
  { id: 'p-sportswear', title: 'Sportswears Category', slug: 'categories/sportswear', description: 'Sublimation sports apparel and customized team wear.', is_published: true, edit_url: '/admin/products?category=sportswear' },
  { id: 'p-boxing', title: 'Boxing Equipment', slug: 'categories/boxing-equipment', description: 'Boxing gloves, training gear, and combat equipment.', is_published: true, edit_url: '/admin/products?category=boxing-equipment' },
  { id: 'p-soccer', title: 'Soccer Footballs', slug: 'categories/soccer-footballs', description: 'Thermo-bonded and hand-stitched match footballs.', is_published: true, edit_url: '/admin/products?category=soccer-footballs' },
  { id: 'p-departments', title: 'Manufacturing Departments', slug: 'departments', description: 'Production facilities, stitching, cutting, and quality control.', is_published: true, edit_url: '/admin/departments' },
  { id: 'p-[#00AEF0]', title: 'PDF Catalogues', slug: 'catalogue', description: 'Downloadable product PDF catalogues and brochures.', is_published: true, edit_url: '/admin/catalogues' },
  { id: 'p-events', title: 'Events Showcase', slug: 'events', description: 'Upcoming international exhibitions and trade shows.', is_published: true, edit_url: '/admin/events' },
  { id: 'p-quality', title: 'Quality Assurance', slug: 'quality', description: 'Quality control procedures and ISO certifications.', is_published: true },
  { id: 'p-compliance', title: 'Compliance & Standards', slug: 'compliance', description: 'Labor laws, ILO conventions, and environmental standards.', is_published: true },
  { id: 'p-csr', title: 'Corporate Responsibility', slug: 'csr', description: 'Community development, sustainability, and worker welfare.', is_published: true },
  { id: 'p-history', title: 'Company History', slug: 'history', description: 'Estrella International journey and manufacturing history.', is_published: true },
];

export default function PagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        // Merge custom db pages with default list
        const dbPages: PageItem[] = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          description: d.description || '',
          is_published: Boolean(d.is_published),
          edit_url: `/admin/pages/${d.id}/edit`,
        }));
        
        // Remove duplicates if slug exists
        const existingSlugs = new Set(dbPages.map(p => p.slug));
        const customDefaults = DEFAULT_WEBSITE_PAGES.filter(p => !existingSlugs.has(p.slug));
        setPages([...dbPages, ...customDefaults]);
      } else {
        setPages(DEFAULT_WEBSITE_PAGES);
      }
    } catch {
      setPages(DEFAULT_WEBSITE_PAGES);
    }
    setLoading(false);
  }

  const filteredPages = pages.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  async function togglePublished(id: string, isPublished: boolean) {
    if (id.startsWith('p-')) {
      // Toggle in local memory
      setPages(prev => prev.map(p => p.id === id ? { ...p, is_published: !isPublished } : p));
      setMessage(`✅ Updated status for default page.`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const result = await setPagePublished(id, !isPublished);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadPages();
    setTimeout(() => setMessage(''), 3000);
  }

  async function removePage(id: string) {
    if (id.startsWith('p-')) {
      if (!confirm('Hide this default page from view?')) return;
      setPages(prev => prev.filter(p => p.id !== id));
      setMessage('✅ Page hidden.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    if (!confirm('Delete this custom page? This cannot be undone.')) return;
    const result = await deletePage(id);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadPages();
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) {
    return <div className="p-8 text-slate-600 font-medium">Loading pages...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-1 rounded-full">
            Content Management
          </span>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Website Pages Manager
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            {filteredPages.length} active pages in your Estrella website catalogue.
          </p>
        </div>

        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-sky-500/20 transition text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Custom Page
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
          placeholder="Search by title, slug, or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-slate-900 text-sm font-medium outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs uppercase font-extrabold tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">URL Path</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No matching pages found</td>
                </tr>
              ) : (
                filteredPages.map(page => (
                  <tr key={page.id} className="hover:bg-sky-50/50 transition">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-[#00AEF0]" />
                        <span>{page.title}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      /{page.slug}
                    </td>
                    <td className="p-4 text-slate-600 text-xs truncate max-w-xs">
                      {page.description || '-'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublished(page.id, page.is_published)}
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                          page.is_published
                            ? 'bg-sky-50 text-[#00AEF0] border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {page.is_published ? (
                          <><Eye className="w-3.5 h-3.5" /> Published</>
                        ) : (
                          <><EyeOff className="w-3.5 h-3.5" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-[#00AEF0] hover:bg-slate-100 rounded-lg transition"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          href={page.edit_url || `/admin/pages/${page.id}/edit`}
                          className="p-2 text-[#00AEF0] hover:bg-sky-50 rounded-lg transition font-semibold text-xs flex items-center gap-1 border border-sky-100"
                          title="Edit CMS Content"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit CMS
                        </Link>

                        <button
                          onClick={() => removePage(page.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove Page"
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

