'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  slug: string;
  location?: string;
  status?: string;
  source_data?: any;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('source_data->eventDate', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  }

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) {
      setMessage('✅ Event deleted');
      loadEvents();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase">Events</p>
            <h1 className="text-4xl font-bold text-white mt-2">Events</h1>
            <p className="text-zinc-400 mt-2">{filteredEvents.length} events</p>
          </div>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Add Event
          </Link>
        </div>

        {message && (
          <div className="mb-4 bg-green-900 text-green-100 p-3 rounded">
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-4 bg-zinc-900 p-4 rounded">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title or slug..."
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
                  <th className="text-left p-4 text-zinc-400">Title</th>
                  <th className="text-left p-4 text-zinc-400">Location</th>
                  <th className="text-left p-4 text-zinc-400">Status</th>
                  <th className="text-left p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-zinc-400">No events found</td>
                  </tr>
                ) : (
                  filteredEvents.map(event => (
                    <tr key={event.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                      <td className="p-4 text-white">{event.title}</td>
                      <td className="p-4 text-zinc-400">{event.location || '-'}</td>
                      <td className="p-4 text-zinc-400">{event.status || '-'}</td>
                      <td className="p-4 flex gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
