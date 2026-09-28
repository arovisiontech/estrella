"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Save, Image as ImageIcon, CheckCircle2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { defaultFootballs, FootballItem } from "@/components/home/EliteFootballCollection";

export default function FootballCollectionAdminPage() {
  const [items, setItems] = useState<FootballItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FootballItem | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");

  const loadItems = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_football_collection");
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
    setItems(defaultFootballs);
    localStorage.setItem("estrella_football_collection", JSON.stringify(defaultFootballs));
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItemsState = (updated: FootballItem[]) => {
    setItems(updated);
    localStorage.setItem("estrella_football_collection", JSON.stringify(updated));
    window.dispatchEvent(new Event("estrella_football_collection_updated"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setMessage("📷 Football image selected from laptop gallery!");
        setTimeout(() => setMessage(""), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setCategory("Hybrid Soccer Balls");
    setImage("/images/footballs/football-1.jpg");
    setLink("/categories/soccer-footballs");
    setIsModalOpen(true);
  };

  const openEditModal = (item: FootballItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category || "Hybrid Soccer Balls");
    setImage(item.image);
    setLink(item.link || "/categories/soccer-footballs");
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    let updated: FootballItem[];
    if (editingItem) {
      updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              name,
              category,
              image,
              link,
            }
          : it
      );
      setMessage("✅ Football collection item updated & output saved to homepage!");
    } else {
      const newItem: FootballItem = {
        id: `fb-${Date.now()}`,
        name: name || "New Soccer Ball",
        category: category || "Hybrid Soccer Balls",
        image: image || "/images/footballs/football-1.jpg",
        link: link || "/categories/soccer-footballs",
        is_active: true,
      };
      updated = [...items, newItem];
      setMessage("✅ New football added & output updated on homepage!");
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
    if (!confirm("Are you sure you want to delete this football item?")) return;
    const updated = items.filter((it) => it.id !== id);
    saveItemsState(updated);
    setMessage("✅ Football item removed!");
    setTimeout(() => setMessage(""), 3000);
  };

  const filteredItems = items.filter((it) =>
    it.name.toLowerCase().includes(search.toLowerCase()) ||
    it.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full">
              Homepage Collection Manager
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Elite Football Collection</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your homepage football slider. Edit text, replace images from laptop gallery, add new balls, or remove items.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition"
        >
          <Plus className="w-5 h-5" /> Add New Football
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
            placeholder="Search footballs by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 outline-none border border-slate-300 rounded-lg focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
          />
        </div>
      </div>

      {/* Football Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            {/* Product Image Holder */}
            <div className="relative aspect-square bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-center">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                Item #{index + 1}
              </span>

              <button
                onClick={() => toggleActive(item.id)}
                className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs transition ${
                  item.is_active !== false
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-400 text-white"
                }`}
              >
                {item.is_active !== false ? "Active" : "Hidden"}
              </button>
            </div>

            {/* Product Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">
                  {item.category || "Hybrid Soccer Balls"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1 text-slate-700 hover:text-[#00AEF0] text-xs font-semibold transition"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Item
                </button>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Football Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingItem ? "Edit Football Item" : "Add New Football Item"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select an image file from your laptop/computer gallery or enter an image URL below.
            </p>

            <form onSubmit={handleSaveForm} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hybrid Soccer Balls"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category / Subtitle
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Professional Match Ball"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              {/* Laptop Gallery File Picker & Image Placeholder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Football Image (Upload from Laptop Gallery or Enter URL)
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
                        Click or Drag & Drop to Select Football Image from Laptop
                      </p>
                      <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP, SVG</p>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/footballs/football-1.jpg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition font-mono text-xs"
                />
              </div>

              {/* Interactive Image Preview Box */}
              {image && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Live Image Preview
                  </label>
                  <div className="relative aspect-square max-w-[200px] mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-inner p-2">
                    <Image src={image} alt="Preview" fill className="object-contain p-2" unoptimized />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Link URL
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/categories/soccer-footballs"
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
                  <Save className="w-4 h-4" /> Save Item & Update Output
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
