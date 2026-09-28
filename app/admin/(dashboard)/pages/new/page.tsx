'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPage } from '@/lib/actions/admin/pages';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface Page {
  title: string;
  slug: string;
  description?: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  sort_order: number;
}

const defaultPage: Page = {
  title: '',
  slug: '',
  description: '',
  featured_image_url: '',
  meta_title: '',
  meta_description: '',
  is_published: false,
  sort_order: 0,
};

export default function NewPagePage() {
  const router = useRouter();
  const [page, setPage] = useState<Page>(defaultPage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field: keyof Page, value: any) => {
    setPage({ ...page, [field]: value });
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
    if (!page.slug || page.slug === generateSlug(page.title)) {
      handleInputChange('slug', generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!page.title) {
      setMessage('❌ Title is required');
      return;
    }
    if (!page.slug) {
      setMessage('❌ Slug is required');
      return;
    }

    setSaving(true);
    const result = await createPage(page);

    if (result.success) {
      setMessage('✅ Page created successfully');
      setTimeout(() => router.push('/admin/pages'), 1500);
    } else {
      setMessage(`❌ ${result.message}`);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/pages" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Pages
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">Create Page</h1>
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
                value={page.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Slug *</label>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <textarea
              value={page.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Featured Image URL</label>
            <input
              type="text"
              value={page.featured_image_url}
              onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
              className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              placeholder="/images/page-hero.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">SEO Title</label>
              <input
                type="text"
                value={page.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="Title for search engines"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">SEO Description</label>
              <input
                type="text"
                value={page.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="Description for search engines"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={page.is_published}
                  onChange={(e) => handleInputChange('is_published', e.target.checked)}
                  className="w-4 h-4 bg-zinc-900 border border-zinc-700 rounded"
                />
                Published
              </label>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Sort Order</label>
              <input
                type="number"
                value={page.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
