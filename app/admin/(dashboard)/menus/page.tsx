'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setMenuItemActive, deleteMenuItem } from '@/lib/actions/admin/menus';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  menu_type: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  target?: string;
}

export default function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadMenuItems();
  }, []);

  async function loadMenuItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setItems(data);
    } else if (error?.code === 'PGRST205') {
      setMessage('⚠️ Menu items table not created yet. Run setup: npm run cms:migrate');
      setItems([]);
    }
    setLoading(false);
  }

  const filteredItems = items.filter(m =>
    m.label?.toLowerCase().includes(search.toLowerCase()) ||
    m.href?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleActive(id: string, isActive: boolean) {
    const result = await setMenuItemActive(id, !isActive);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadMenuItems();
    setTimeout(() => setMessage(''), 3000);
  }

  async function deleteMenu(id: string) {
    if (!confirm('Delete this menu item? This cannot be undone.')) return;
    const result = await deleteMenuItem(id);
    setMessage(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    if (result.success) await loadMenuItems();
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
            <p className="text-red-500 text-xs font-bold uppercase">Content</p>
            <h1 className="text-4xl font-bold text-white mt-2">Menu Items</h1>
            <p className="text-zinc-400 mt-2">{filteredItems.length} items</p>
          </div>
          <Link
            href="/admin/menus/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Add Item
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
            placeholder="Search by label or href..."
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
                  <th className="text-left p-4 text-zinc-400">Label</th>
                  <th className="text-left p-4 text-zinc-400">Href</th>
                  <th className="text-left p-4 text-zinc-400">Menu Type</th>
                  <th className="text-left p-4 text-zinc-400">Target</th>
                  <th className="text-left p-4 text-zinc-400">Status</th>
                  <th className="text-left p-4 text-zinc-400">Order</th>
                  <th className="text-left p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-zinc-400">No items found</td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                      <td className="p-4 text-white">
                        {item.parent_id && <span className="text-zinc-500">↳ </span>}
                        {item.label}
                      </td>
                      <td className="p-4 text-zinc-400 text-xs truncate max-w-xs">{item.href || '-'}</td>
                      <td className="p-4 text-zinc-400 text-xs">{item.menu_type || '-'}</td>
                      <td className="p-4 text-center">
                        {item.target ? (
                          <span className="text-green-400 text-xs">{item.target}</span>
                        ) : (
                          <span className="text-zinc-500 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                            item.is_active
                              ? 'bg-green-900 text-green-100'
                              : 'bg-yellow-900 text-yellow-100'
                          }`}
                        >
                          {item.is_active ? (
                            <><Eye className="w-3 h-3" /> Active</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-zinc-400">#{item.sort_order}</td>
                      <td className="p-4 flex gap-2">
                        <Link
                          href={`/admin/menus/${item.id}/edit`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteMenu(item.id)}
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

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded text-blue-200 text-sm">
          <p>
            <strong>Note:</strong> Create menu items that will be displayed in your site navigation. You can create parent items and then add child items by selecting a parent when creating a new menu.
          </p>
        </div>
      </div>
    </div>
  );
}
