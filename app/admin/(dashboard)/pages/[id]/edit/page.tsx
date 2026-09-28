'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updatePage, deletePage } from '@/lib/actions/admin/pages';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { manufacturingGallery as defaultGallery, type ManufacturingGalleryItem } from '@/lib/data/manufacturingGallery';

interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  featured_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  sort_order: number;
  source_data?: Record<string, any>;
  content_sections?: any;
  hero_section?: any;
}

interface GalleryItem {
  id: string;
  placement: string;
  src: string;
  alt: string;
}

const HONEYCOMB_PLACEMENTS = [
  { key: 'center', label: '1. Center Large Hexagon' },
  { key: 'top', label: '2. Top Small Hexagon' },
  { key: 'upper-left', label: '3. Upper Left Hexagon' },
  { key: 'upper-right', label: '4. Upper Right Hexagon' },
  { key: 'lower-left', label: '5. Lower Left Hexagon' },
  { key: 'lower-right', label: '6. Lower Right Hexagon' },
  { key: 'bottom', label: '7. Bottom Small Hexagon' },
];

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  const supabase = createClient();

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGalleryKey, setUploadingGalleryKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Gallery state for honeycomb images
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      const { data } = await supabase.from('pages').select('*').eq('id', pageId).single();
      if (data) {
        setPage(data);
        const sourceData = data.source_data || {};
        const contentSections = data.content_sections || {};
        const savedGallery = sourceData.gallery || contentSections.gallery;

        if (Array.isArray(savedGallery) && savedGallery.length > 0) {
          setGallery(savedGallery);
        } else {
          // Initialize with default gallery items if no custom gallery saved yet
          setGallery(
            defaultGallery.map((g) => ({
              id: g.id,
              placement: g.placement,
              src: g.src,
              alt: g.alt,
            }))
          );
        }
      }
      setLoading(false);
    }
    loadPage();
  }, [pageId]);

  const handleInputChange = (field: keyof Page, value: any) => {
    if (page) {
      setPage({ ...page, [field]: value });
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !page) return;
    setUploadingImage(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('bucket', 'site-assets');
      data.append('folder', 'pages');

      const res = await uploadAdminFile(data);
      if (res.success && res.data) {
        setPage((prev) => (prev ? { ...prev, featured_image_url: res.data!.url } : null));
        setMessage('✅ Featured image uploaded successfully.');
      } else {
        setMessage(`❌ Image upload failed: ${res.message || 'Failed to upload image'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, placementKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGalleryKey(placementKey);
    setMessage('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('bucket', 'site-assets');
      data.append('folder', 'honeycomb-gallery');

      const res = await uploadAdminFile(data);
      if (res.success && res.data) {
        setGallery((prev) => {
          const updated = [...prev];
          const existingIdx = updated.findIndex((item) => item.placement === placementKey);
          if (existingIdx >= 0) {
            updated[existingIdx] = { ...updated[existingIdx], src: res.data!.url };
          } else {
            updated.push({
              id: `${placementKey}-${Date.now()}`,
              placement: placementKey,
              src: res.data!.url,
              alt: `Gallery image (${placementKey})`,
            });
          }
          return updated;
        });
        setMessage(`✅ Image uploaded for ${placementKey}.`);
      } else {
        setMessage(`❌ Gallery upload failed: ${res.message || 'Failed to upload image'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Gallery upload error: ${err.message}`);
    } finally {
      setUploadingGalleryKey(null);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    if (!page.title) {
      setMessage('❌ Title is required');
      return;
    }
    if (!page.slug) {
      setMessage('❌ Slug is required');
      return;
    }

    setSaving(true);
    setMessage('');

    const updatedSourceData = {
      ...(page.source_data || {}),
      gallery,
    };

    const payload = {
      title: page.title,
      slug: page.slug,
      description: page.description,
      featured_image_url: page.featured_image_url,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      is_published: page.is_published,
      sort_order: page.sort_order,
      source_data: updatedSourceData,
      content_sections: page.content_sections,
      hero_section: page.hero_section,
    };

    const result = await updatePage(page.id, payload);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/pages'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!page || !confirm('Delete this page?')) return;
    setSaving(true);
    const result = await deletePage(page.id);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/pages'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  if (loading || !page) {
    return <div className="p-6 text-white flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin text-red-600" /> Loading page...</div>;
  }

  const isAboutPage = page.slug === 'about';

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/pages" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Pages
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">CONTENT</p>
          <h1 className="text-4xl font-bold text-white mt-2">{page.title}</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-sm ${message.includes('✅') ? 'bg-green-950 text-green-100 border border-green-800' : 'bg-red-950 text-red-100 border border-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          {/* Main Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Page Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Title *</label>
                <input
                  type="text"
                  value={page.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Slug *</label>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
              <textarea
                value={page.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
              />
            </div>

            {/* Featured Image & Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase">Featured Image URL</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={page.featured_image_url || ''}
                  onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
                  placeholder="/images/page-hero.jpg or Image URL"
                  className="flex-1 bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded cursor-pointer transition shrink-0">
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">SEO Title</label>
                <input
                  type="text"
                  value={page.meta_title || ''}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">SEO Description</label>
                <input
                  type="text"
                  value={page.meta_description || ''}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Honeycomb Hexagon Gallery Images Editor (7 Hexagons) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">Honeycomb Hexagon Gallery Images (7 Hexagons)</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {isAboutPage
                    ? 'Upload or change images for the 7 hexagons displayed on the About Us page'
                    : 'Manage 7 hexagon gallery images for this page visual section'}
                </p>
              </div>
              <span className="text-xs text-red-500 font-semibold px-2.5 py-1 bg-red-950/60 border border-red-800/60 rounded">
                7 Placements
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HONEYCOMB_PLACEMENTS.map((item) => {
                const existing = gallery.find((g) => g.placement === item.key);
                const currentSrc = existing?.src || '';
                const isUploadingThis = uploadingGalleryKey === item.key;

                return (
                  <div key={item.key} className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                    <p className="text-xs font-bold text-red-400">{item.label}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 relative bg-zinc-900 rounded overflow-hidden border border-zinc-800 shrink-0">
                        {currentSrc ? (
                          <Image src={currentSrc} alt={item.label} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">No image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <input
                          type="text"
                          value={currentSrc}
                          onChange={(e) => {
                            const newSrc = e.target.value;
                            setGallery((prev) => {
                              const updated = [...prev];
                              const idx = updated.findIndex((g) => g.placement === item.key);
                              if (idx >= 0) {
                                updated[idx] = { ...updated[idx], src: newSrc };
                              } else {
                                updated.push({ id: item.key, placement: item.key, src: newSrc, alt: item.label });
                              }
                              return updated;
                            });
                          }}
                          placeholder="Image URL"
                          className="w-full bg-zinc-900 text-white px-2.5 py-1 rounded border border-zinc-700 text-xs outline-none focus:border-red-600"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold rounded cursor-pointer transition">
                          {isUploadingThis ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          {isUploadingThis ? 'Uploading...' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleGalleryImageUpload(e, item.key)}
                            disabled={isUploadingThis}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visibility and Sort Order */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 grid grid-cols-2 gap-6 items-center">
            <div>
              <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={page.is_published}
                  onChange={(e) => handleInputChange('is_published', e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                Published (Displayed on Public Website)
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Sort Order</label>
              <input
                type="number"
                value={page.sort_order || 0}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-950 text-white px-4 py-2 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold transition"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Page'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:opacity-50 text-red-100 px-6 py-3 rounded font-semibold transition"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
