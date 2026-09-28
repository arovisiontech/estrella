"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Search, Mail, Download, Eye, EyeOff } from "lucide-react";
import { setSubscriberActive, deleteSubscriber } from "@/lib/actions/admin/subscribers";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const loadSubscribers = async () => {
    setLoading(true);
    let query = supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter === "active") {
      query = query.eq("is_active", true);
    } else if (statusFilter === "inactive") {
      query = query.eq("is_active", false);
    }

    const { data, error } = await query;

    if (!error && data) {
      setSubscribers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSubscribers();
  }, [statusFilter]);

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(id: string, isActive: boolean) {
    const res = await setSubscriberActive(id, !isActive);
    if (res.success) {
      setMessage(`✅ ${res.message}`);
      loadSubscribers();
    } else {
      setMessage(`❌ ${res.message || "Failed to update subscriber"}`);
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this subscriber permanently?")) return;
    const res = await deleteSubscriber(id);
    if (res.success) {
      setMessage(`✅ ${res.message}`);
      loadSubscribers();
    } else {
      setMessage(`❌ ${res.message || "Failed to delete subscriber"}`);
    }
    setTimeout(() => setMessage(""), 3000);
  }

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Email,Active,Created At"]
        .concat(
          filteredSubscribers.map(
            (s) => `"${s.id}","${s.email}",${s.is_active},"${s.created_at}"`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-8 text-white">Loading subscribers...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Communications</p>
            <h1 className="text-4xl font-bold text-white mt-1">Newsletter Subscribers</h1>
            <p className="text-zinc-400 mt-2">
              {filteredSubscribers.length} total subscribers
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded transition"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded text-sm ${
              message.includes("✅") ? "bg-green-950 text-green-200 border border-green-800" : "bg-red-950 text-red-200 border border-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-zinc-900 text-white outline-none border border-zinc-800 rounded focus:border-red-600 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-zinc-900 text-white border border-zinc-800 rounded focus:border-red-600 outline-none text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase font-semibold text-zinc-400">
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Subscribed Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-zinc-900/50 transition">
                      <td className="p-4 text-white font-mono text-xs">{subscriber.email}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(subscriber.id, subscriber.is_active)}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
                            subscriber.is_active
                              ? "bg-green-950 text-green-200 border border-green-800"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {subscriber.is_active ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-zinc-400 text-xs">
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(subscriber.id)}
                          className="text-zinc-500 hover:text-red-400 transition p-1"
                          aria-label="Delete subscriber"
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
