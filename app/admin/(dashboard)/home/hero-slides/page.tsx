'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setHeroSlideActive, deleteHeroSlide } from '@/lib/actions/admin/hero-slides';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, GripVertical } from 'lucide-react';
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
  text_position?: string;
  sort_order: number;
  is_active: boolean;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setSlides(data);
    }
    setLoading(false);
  }

  const filteredSlides = slides.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.eyebrow?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(id: string, isActive: boolean) {
    const result = await setHeroSlideActive(id, !isActive);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadSlides();
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this slide? This cannot be undone.')) return;
    const result = await deleteHeroSlide(id);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadSlides();
    setTimeout(() => setMessage(''), 3000);
  }

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase">Home Content</p>
            <h1 className="text-4xl font-bold text-white mt-2">Hero Slides</h1>
            <p className="text-zinc-400 mt-2">{filteredSlides.length} slides</p>
          </div>
          <Link
            href="/admin/home/hero-slides/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </Link>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.startsWith('✅') ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-4 bg-zinc-900 p-4 rounded">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title or eyebrow..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="text-left p-4 text-zinc-400">Preview</th>
                  <th className="text-left p-4 text-zinc-400">Eyebrow</th>
                  <th className="text-left p-4 text-zinc-400">Title</th>
                  <th className="text-left p-4 text-zinc-400">Media Type</th>
                  <th className="text-left p-4 text-zinc-400">Active</th>
                  <th className="text-left p-4 text-zinc-400">Sort</th>
                  <th className="text-left p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlides.map(slide => (
                  <tr key={slide.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                    <td className="p-4">
                      <div className="w-16 h-9 relative bg-zinc-800 rounded overflow-hidden">
                        {slide.image_url && (
                          <Image
                            src={slide.image_url}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                        {slide.video_url && (
                          <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-xs text-zinc-300">Video</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400">{slide.eyebrow || '-'}</td>
                    <td className="p-4 text-white">{slide.title}</td>
                    <td className="p-4 text-zinc-400">{slide.video_url ? 'Video' : 'Image'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(slide.id, slide.is_active)}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                          slide.is_active
                            ? 'bg-green-900 text-green-100'
                            : 'bg-yellow-900 text-yellow-100'
                        }`}
                      >
                        {slide.is_active ? (
                          <><Eye className="w-3 h-3" /> Active</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-zinc-400">{slide.sort_order}</td>
                    <td className="p-4 flex gap-2">
                      <Link
                        href={`/admin/home/hero-slides/${slide.id}/edit`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteSlide(slide.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
