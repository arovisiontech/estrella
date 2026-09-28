'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface Banner {
  title: string;
  slug: string;
  image_url?: string;
  content?: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
}

const defaultBanner: Banner = {
  title: '',
  slug: '',
  image_url: '',
  content: '',
  link_url: '',
  is_active: true,
  sort_order: 0,
};

export default function NewBannerPage() {
  const router = useRouter();
  const supabase = createClient();
  const [banner, setBanner] = useState<Banner>(defaultBanner);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field: keyof Banner, value: any) => {
    setBanner({ ...banner, [field]: value });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (value: string) => {
    handleInputChange('title', value);
    if (!banner.slug || banner.slug === generateSlug(banner.title)) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!banner.title) {
      setMessage('❌ Title is required');
      return;
    }
    if (!banner.slug) {
      setMessage('❌ Slug is required');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('banners').insert([banner]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Banner created successfully');
      setTimeout(() => router.push('/admin/banners'), 1500);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/banners" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Banners
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">Create Banner</h1>
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
                onChange={(e) => handleTitleChange(e.target.value)}
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
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
              <input
                type="text"
                value={banner.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="/images/banner-1.jpg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Content (Optional)</label>
              <textarea
                value={banner.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="Banner content or description"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Link URL</label>
              <input
                type="text"
                value={banner.link_url}
                onChange={(e) => handleInputChange('link_url', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="/products or https://example.com"
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
              <Save className="w-4 h-4" /> {saving ? 'Creating...' : 'Create Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
