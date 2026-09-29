'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateCategory, deleteCategory, type CategoryInput } from '@/lib/actions/admin/categories';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CategoryRecord extends CategoryInput {
  id: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const supabase = createClient();

  const [category, setCategory] = useState<CategoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data } = await supabase.from('categories').select('*').eq('id', categoryId).single();
      if (data) {
        setCategory({
          id: data.id,
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          image_url: data.image_url || '',
          hover_image_url: data.hover_image_url || '',
          banner_url: data.banner_url || '',
          is_featured: data.is_featured ?? false,
          is_active: data.is_active ?? true,
          sort_order: data.sort_order ?? 0,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
        });
      }
      setLoading(false);
    }
    loadData();
  }, [categoryId]);

  const handleInputChange = (field: keyof CategoryInput, value: any) => {
    if (category) {
      setCategory({ ...category, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image_url' | 'hover_image_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (!file || !category) return;

    setUploadingField(fieldName);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'categories');
      formData.append('folder', fieldName === 'banner_url' ? 'banners' : 'tiles');

      const res = await uploadAdminFile(formData);
      if (res.success && res.data) {
        setCategory((prev) => (prev ? { ...prev, [fieldName]: res.data!.url } : null));
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
    if (!category) return;

    if (!category.name.trim()) {
      setMessage('❌ Category name is required');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const result = await updateCategory(category.id, {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.image_url,
        hover_image_url: category.hover_image_url,
        banner_url: category.banner_url,
        is_featured: category.is_featured,
        is_active: category.is_active,
        sort_order: Number(category.sort_order) || 0,
        meta_title: category.meta_title,
        meta_description: category.meta_description,
      });

      if (result.success) {
        setMessage('✅ Category saved successfully!');
        setTimeout(() => router.push('/admin/categories'), 1200);
      } else {
        setMessage(`❌ ${result.message || 'Failed to save category'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!category || !confirm('Delete this category? Products linked to this category may be affected.')) return;
    setSaving(true);
    try {
      const result = await deleteCategory(category.id);
      if (result.success) {
        setMessage('✅ Category deleted');
        setTimeout(() => router.push('/admin/categories'), 1200);
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !category) {
    return <div className="p-6 text-slate-600 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin text-[#00AEF0]" /> Loading category details...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/categories" className="text-[#00AEF0] hover:text-[#0090c8] flex items-center gap-2 mb-6 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Catalogue Management</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{category.name || 'Edit Category'}</h1>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition shadow-xs"
          >
            <Trash2 className="w-4 h-4" /> Delete Category
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Category Name *</label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Slug *</label>
                <input
                  type="text"
                  value={category.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Description</label>
                <textarea
                  value={category.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Category description..."
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={category.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Image & Banner Uploads */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00AEF0]" /> Category Images & Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Primary Tile Image */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase">Primary Category Image</label>
                <p className="text-[11px] text-slate-500">Main image shown on homepage tiles & category listings</p>

                {category.image_url ? (
                  <div className="relative aspect-video w-full rounded-lg bg-white border border-slate-200 overflow-hidden group">
                    <Image src={category.image_url} alt="Primary" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image_url', '')}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg bg-white border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                    No image uploaded
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.image_url || ''}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#00AEF0]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition shrink-0">
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
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase">Hover Image (Optional)</label>
                <p className="text-[11px] text-slate-500">Secondary image shown on card hover state</p>

                {category.hover_image_url ? (
                  <div className="relative aspect-video w-full rounded-lg bg-white border border-slate-200 overflow-hidden group">
                    <Image src={category.hover_image_url} alt="Hover" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('hover_image_url', '')}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg bg-white border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                    No hover image uploaded
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.hover_image_url || ''}
                    onChange={(e) => handleInputChange('hover_image_url', e.target.value)}
                    placeholder="Hover Image URL"
                    className="flex-1 bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#00AEF0]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition shrink-0">
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
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase">Category Header Banner Image</label>
                <p className="text-[11px] text-slate-500">Wide banner image displayed at top of category page (/categories/[slug])</p>

                {category.banner_url ? (
                  <div className="relative aspect-[3/1] w-full rounded-lg bg-white border border-slate-200 overflow-hidden group">
                    <Image src={category.banner_url} alt="Banner" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('banner_url', '')}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-28 rounded-lg bg-white border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                    No banner uploaded (default site banner will be used)
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.banner_url || ''}
                    onChange={(e) => handleInputChange('banner_url', e.target.value)}
                    placeholder="Banner Image URL"
                    className="flex-1 bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#00AEF0]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition shrink-0">
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Status & Visibility</h2>

            <div className="flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={category.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 accent-[#00AEF0] rounded"
                />
                Active (Visible on Public Website & Menus)
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={category.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="w-4 h-4 accent-[#00AEF0] rounded"
                />
                Featured Category
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/categories"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || !!uploadingField}
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] disabled:bg-slate-300 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
