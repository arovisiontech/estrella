'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateSubcategory, deleteSubcategory, type SubcategoryInput } from '@/lib/actions/admin/subcategories';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface SubcategoryRecord extends SubcategoryInput {
  id: string;
}

interface Category {
  id: string;
  name: string;
}

export default function EditSubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const subcategoryId = params.id as string;
  const supabase = createClient();

  const [subcategory, setSubcategory] = useState<SubcategoryRecord | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [subcatRes, catsRes] = await Promise.all([
        supabase.from('subcategories').select('*').eq('id', subcategoryId).single(),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ]);

      if (subcatRes.data) {
        setSubcategory({
          id: subcatRes.data.id,
          category_id: subcatRes.data.category_id || '',
          name: subcatRes.data.name || '',
          slug: subcatRes.data.slug || '',
          description: subcatRes.data.description || '',
          image_url: subcatRes.data.image_url || '',
          banner_url: subcatRes.data.banner_url || '',
          is_featured: subcatRes.data.is_featured ?? false,
          is_active: subcatRes.data.is_active ?? true,
          sort_order: subcatRes.data.sort_order ?? 0,
          meta_title: subcatRes.data.meta_title || '',
          meta_description: subcatRes.data.meta_description || '',
        });
      }
      if (catsRes.data) setCategories(catsRes.data);
      setLoading(false);
    }
    loadData();
  }, [subcategoryId]);

  const handleInputChange = (field: keyof SubcategoryInput, value: any) => {
    if (subcategory) {
      setSubcategory({ ...subcategory, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image_url' | 'banner_url') => {
    const file = e.target.files?.[0];
    if (!file || !subcategory) return;

    setUploadingField(fieldName);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'categories');
      formData.append('folder', 'subcategories');

      const res = await uploadAdminFile(formData);
      if (res.success && res.data) {
        setSubcategory((prev) => (prev ? { ...prev, [fieldName]: res.data!.url } : null));
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
    if (!subcategory) return;

    if (!subcategory.category_id) {
      setMessage('❌ Parent category is required');
      return;
    }
    if (!subcategory.name.trim()) {
      setMessage('❌ Subcategory name is required');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const result = await updateSubcategory(subcategory.id, {
        category_id: subcategory.category_id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description,
        image_url: subcategory.image_url,
        banner_url: subcategory.banner_url,
        is_featured: subcategory.is_featured,
        is_active: subcategory.is_active,
        sort_order: Number(subcategory.sort_order) || 0,
        meta_title: subcategory.meta_title,
        meta_description: subcategory.meta_description,
      });

      if (result.success) {
        setMessage('✅ Subcategory saved successfully!');
        setTimeout(() => router.push('/admin/categories'), 1200);
      } else {
        setMessage(`❌ ${result.message || 'Failed to save subcategory'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!subcategory || !confirm('Delete this subcategory?')) return;
    setSaving(true);
    try {
      const result = await deleteSubcategory(subcategory.id);
      if (result.success) {
        setMessage('✅ Subcategory deleted');
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

  if (loading || !subcategory) {
    return <div className="p-6 text-white flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin text-red-600" /> Loading subcategory details...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/categories" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Subcategory Management</p>
            <h1 className="text-3xl font-bold text-white mt-1">{subcategory.name || 'Edit Subcategory'}</h1>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded text-xs font-semibold transition"
          >
            <Trash2 className="w-4 h-4" /> Delete Subcategory
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-sm ${message.includes('✅') ? 'bg-green-950 text-green-200 border border-green-800' : 'bg-red-950 text-red-200 border border-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Basic Details */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Subcategory Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Parent Category *</label>
                <select
                  value={subcategory.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Subcategory Name *</label>
                <input
                  type="text"
                  value={subcategory.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Slug *</label>
                <input
                  type="text"
                  value={subcategory.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={subcategory.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
                <textarea
                  value={subcategory.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Subcategory description..."
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Image & Banner Uploads */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-500" /> Subcategory Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subcategory Image */}
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-red-400 uppercase">Subcategory Image</label>
                <p className="text-[11px] text-zinc-400">Image shown on subcategory preview cards</p>

                {subcategory.image_url ? (
                  <div className="relative aspect-video w-full rounded bg-zinc-900 border border-zinc-800 overflow-hidden group">
                    <Image src={subcategory.image_url} alt="Subcategory" fill className="object-cover" unoptimized />
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
                    value={subcategory.image_url || ''}
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

              {/* Subcategory Banner Image */}
              <div className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                <label className="block text-xs font-bold text-red-400 uppercase">Subcategory Banner Image</label>
                <p className="text-[11px] text-zinc-400">Header banner shown on subcategory page</p>

                {subcategory.banner_url ? (
                  <div className="relative aspect-video w-full rounded bg-zinc-900 border border-zinc-800 overflow-hidden group">
                    <Image src={subcategory.banner_url} alt="Banner" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('banner_url', '')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded bg-zinc-900 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    No banner uploaded
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subcategory.banner_url || ''}
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3 mb-4">Status & Visibility</h2>

            <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={subcategory.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              Active (Visible on Public Website & Menus)
            </label>
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
              {saving ? 'Saving...' : 'Save Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
