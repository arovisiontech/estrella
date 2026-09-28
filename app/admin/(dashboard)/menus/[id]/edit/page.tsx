'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateMenuItem, deleteMenuItem } from '@/lib/actions/admin/menus';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

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

interface ItemOption {
  id: string;
  label: string;
}

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const supabase = createClient();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [parentItems, setParentItems] = useState<ItemOption[]>([]);
  const [loadingParents, setLoadingParents] = useState(true);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      const { data } = await supabase.from('menu_items').select('*').eq('id', itemId).single();
      if (data) setItem(data);
      setLoading(false);
    }
    loadItem();
  }, [itemId]);

  useEffect(() => {
    async function loadParentItems() {
      setLoadingParents(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, label')
        .eq('is_active', true)
        .neq('id', itemId)
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setParentItems(data);
      }
      setLoadingParents(false);
    }
    loadParentItems();
  }, [itemId]);

  const handleInputChange = (field: keyof MenuItem, value: any) => {
    if (item) {
      setItem({ ...item, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!item) return;
    if (!item.label) {
      setMessage('❌ Label is required');
      return;
    }

    setSaving(true);
    const result = await updateMenuItem(item.id, item);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/menus'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !confirm('Delete this menu item?')) return;
    setSaving(true);
    const result = await deleteMenuItem(item.id);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
      setTimeout(() => router.push('/admin/menus'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
      setSaving(false);
    }
  };

  if (loading || !item) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/menus" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Menu Items
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">{item.label}</h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Label *</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Menu Type *</label>
              <select
                value={item.menu_type}
                onChange={(e) => handleInputChange('menu_type', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                required
              >
                <option value="header">Header</option>
                <option value="footer_quick">Footer Quick Links</option>
                <option value="footer_products">Footer Products</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Href</label>
              <input
                type="text"
                value={item.href}
                onChange={(e) => handleInputChange('href', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Parent Item (Optional)</label>
              <select
                value={item.parent_id || ''}
                onChange={(e) => handleInputChange('parent_id', e.target.value || undefined)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                disabled={loadingParents}
              >
                <option value="">-- No Parent (Top Level) --</option>
                {parentItems.map(pi => (
                  <option key={pi.id} value={pi.id}>{pi.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Sort Order</label>
              <input
                type="number"
                value={item.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value))}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Target (optional)</label>
              <input
                type="text"
                value={item.target || ''}
                onChange={(e) => handleInputChange('target', e.target.value || undefined)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600"
                placeholder="_blank"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={item.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
              Active
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Item'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:bg-gray-600 text-white px-6 py-2 rounded"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
