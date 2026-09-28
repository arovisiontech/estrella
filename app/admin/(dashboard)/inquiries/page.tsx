'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Trash2, Search, Eye } from 'lucide-react';

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const supabase = createClient();

  const loadInquiries = async () => {
    setLoading(true);
    let query = supabase
      .from('contact_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const filteredInquiries = inquiries.filter(i =>
    i.full_name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.subject.toLowerCase().includes(search.toLowerCase())
  );

  async function deleteInquiry(id: string) {
    if (!confirm('Delete this inquiry?')) return;
    const { error } = await supabase.from('contact_inquiries').delete().eq('id', id);
    if (!error) {
      setMessage('✅ Inquiry deleted');
      loadInquiries();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setMessage('✅ Status updated');
      loadInquiries();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Communications</p>
          <h1 className="text-4xl font-bold text-white mt-2">Contact Inquiries</h1>
          <p className="text-zinc-400 mt-2">{filteredInquiries.length} inquiries</p>
        </div>

        {message && (
          <div className="mb-4 bg-green-900 text-green-100 p-3 rounded">
            {message}
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-zinc-900 text-white outline-none border border-zinc-700 rounded focus:border-red-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-zinc-900 text-white border border-zinc-700 rounded focus:border-red-600 outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="text-left p-4 text-zinc-400">Name</th>
                  <th className="text-left p-4 text-zinc-400">Email</th>
                  <th className="text-left p-4 text-zinc-400">Subject</th>
                  <th className="text-left p-4 text-zinc-400">Status</th>
                  <th className="text-left p-4 text-zinc-400">Date</th>
                  <th className="text-left p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-zinc-400">No inquiries found</td>
                  </tr>
                ) : (
                  filteredInquiries.map(inquiry => (
                    <tr key={inquiry.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                      <td className="p-4 text-white">{inquiry.full_name}</td>
                      <td className="p-4 text-zinc-400 text-xs">{inquiry.email}</td>
                      <td className="p-4 text-zinc-400 truncate max-w-xs">{inquiry.subject}</td>
                      <td className="p-4">
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                          className={`px-3 py-1 rounded text-xs font-semibold outline-none border-0 cursor-pointer ${
                            inquiry.status === 'new'
                              ? 'bg-blue-900 text-blue-100'
                              : inquiry.status === 'contacted'
                                ? 'bg-yellow-900 text-yellow-100'
                                : 'bg-zinc-700 text-zinc-100'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-4 text-zinc-400 text-xs">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="text-blue-400 hover:text-blue-300"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
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

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-zinc-400">Name</p>
                <p className="text-white">{selectedInquiry.full_name}</p>
              </div>
              <div>
                <p className="text-zinc-400">Email</p>
                <p className="text-white">{selectedInquiry.email}</p>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <p className="text-zinc-400">Phone</p>
                  <p className="text-white">{selectedInquiry.phone}</p>
                </div>
              )}
              {selectedInquiry.company && (
                <div>
                  <p className="text-zinc-400">Company</p>
                  <p className="text-white">{selectedInquiry.company}</p>
                </div>
              )}
              {selectedInquiry.country && (
                <div>
                  <p className="text-zinc-400">Country</p>
                  <p className="text-white">{selectedInquiry.country}</p>
                </div>
              )}
              <div>
                <p className="text-zinc-400">Subject</p>
                <p className="text-white">{selectedInquiry.subject}</p>
              </div>
              <div>
                <p className="text-zinc-400">Message</p>
                <p className="text-white whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>
              <div>
                <p className="text-zinc-400">Date</p>
                <p className="text-white">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
