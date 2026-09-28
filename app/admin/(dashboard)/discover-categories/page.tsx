"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Save, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { defaultDiscoverCategories, DiscoverCategoryItem } from "@/components/home/DiscoverCategoriesSection";

export default function DiscoverCategoriesAdminPage() {
  const [items, setItems] = useState<DiscoverCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DiscoverCategoryItem | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");

  const loadItems = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_discover_categories");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setLoading(false);
          return;
        }
      } catch {}
    }
    setItems(defaultDiscoverCategories);
    localStorage.setItem("estrella_discover_categories", JSON.stringify(defaultDiscoverCategories));
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItemsState = (updated: DiscoverCategoryItem[]) => {
    setItems(updated);
    localStorage.setItem("estrella_discover_categories", JSON.stringify(updated));
    window.dispatchEvent(new Event("estrella_discover_categories_updated"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setMessage("📷 Category image selected from laptop gallery!");
        setTimeout(() => setMessage(""), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setSubtitle("");
    setImage("/images/discover-categories/category-1.svg");
    setLink("/categories");
    setIsModalOpen(true);
  };

  const openEditModal = (item: DiscoverCategoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setSubtitle(item.subtitle || "");
    setImage(item.image);
    setLink(item.link || "/categories");
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    let updated: DiscoverCategoryItem[];
    if (editingItem) {
      updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              name,
              subtitle,
              image,
              link,
            }
          : it
      );
      setMessage("✅ Category item updated & saved to homepage!");
    } else {
      const newItem: DiscoverCategoryItem = {
        id: `cat-${Date.now()}`,
        name: name || "New Category",
        subtitle,
        image: image || "/images/discover-categories/category-1.svg",
        link: link || "/categories",
        is_active: true,
      };
      updated = [...items, newItem];
      setMessage("✅ New category added & output updated on homepage!");
    }

    saveItemsState(updated);
    setIsModalOpen(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const toggleActive = (id: string) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, is_active: !it.is_active } : it
    );
    saveItemsState(updated);
    setMessage("✅ Item status updated!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this category item?")) return;
    const updated = items.filter((it) => it.id !== id);
    saveItemsState(updated);
    setMessage("✅ Category item removed!");
    setTimeout(() => setMessage(""), 3000);
  };

  const filteredItems = items.filter((it) =>
    it.name.toLowerCase().includes(search.toLowerCase()) ||
    (it.subtitle || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full">
              Homepage Categories Manager
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Discover Our Categories</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your homepage &quot;Discover Our Categories&quot; slider section. Edit text, replace images from laptop gallery, add or remove categories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition"
        >
          <Plus className="w-5 h-5" /> Add New Category
        </button>
      </div>

      {message && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg font-medium shadow-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 outline-none border border-slate-300 rounded-lg focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
          />
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            {/* Category Image Card */}
            <div className="relative aspect-[16/9] bg-slate-100 border-b border-slate-200 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                Card #{index + 1}
              </span>

              <button
                onClick={() => toggleActive(item.id)}
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-xs transition ${
                  item.is_active !== false
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-400 text-white"
                }`}
              >
                {item.is_active !== false ? "Active" : "Hidden"}
              </button>
            </div>

            {/* Category Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1 uppercase">{item.name}</h3>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                  {item.subtitle || "No subtitle provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#00AEF0] text-sm font-semibold transition"
                >
                  <Edit2 className="w-4 h-4" /> Edit Category
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-sm font-semibold transition"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingItem ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select an image file from your laptop/computer gallery or enter an image URL below.
            </p>

            <form onSubmit={handleSaveForm} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CASUAL WEAR"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Polo Shirts & T-Shirts Collection"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              {/* Laptop Gallery File Picker & Image Placeholder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Banner Image (Upload from Laptop Gallery or Enter URL)
                </label>

                {/* File Upload Placeholder Box */}
                <div className="relative border-2 border-dashed border-slate-300 hover:border-[#00AEF0] bg-slate-50 rounded-xl p-4 text-center transition cursor-pointer group mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 text-[#00AEF0] group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Click or Drag & Drop to Select Image from Laptop
                      </p>
                      <p className="text-xs text-slate-500">Supports SVG, JPG, PNG, WEBP</p>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/discover-categories/category-1.svg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition font-mono text-xs"
                />
              </div>

              {/* Interactive Image Preview Box */}
              {image && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Live Image Preview
                  </label>
                  <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
                    <Image src={image} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Link URL
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/categories/casual-wear"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#00AEF0] hover:bg-[#0095ce] text-white font-semibold shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Category & Update Output
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
