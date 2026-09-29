'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateSubcategory, deleteSubcategory, type SubcategoryInput } from '@/lib/actions/admin/subcategories';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { DEFAULT_CATEGORIES } from '@/lib/cms/defaultCategories';
import { saveStoredSubcategory, deleteStoredSubcategory } from '@/lib/cms/clientStorage';

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
      try {
        const [subcatRes, catsRes] = await Promise.all([
          supabase.from('subcategories').select('*').or(`id.eq.${subcategoryId},slug.eq.${subcategoryId}`).maybeSingle(),
          supabase.from('categories').select('*').order('name', { ascending: true })
        ]);

        let loadedSubcat: SubcategoryRecord | null = null;

        if (subcatRes.data) {
          loadedSubcat = {
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
          };
        } else {
          // Check DEFAULT_CATEGORIES for matching subcategory
          for (const c of DEFAULT_CATEGORIES) {
            const found = (c.subcategories || []).find(
              (s) =>
                s.id === subcategoryId ||
                s.slug === subcategoryId ||
                s.name.toLowerCase() === subcategoryId.toLowerCase()
            );
            if (found) {
              loadedSubcat = {
                id: found.id,
                category_id: c.id,
                name: found.name,
                slug: found.slug,
                description: '',
                image_url: '',
                banner_url: '',
                is_featured: false,
                is_active: found.is_active ?? true,
                sort_order: found.sort_order ?? 0,
                meta_title: '',
                meta_description: '',
              };
              break;
            }
          }
        }

        setSubcategory(loadedSubcat);

        // For categories list:
        let allCats: Category[] = catsRes.data || [];
        if (allCats.length === 0) {
          allCats = DEFAULT_CATEGORIES.map(c => ({ id: c.id, name: c.name }));
        } else {
          DEFAULT_CATEGORIES.forEach(c => {
            if (!allCats.some(x => x.id === c.id || x.name.toLowerCase() === c.name.toLowerCase())) {
              allCats.push({ id: c.id, name: c.name });
            }
          });
        }
        setCategories(allCats);
      } catch (err) {
        console.error('Subcategory load error:', err);
        for (const c of DEFAULT_CATEGORIES) {
          const found = (c.subcategories || []).find(
            (s) =>
              s.id === subcategoryId ||
              s.slug === subcategoryId ||
              s.name.toLowerCase() === subcategoryId.toLowerCase()
          );
          if (found) {
            setSubcategory({
              id: found.id,
              category_id: c.id,
              name: found.name,
              slug: found.slug,
              description: '',
              image_url: '',
              banner_url: '',
              is_featured: false,
              is_active: found.is_active ?? true,
              sort_order: found.sort_order ?? 0,
              meta_title: '',
              meta_description: '',
            });
            break;
          }
        }
        setCategories(DEFAULT_CATEGORIES.map(c => ({ id: c.id, name: c.name })));
      } finally {
        setLoading(false);
      }
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

    const updatedSubcat = {
      id: subcategory.id,
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
    };

    saveStoredSubcategory(updatedSubcat);

    try {
      const result = await updateSubcategory(subcategory.id, updatedSubcat);

      if (result.success) {
        setMessage('✅ Subcategory saved successfully!');
        setTimeout(() => router.push('/admin/subcategories'), 1000);
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
    deleteStoredSubcategory(subcategory.id);
    try {
      const result = await deleteSubcategory(subcategory.id);
      if (result.success) {
        setMessage('✅ Subcategory deleted');
        setTimeout(() => router.push('/admin/subcategories'), 1000);
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans">
        <div className="p-6 text-slate-600 flex items-center gap-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#00AEF0]" /> Loading subcategory details...
        </div>
      </div>
    );
  }

  if (!subcategory) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="mx-auto max-w-4xl bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Subcategory Not Found</h2>
          <p className="text-sm text-slate-500">Could not find subcategory with ID &quot;{subcategoryId}&quot;.</p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 bg-[#00AEF0] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0090c8] transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </Link>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{subcategory.name || 'Edit Subcategory'}</h1>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition shadow-xs"
          >
            <Trash2 className="w-4 h-4" /> Delete Subcategory
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
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Subcategory Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Parent Category *</label>
                <select
                  value={subcategory.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Subcategory Name *</label>
                <input
                  type="text"
                  value={subcategory.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Slug *</label>
                <input
                  type="text"
                  value={subcategory.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={subcategory.sort_order}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Description</label>
                <textarea
                  value={subcategory.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Subcategory description..."
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Image & Banner Uploads */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00AEF0]" /> Subcategory Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subcategory Image */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase">Subcategory Image</label>
                <p className="text-[11px] text-slate-500">Image shown on subcategory preview cards</p>

                {subcategory.image_url ? (
                  <div className="relative aspect-video w-full rounded-lg bg-white border border-slate-200 overflow-hidden group">
                    <Image src={subcategory.image_url} alt="Subcategory" fill className="object-cover" unoptimized />
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
                    value={subcategory.image_url || ''}
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

              {/* Subcategory Banner Image */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase">Subcategory Banner Image</label>
                <p className="text-[11px] text-slate-500">Header banner shown on subcategory page</p>

                {subcategory.banner_url ? (
                  <div className="relative aspect-video w-full rounded-lg bg-white border border-slate-200 overflow-hidden group">
                    <Image src={subcategory.banner_url} alt="Banner" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => handleInputChange('banner_url', '')}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-lg bg-white border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                    No banner uploaded
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subcategory.banner_url || ''}
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
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Status & Visibility</h2>

            <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={subcategory.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="w-4 h-4 accent-[#00AEF0] rounded"
              />
              Active (Visible on Public Website & Menus)
            </label>
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
              {saving ? 'Saving...' : 'Save Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
