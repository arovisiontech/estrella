'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface HomeSection {
  title: string;
  section_type?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
  sort_order: number;
}

const defaultSection: HomeSection = {
  title: '',
  section_type: 'custom',
  heading: '',
  subheading: '',
  description: '',
  image_url: '',
  button_text: '',
  button_link: '',
  is_active: true,
  sort_order: 0,
};

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Slides' },
  { value: 'featured-products', label: 'Featured Products' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'features', label: 'Features' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'custom', label: 'Custom Section' },
];

export default function NewHomeSectionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [section, setSection] = useState<HomeSection>(defaultSection);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (field: keyof HomeSection, value: any) => {
    setSection({ ...section, [field]: value });
  };

  const handleSave = async () => {
    if (!section.title) {
      setMessage('❌ Title is required');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('home_sections').insert([section]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Section created successfully');
      setTimeout(() => router.push('/admin/home-sections'), 1500);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/home-sections" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home Sections
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Home Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">Create Section</h1>
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
                value={section.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Section Type</label>
              <select
                value={section.section_type}
                onChange={(e) => handleInputChange('section_type', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              >
                {SECTION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Heading</label>
              <input
                type="text"
                value={section.heading}
                onChange={(e) => handleInputChange('heading', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Subheading</label>
              <input
                type="text"
                value={section.subheading}
                onChange={(e) => handleInputChange('subheading', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Description</label>
              <textarea
                value={section.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
              <input
                type="text"
                value={section.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="/images/section.jpg"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Button Text</label>
              <input
                type="text"
                value={section.button_text}
                onChange={(e) => handleInputChange('button_text', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Button Link</label>
              <input
                type="text"
                value={section.button_link}
                onChange={(e) => handleInputChange('button_link', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Sort Order</label>
              <input
                type="number"
                value={section.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={section.is_active}
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
              <Save className="w-4 h-4" /> {saving ? 'Creating...' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
