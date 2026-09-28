'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, type CategoryInput } from '@/lib/actions/admin/categories';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

const defaultCategory: CategoryInput = {
  name: '',
  slug: '',
  description: '',
  image_url: '',
  hover_image_url: '',
  banner_url: '',
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

export default function NewCategoryPage() {
  const router = useRouter();

  const [category, setCategory] = useState<CategoryInput>(defaultCategory);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleNameChange = (name: string) => {
    const generatedSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setCategory((prev) => {
      const prevGenerated = prev.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const shouldUpdateSlug = !prev.slug || prev.slug === prevGenerated;
      return {
        ...prev,
        name,
        slug: shouldUpdateSlug ? generatedSlug : prev.slug,
      };
    });
  };

  const handleInputChange = (field: keyof CategoryInput, value: any) => {
    setCategory((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image_url' | 'hover_image_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'categories');
      formData.append('folder', fieldName === 'banner_url' ? 'banners' : 'tiles');

      const res = await uploadAdminFile(formData);
      if (res.success && res.data) {
        setCategory((prev) => ({ ...prev, [fieldName]: res.data!.url }));
        setMessage(`✅ Image uploaded successfully for ${fieldName.replace('_', ' ')}.`);
      } else {
        setMessage(`❌ Upload failed: ${res.message || 'Error uploading file'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Upload error: ${err.message}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.name.trim()) {
      setMessage('❌ Category name is required');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const result = await createCategory(category);
      if (result.success) {
        setMessage('✅ Category created successfully!');
        setTimeout(() => router.push('/admin/categories'), 1200);
      } else {
        setMessage(`❌ ${result.message || 'Failed to create category'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/categories" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Category Management</p>
          <h1 className="text-3xl font-bold text-white mt-1">Create Category</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-sm ${message.includes('✅') ? 'bg-green-950 text-green-200 border border-green-800' : 'bg-red-950 text-red-200 border border-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Details */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Category Name *</label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Leather Suits"
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Slug *</label>
                <input
                  type="text"
                  value={category.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="leather-suits"
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
                <textarea
                  value={category.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Category description..."
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={category.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Image & Banner Uploads */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-500" /> Category Images & Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Primary Tile Image */}
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-red-400 uppercase">Primary Category Image</label>
                <p className="text-[11px] text-zinc-400">Main image shown on homepage tiles & category listings</p>

                {category.image_url ? (
                  <div className="relative aspect-video w-full rounded bg-zinc-900 border border-zinc-800 overflow-hidden group">
                    <Image src={category.image_url} alt="Primary" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image_url', '')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    No image uploaded
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.image_url || ''}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 bg-zinc-900 text-white px-3 py-1.5 rounded border border-zinc-700 text-xs outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded cursor-pointer transition shrink-0">
                    {uploadingField === 'image_url' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadingField === 'image_url' ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image_url')}
                      disabled={!!uploadingField}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Category Hover Image */}
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-red-400 uppercase">Hover Image (Optional)</label>
                <p className="text-[11px] text-zinc-400">Secondary image shown on card hover state</p>

                {category.hover_image_url ? (
                  <div className="relative aspect-video w-full rounded bg-zinc-900 border border-zinc-800 overflow-hidden group">
                    <Image src={category.hover_image_url} alt="Hover" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('hover_image_url', '')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    No hover image uploaded
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.hover_image_url || ''}
                    onChange={(e) => handleInputChange('hover_image_url', e.target.value)}
                    placeholder="Hover Image URL"
                    className="flex-1 bg-zinc-900 text-white px-3 py-1.5 rounded border border-zinc-700 text-xs outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded cursor-pointer transition shrink-0">
                    {uploadingField === 'hover_image_url' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadingField === 'hover_image_url' ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hover_image_url')}
                      disabled={!!uploadingField}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Category Page Banner Header Image */}
              <div className="md:col-span-2 bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-red-400 uppercase">Category Header Banner Image</label>
                <p className="text-[11px] text-zinc-400">Wide banner image displayed at top of category page (/categories/[slug])</p>

                {category.banner_url ? (
                  <div className="relative aspect-[3/1] w-full rounded bg-zinc-900 border border-zinc-800 overflow-hidden group">
                    <Image src={category.banner_url} alt="Banner" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('banner_url', '')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-28 rounded bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    No banner uploaded (default site banner will be used)
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.banner_url || ''}
                    onChange={(e) => handleInputChange('banner_url', e.target.value)}
                    placeholder="Banner Image URL"
                    className="flex-1 bg-zinc-900 text-white px-3 py-1.5 rounded border border-zinc-700 text-xs outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded cursor-pointer transition shrink-0">
                    {uploadingField === 'banner_url' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadingField === 'banner_url' ? 'Uploading...' : 'Upload Banner'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'banner_url')}
                      disabled={!!uploadingField}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Options */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Status & Visibility</h2>

            <div className="flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={category.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                Active (Visible on Public Website & Menus)
              </label>

              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={category.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                Featured Category
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/categories"
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold rounded transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !!uploadingField}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white text-sm font-semibold px-8 py-2.5 rounded transition"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
