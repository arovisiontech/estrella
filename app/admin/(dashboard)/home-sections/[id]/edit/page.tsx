'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateHomeSection, deleteHomeSection } from '@/lib/actions/admin/home-sections';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2, Image as ImageIcon, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { capabilities as defaultCapabilities } from '@/lib/data/capabilities';
import { manufacturingGallery as defaultGallery } from '@/lib/data/manufacturingGallery';

interface CapabilityCardItem {
  title: string;
  description: string;
  icon?: string;
}

interface GalleryItem {
  id: string;
  placement: string;
  src: string;
  alt: string;
}

interface HomeSection {
  id: string;
  section_key: string;
  title: string;
  component_type: string;
  heading?: string;
  subheading?: string;
  description?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  content?: Record<string, any>;
  is_visible: boolean;
  sort_order: number;
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Slides' },
  { value: 'featured-products', label: 'Featured Products' },
  { value: 'crafting-protection', label: 'Crafting Protection' },
  { value: 'category-collections', label: 'Category Collections' },
  { value: 'what-we-do', label: 'What We Do' },
  { value: 'latest-blogs', label: 'Latest Blogs' },
  { value: 'custom', label: 'Custom Section' },
];

const HONEYCOMB_PLACEMENTS = [
  { key: 'center', label: '1. Center Large Hexagon' },
  { key: 'top', label: '2. Top Small Hexagon' },
  { key: 'upper-left', label: '3. Upper Left Hexagon' },
  { key: 'upper-right', label: '4. Upper Right Hexagon' },
  { key: 'lower-left', label: '5. Lower Left Hexagon' },
  { key: 'lower-right', label: '6. Lower Right Hexagon' },
  { key: 'bottom', label: '7. Bottom Small Hexagon' },
];

export default function EditHomeSectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params.id as string;
  const supabase = createClient();

  const [section, setSection] = useState<HomeSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGalleryKey, setUploadingGalleryKey] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Section specific dynamic states
  const [capabilities, setCapabilities] = useState<CapabilityCardItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [offers, setOffers] = useState<string[]>([]);

  useEffect(() => {
    async function loadSection() {
      setLoading(true);
      const { data } = await supabase.from('home_sections').select('*').eq('id', sectionId).single();
      if (data) {
        setSection({
          ...data,
          heading: data.heading || data.content?.heading || '',
          subheading: data.subheading || data.content?.subheading || '',
          description: data.description || data.content?.description || '',
          button_text: data.button_text || data.content?.button_text || '',
          button_link: data.button_link || data.content?.button_link || '',
          is_visible: data.is_visible ?? true,
          component_type: data.component_type || data.section_key,
        });

        // What We Do section initialization
        const contentObj = data.content || {};
        const caps = Array.isArray(contentObj.capabilities) && contentObj.capabilities.length > 0
          ? contentObj.capabilities
          : defaultCapabilities.map(c => ({ title: c.title, description: c.description, icon: c.icon }));
        setCapabilities(caps);

        const gal = Array.isArray(contentObj.gallery) && contentObj.gallery.length > 0
          ? contentObj.gallery
          : defaultGallery.map(g => ({ id: g.id, placement: g.placement, src: g.src, alt: g.alt }));
        setGallery(gal);

        // Crafting Protection section initialization
        const offs = Array.isArray(contentObj.offers) && contentObj.offers.length > 0
          ? contentObj.offers
          : ["On-time delivery", "Cost-efficient solutions", "High-tech manufacturing", "Innovative designs"];
        setOffers(offs);
      }
      setLoading(false);
    }
    loadSection();
  }, [sectionId]);

  const handleInputChange = (field: keyof HomeSection, value: any) => {
    if (section) {
      setSection({ ...section, [field]: value });
    }
  };

  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !section) return;
    setUploadingImage(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('bucket', 'site-assets');
      data.append('folder', 'home-sections');

      const res = await uploadAdminFile(data);
      if (res.success && res.data) {
        setSection((prev) => prev ? { ...prev, image_url: res.data!.url } : null);
        setMessage('✅ Section image uploaded successfully.');
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
          const existingIdx = updated.findIndex(item => item.placement === placementKey);
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
    if (!section) return;
    if (!section.title) {
      setMessage('❌ Title is required');
      return;
    }

    setSaving(true);
    setMessage('');

    const contentPayload: Record<string, any> = {
      heading: section.heading,
      subheading: section.subheading,
      description: section.description,
      button_text: section.button_text,
      button_link: section.button_link,
      ...(section.content || {}),
    };

    if (section.section_key === 'what-we-do' || section.component_type === 'what-we-do') {
      contentPayload.capabilities = capabilities;
      contentPayload.gallery = gallery;
    }

    if (section.section_key === 'crafting-protection' || section.component_type === 'crafting-protection') {
      contentPayload.offers = offers;
    }

    const payload = {
      section_key: section.section_key,
      title: section.title,
      component_type: section.component_type || section.section_key,
      heading: section.heading,
      subheading: section.subheading,
      description: section.description,
      image_url: section.image_url,
      button_text: section.button_text,
      button_link: section.button_link,
      content: contentPayload,
      is_visible: section.is_visible,
      sort_order: section.sort_order || 0,
    };

    const result = await updateHomeSection(section.id, payload);

    if (result.success) {
      setMessage('✅ Section saved successfully!');
      setTimeout(() => router.push('/admin/home-sections'), 1200);
    } else {
      setMessage(`❌ Error: ${result.message}`);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!section || !confirm('Delete this home section?')) return;
    setSaving(true);
    const result = await deleteHomeSection(section.id);

    if (result.success) {
      setMessage('✅ Section deleted');
      setTimeout(() => router.push('/admin/home-sections'), 1200);
    } else {
      setMessage(`❌ Error: ${result.message}`);
      setSaving(false);
    }
  };

  if (loading || !section) {
    return <div className="p-6 text-white flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin text-red-600" /> Loading section...</div>;
  }

  const isWhatWeDo = section.section_key === 'what-we-do' || section.component_type === 'what-we-do';
  const isCraftingProtection = section.section_key === 'crafting-protection' || section.component_type === 'crafting-protection';

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/home-sections" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home Sections
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Home Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">{section.title}</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-sm ${message.includes('✅') ? 'bg-green-950 text-green-100 border border-green-800' : 'bg-red-950 text-red-100 border border-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          {/* Main Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Section Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Title *</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Section Type / Component</label>
                <select
                  value={section.component_type}
                  onChange={(e) => handleInputChange('component_type', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                >
                  {SECTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Heading</label>
                <input
                  type="text"
                  value={section.heading || ''}
                  onChange={(e) => handleInputChange('heading', e.target.value)}
                  placeholder="e.g. Reliable Craftsmanship. Premium Leather Jackets."
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Subheading / Eyebrow</label>
                <input
                  type="text"
                  value={section.subheading || ''}
                  onChange={(e) => handleInputChange('subheading', e.target.value)}
                  placeholder="e.g. WHAT WE DO"
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description</label>
                <textarea
                  value={section.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              {/* Section Image & Upload */}
              <div className="col-span-2 space-y-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase">Section Main Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={section.image_url || ''}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="/images/banner.png or Image URL"
                    className="flex-1 bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded cursor-pointer transition shrink-0">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSectionImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Button Text</label>
                <input
                  type="text"
                  value={section.button_text || ''}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Button Link</label>
                <input
                  type="text"
                  value={section.button_link || ''}
                  onChange={(e) => handleInputChange('button_link', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={section.sort_order || 0}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Special Section: WHAT WE DO Capabilities & Honeycomb Gallery */}
          {isWhatWeDo && (
            <>
              {/* Capability Cards Editor */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-bold text-white">4 Capability Feature Cards</h2>
                  <span className="text-xs text-zinc-400">Displayed in 2x2 grid</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capabilities.slice(0, 4).map((cap, idx) => (
                    <div key={idx} className="bg-zinc-950 p-4 rounded border border-zinc-800 space-y-3">
                      <p className="text-xs font-bold text-red-500 uppercase">Card {idx + 1}</p>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={cap.title}
                          onChange={(e) => {
                            const updated = [...capabilities];
                            updated[idx].title = e.target.value;
                            setCapabilities(updated);
                          }}
                          className="w-full bg-zinc-900 text-white px-3 py-1.5 rounded border border-zinc-700 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Description</label>
                        <textarea
                          value={cap.description}
                          onChange={(e) => {
                            const updated = [...capabilities];
                            updated[idx].description = e.target.value;
                            setCapabilities(updated);
                          }}
                          rows={2}
                          className="w-full bg-zinc-900 text-white px-3 py-1.5 rounded border border-zinc-700 outline-none text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Honeycomb Gallery Images Editor */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h2 className="text-lg font-bold text-white">Honeycomb Hexagon Gallery Images (7 Hexagons)</h2>
                  <span className="text-xs text-zinc-400">Upload or change images for each placement</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {HONEYCOMB_PLACEMENTS.map((item) => {
                    const existing = gallery.find(g => g.placement === item.key);
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
                                setGallery(prev => {
                                  const updated = [...prev];
                                  const idx = updated.findIndex(g => g.placement === item.key);
                                  if (idx >= 0) {
                                    updated[idx] = { ...updated[idx], src: newSrc };
                                  } else {
                                    updated.push({ id: item.key, placement: item.key, src: newSrc, alt: item.label });
                                  }
                                  return updated;
                                });
                              }}
                              placeholder="Image URL"
                              className="w-full bg-zinc-900 text-white px-2.5 py-1 rounded border border-zinc-700 text-xs outline-none"
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
            </>
          )}

          {/* Special Section: CRAFTING PROTECTION Bullet Points */}
          {isCraftingProtection && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-white">We Proudly Offer List Items</h2>
                <span className="text-xs text-zinc-400">Bullet points under description</span>
              </div>

              <div className="space-y-3">
                {offers.map((offer, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={offer}
                      onChange={(e) => {
                        const updated = [...offers];
                        updated[idx] = e.target.value;
                        setOffers(updated);
                      }}
                      className="flex-1 bg-zinc-950 text-white px-3 py-2 rounded border border-zinc-800 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setOffers(offers.filter((_, i) => i !== idx))}
                      className="p-2 text-zinc-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setOffers([...offers, 'New offer item'])}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-semibold pt-2"
                >
                  <Plus className="w-4 h-4" /> Add Offer Item
                </button>
              </div>
            </div>
          )}

          {/* Visibility */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={section.is_visible}
                onChange={(e) => handleInputChange('is_visible', e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              Visible (Displayed on Public Website)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white px-6 py-2.5 rounded font-semibold transition"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Section'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:bg-zinc-700 text-white px-6 py-2.5 rounded font-semibold transition"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
