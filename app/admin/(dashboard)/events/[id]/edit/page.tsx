'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateEvent, deleteEvent } from '@/lib/actions/admin/events';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

interface EventForm {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  image_url: string;
  event_date: string;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
}

/** `datetime-local` needs `YYYY-MM-DDTHH:mm`, not a full ISO string. */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadEvent() {
      const supabase = createClient();
      const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();

      if (error || !data) {
        setMessage(`❌ Could not load event: ${error?.message ?? 'not found'}`);
      } else {
        setEvent({
          id: data.id,
          title: data.title ?? '',
          slug: data.slug ?? '',
          description: data.description ?? '',
          location: data.location ?? '',
          category: data.category ?? '',
          image_url: data.image_url ?? '',
          event_date: toLocalInput(data.event_date),
          is_active: data.is_active ?? true,
          meta_title: data.meta_title ?? '',
          meta_description: data.meta_description ?? '',
        });
      }
      setLoading(false);
    }
    loadEvent();
  }, [eventId]);

  const handleInputChange = (field: keyof EventForm, value: string | boolean) => {
    setEvent((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!event) return;
    setSaving(true);
    setMessage('');

    const result = await updateEvent(event.id, event);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/events'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    setSaving(true);
    setMessage('');

    const result = await deleteEvent(event.id);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/events'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  if (!event) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-4xl">
          <Link href="/admin/events" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="bg-red-900 text-red-100 p-3 rounded">{message || 'Event not found.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/events" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Events</p>
          <h1 className="text-4xl font-bold text-white mt-2">{event.title}</h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.startsWith('✅') ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title *</label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Slug *</label>
              <input
                type="text"
                value={event.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <textarea
              value={event.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Location</label>
              <input
                type="text"
                value={event.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Category</label>
              <input
                type="text"
                value={event.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Event Date</label>
              <input
                type="datetime-local"
                value={event.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Image URL</label>
              <input
                type="text"
                value={event.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">SEO Title</label>
              <input
                type="text"
                value={event.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">SEO Description</label>
              <input
                type="text"
                value={event.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={event.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              Active
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Event'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:opacity-50 text-red-100 px-6 py-3 rounded font-semibold"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
