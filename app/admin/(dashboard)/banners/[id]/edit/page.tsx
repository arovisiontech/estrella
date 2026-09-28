'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  slug: string;
  image_url?: string;
  content?: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
}

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;
  const supabase = createClient();

  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadBanner() {
      setLoading(true);
      const { data } = await supabase.from('banners').select('*').eq('id', bannerId).single();
      if (data) setBanner(data);
      setLoading(false);
    }
    loadBanner();
  }, [bannerId]);

  const handleInputChange = (field: keyof Banner, value: any) => {
    if (banner) {
      setBanner({ ...banner, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!banner) return;
    if (!banner.title) {
      setMessage('❌ Title is required');
      return;
    }
    if (!banner.slug) {
      setMessage('❌ Slug is required');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('banners').update(banner).eq('id', banner.id);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Banner saved successfully');
      setTimeout(() => router.push('/admin/banners'), 1500);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!banner || !confirm('Delete this banner?')) return;
    setSaving(true);
    const { error } = await supabase.from('banners').delete().eq('id', banner.id);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Banner deleted');
      setTimeout(() => router.push('/admin/banners'), 1500);
    }
    setSaving(false);
  };

  if (loading || !banner) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/banners" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Banners
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">{banner.title}</h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title *</label>
              <input
                type="text"
                value={banner.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Slug *</label>
              <input
                type="text"
                value={banner.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
              <input
                type="text"
                value={banner.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Content (Optional)</label>
              <textarea
                value={banner.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Link URL</label>
              <input
                type="text"
                value={banner.link_url}
                onChange={(e) => handleInputChange('link_url', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Sort Order</label>
              <input
                type="number"
                value={banner.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={banner.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
            />
            Active
          </label>

          <div className="flex gap-4 pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Banner'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:bg-gray-600 text-white px-6 py-2 rounded"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
