'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateHeroSlide, deleteHeroSlide } from '@/lib/actions/admin/hero-slides';
import { uploadAdminFile, getSignedUploadUrl } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2, Video, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

interface HeroSlide {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image_url?: string;
  mobile_image_url?: string;
  video_url?: string;
  button_text?: string;
  button_url?: string;
  text_position: string;
  sort_order: number;
  is_active: boolean;
}

export default function EditHeroSlidePage() {
  const router = useRouter();
  const params = useParams();
  const slideId = params.id as string;
  const supabase = createClient();

  const [slide, setSlide] = useState<HeroSlide | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadSlide() {
      setLoading(true);
      const { data } = await supabase.from('hero_slides').select('*').eq('id', slideId).single();
      if (data) {
        setSlide(data);
        if (data.video_url && data.video_url.trim().length > 0) {
          setMediaType('video');
        } else {
          setMediaType('image');
        }
      }
      setLoading(false);
    }
    loadSlide();
  }, [slideId]);

  const handleInputChange = (field: keyof HeroSlide, value: any) => {
    if (slide) {
      setSlide({ ...slide, [field]: value });
    }
  };

  // Upload helper: uses signed upload URL (browser direct to storage) with fallback
  const uploadFileDirectly = async (file: File, folder = 'hero-media'): Promise<{ success: boolean; url?: string; message?: string }> => {
    // 1. Signed URL direct browser upload (bypasses Vercel 4.5MB payload limit & Supabase RLS)
    try {
      const res = await getSignedUploadUrl('hero-slides', folder, file.name);
      if (res.success && res.data) {
        const { signedUrl, token, path, publicUrl } = res.data;

        const uploadRes = await supabase.storage.from('hero-slides').uploadToSignedUrl(path, token, file, {
          contentType: file.type || 'application/octet-stream',
          cacheControl: '3600',
        });

        if (!uploadRes.error) {
          return { success: true, url: publicUrl };
        }

        // Direct HTTP PUT fallback if SDK method encounters issue
        const fetchRes = await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        });

        if (fetchRes.ok) {
          return { success: true, url: publicUrl };
        }
      }
    } catch (e: any) {
      console.warn('Signed upload failed, trying fallback:', e);
    }

    // 2. Fallback to server action upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'hero-slides');
      formData.append('folder', folder);

      const serverRes = await uploadAdminFile(formData);
      if (serverRes.success && serverRes.data?.url) {
        return { success: true, url: serverRes.data.url };
      }
      return { success: false, message: serverRes.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Upload failed' };
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !slide) return;
    setUploadingVideo(true);
    setMessage('');

    try {
      const res = await uploadFileDirectly(file, 'hero-videos');
      if (res.success && res.url) {
        setSlide((prev) => prev ? { ...prev, video_url: res.url } : null);
        setMediaType('video');
        setMessage('✅ Video file uploaded successfully!');
      } else {
        setMessage(`❌ Video upload failed: ${res.message || 'Error uploading video'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Video upload error: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !slide) return;
    setUploadingImage(true);
    setMessage('');

    try {
      const res = await uploadFileDirectly(file, 'hero-images');
      if (res.success && res.url) {
        setSlide((prev) => prev ? { ...prev, image_url: res.url, mobile_image_url: res.url } : null);
        setMessage('✅ Photo uploaded successfully!');
      } else {
        setMessage(`❌ Photo upload failed: ${res.message || 'Error uploading photo'}`);
      }
    } catch (err: any) {
      setMessage(`❌ Photo upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!slide) return;
    if (!slide.title?.trim()) {
      setMessage('❌ Slide title is required');
      return;
    }
    setSaving(true);

    const payload = {
      ...slide,
      video_url: mediaType === 'video' ? slide.video_url : '',
    };

    const result = await updateHeroSlide(slide.id, payload);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/home/hero-slides'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!slide || !confirm('Delete this hero slide?')) return;
    setSaving(true);
    const result = await deleteHeroSlide(slide.id);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/home/hero-slides'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  if (loading || !slide) {
    return <div className="p-6 text-white flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin text-red-600" /> Loading slide...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/home/hero-slides" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Hero Slides
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Home Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">{slide.title || 'Edit Hero Slide'}</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-sm ${message.includes('✅') ? 'bg-green-950 text-green-100 border border-green-800' : 'bg-red-950 text-red-100 border border-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          {/* Media Type Switcher */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Slide Media Type</h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded border font-semibold text-sm transition ${
                  mediaType === 'image'
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-5 h-5" /> Photo / Banner Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded border font-semibold text-sm transition ${
                  mediaType === 'video'
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Video className="w-5 h-5" /> Video Slide (MP4 / Vimeo / YouTube)
              </button>
            </div>
          </div>

          {/* Media Upload Options */}
          {mediaType === 'video' ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-500" /> Video Upload & Link
                </h2>
                <span className="text-xs text-zinc-400">Direct Video Upload or Vimeo/YouTube Link</span>
              </div>

              {/* Direct Video File Upload */}
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-white uppercase">Option 1: Upload Video File (Unlimited Size / Any Format)</p>
                <p className="text-xs text-zinc-400">Upload .mp4, .webm, .mov, .avi, or .mkv directly into storage.</p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition shadow">
                  {uploadingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingVideo ? 'Uploading Video File... Please wait' : 'Choose Video File To Upload'}
                  <input
                    type="file"
                    accept="video/*,.mp4,.webm,.ogg,.mov,.avi,.mkv,.m4v"
                    onChange={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Video URL / Link Input */}
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-3">
                <p className="text-xs font-bold text-white uppercase">Option 2: Video URL or Vimeo/YouTube Embed Link</p>
                <input
                  type="text"
                  value={slide.video_url || ''}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  className="w-full bg-zinc-900 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  placeholder="e.g. https://vimeo.com/1226960834 or https://youtu.be/... or MP4 link"
                />
              </div>

              {slide.video_url && (
                <div className="flex items-center justify-between p-3 bg-green-950/60 border border-green-800 rounded">
                  <span className="text-xs text-green-200 truncate flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    Video Attached: {slide.video_url}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('video_url', '')}
                    className="text-xs text-zinc-400 hover:text-red-400 underline shrink-0"
                  >
                    Clear Video
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-500" /> Photo / Banner Image (Fully Responsive for Mobile & Desktop)
              </h2>

              <div className="space-y-4 p-4 bg-zinc-950 rounded border border-zinc-800">
                <label className="block text-xs font-bold text-white uppercase">Slide Photo / Banner Image *</label>
                {slide.image_url ? (
                  <div className="relative aspect-video max-w-lg rounded overflow-hidden border border-zinc-800 bg-zinc-900 mb-2">
                    <Image src={slide.image_url} alt="Photo Preview" fill className="object-cover" unoptimized />
                  </div>
                ) : null}

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={slide.image_url || ''}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="flex-1 bg-zinc-900 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                    placeholder="/images/banner.png or Photo URL"
                  />
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition shrink-0 shadow">
                    {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingImage ? 'Uploading Photo...' : 'Upload Photo File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Slide Text Content & Buttons */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Slide Text & Overlay Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Eyebrow (Optional)</label>
                <input
                  type="text"
                  value={slide.eyebrow || ''}
                  onChange={(e) => handleInputChange('eyebrow', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  placeholder="e.g. EXPERIENCE TORQUE"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Title *</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  required
                  placeholder="e.g. Premium Motorcycle Gear"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Description (Optional)</label>
                <textarea
                  value={slide.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  placeholder="Brief description overlay..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Button Text (Optional)</label>
                <input
                  type="text"
                  value={slide.button_text || ''}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  placeholder="e.g. Explore Collection"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Button URL (Optional)</label>
                <input
                  type="text"
                  value={slide.button_url || ''}
                  onChange={(e) => handleInputChange('button_url', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                  placeholder="e.g. /products or /categories"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Text Alignment</label>
                <select
                  value={slide.text_position || 'center'}
                  onChange={(e) => handleInputChange('text_position', e.target.value)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Center Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={slide.sort_order || 0}
                  onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <label className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={slide.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              Active (Visible on Homepage Hero Slider)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || uploadingVideo || uploadingImage}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white px-8 py-3 rounded font-bold text-sm transition"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving Slide...' : 'Save Hero Slide'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving || uploadingVideo}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:bg-zinc-700 text-white px-6 py-3 rounded font-bold text-sm transition"
            >
              <Trash2 className="w-4 h-4" /> Delete Slide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
