"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Search, Check, Save, Image as ImageIcon, Eye, Layers } from "lucide-react";
import Image from "next/image";

interface HeroBanner {
  id: string;
  title: string;
  description?: string;
  src: string;
  buttonText?: string;
  buttonUrl?: string;
  is_active: boolean;
  sort_order: number;
}

const placeholderBanners = [
  {
    title: "Estrella Surgical & Medical Instruments",
    description: "German Stainless Steel CE & ISO Certified Quality.",
    src: "/images/hero-banner-1.jpg",
    buttonText: "View Range",
    buttonUrl: "/categories/surgical-instruments",
  },
  {
    title: "Estrella Custom Sublimation Sportswear",
    description: "Custom Sublimation Sports Apparel for Teams & Clubs.",
    src: "/images/hero-banner-2.jpg",
    buttonText: "Custom Orders",
    buttonUrl: "/categories/sportswear",
  },
  {
    title: "Estrella Quality Craftsmanship & Values",
    description: "Quality, Craftsmanship, Honesty, and Teamwork.",
    src: "/images/hero-banner-3.jpg",
    buttonText: "Learn More",
    buttonUrl: "/about",
  },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  const supabase = createClient();

  const loadBanners = async () => {
    setLoading(true);

    // Load from localStorage cache first
    const cached = localStorage.getItem("estrella_admin_hero_slides");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out legacy SVG paths
          const cleaned = parsed.map((b: any, i: number) => {
            if (!b.src || b.src.endsWith(".svg") || b.src.includes("banner-")) {
              return { ...b, src: placeholderBanners[i % 3].src };
            }
            return b;
          });
          setBanners(cleaned);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // Try Supabase fetch
    try {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((b: any, index: number) => {
          let src = b.image_url || b.video_url || placeholderBanners[index % 3].src;
          if (src.endsWith(".svg") || src.includes("banner-")) {
            src = placeholderBanners[index % 3].src;
          }
          return {
            id: b.id || `banner-${index}`,
            title: b.title || placeholderBanners[index % 3].title,
            description: b.description || placeholderBanners[index % 3].description,
            src,
            buttonText: b.button_text || "",
            buttonUrl: b.button_url || "",
            is_active: b.is_active ?? true,
            sort_order: b.sort_order ?? index,
          };
        });
        setBanners(mapped);
        localStorage.setItem("estrella_admin_hero_slides", JSON.stringify(mapped));
      } else {
        const defaults: HeroBanner[] = placeholderBanners.map((p, i) => ({
          id: `banner-${i + 1}`,
          title: p.title,
          description: p.description,
          src: p.src,
          buttonText: p.buttonText,
          buttonUrl: p.buttonUrl,
          is_active: true,
          sort_order: i,
        }));
        setBanners(defaults);
        localStorage.setItem("estrella_admin_hero_slides", JSON.stringify(defaults));
      }
    } catch (e) {
      const defaults: HeroBanner[] = placeholderBanners.map((p, i) => ({
        id: `banner-${i + 1}`,
        title: p.title,
        description: p.description,
        src: p.src,
        buttonText: p.buttonText,
        buttonUrl: p.buttonUrl,
        is_active: true,
        sort_order: i,
      }));
      setBanners(defaults);
      localStorage.setItem("estrella_admin_hero_slides", JSON.stringify(defaults));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const saveBannersState = (updated: HeroBanner[]) => {
    setBanners(updated);
    localStorage.setItem("estrella_admin_hero_slides", JSON.stringify(updated));
    window.dispatchEvent(new Event("estrella_hero_slides_updated"));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        setMessage("📷 Image selected from laptop gallery!");
        setTimeout(() => setMessage(""), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle("");
    setDescription("");
    setImageSrc("/images/hero-banner-1.jpg");
    setButtonText("View Range");
    setButtonUrl("/categories");
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setDescription(banner.description || "");
    setImageSrc(banner.src);
    setButtonText(banner.buttonText || "");
    setButtonUrl(banner.buttonUrl || "");
    setIsModalOpen(true);
  };

  const handleSelectPlaceholder = (p: typeof placeholderBanners[0]) => {
    setTitle(p.title);
    setDescription(p.description);
    setImageSrc(p.src);
    setButtonText(p.buttonText);
    setButtonUrl(p.buttonUrl);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    let updated: HeroBanner[];
    if (editingBanner) {
      updated = banners.map((b) =>
        b.id === editingBanner.id
          ? {
              ...b,
              title,
              description,
              src: imageSrc,
              buttonText,
              buttonUrl,
            }
          : b
      );
      setMessage("✅ Hero banner updated & saved to homepage!");
    } else {
      const newBanner: HeroBanner = {
        id: `banner-${Date.now()}`,
        title: title || "New Hero Banner",
        description,
        src: imageSrc || "/images/hero-banner-1.jpg",
        buttonText,
        buttonUrl,
        is_active: true,
        sort_order: banners.length,
      };
      updated = [...banners, newBanner];
      setMessage("✅ New banner added & output updated on homepage!");
    }

    saveBannersState(updated);
    setIsModalOpen(false);
    setTimeout(() => setMessage(""), 3500);
  };

  const toggleActive = (id: string) => {
    const updated = banners.map((b) =>
      b.id === id ? { ...b, is_active: !b.is_active } : b
    );
    saveBannersState(updated);
    setMessage("✅ Banner status updated!");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteBanner = (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;
    const updated = banners.filter((b) => b.id !== id);
    saveBannersState(updated);
    setMessage("✅ Banner removed!");
    setTimeout(() => setMessage(""), 3000);
  };

  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full">
              Hero Section Manager
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Hero Banners Slider</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your homepage hero banners slider. Edit text, replace images from laptop gallery, or add new slides.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition"
        >
          <Plus className="w-5 h-5" /> Add New Banner
        </button>
      </div>

      {message && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg font-medium shadow-xs">
          {message}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search banners by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 outline-none border border-slate-300 rounded-lg focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
          />
        </div>
      </div>

      {/* Banners Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredBanners.map((banner, index) => (
          <div
            key={banner.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
          >
            {/* Banner Preview Image */}
            <div className="relative aspect-[16/8] bg-slate-100 border-b border-slate-200 overflow-hidden">
              <Image
                src={banner.src}
                alt={banner.title}
                fill
                className="object-cover"
                unoptimized
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                Slide #{index + 1}
              </span>

              <button
                onClick={() => toggleActive(banner.id)}
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm transition ${
                  banner.is_active
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-400 text-white"
                }`}
              >
                {banner.is_active ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Banner Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{banner.title}</h3>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                  {banner.description || "No description provided."}
                </p>

                {banner.buttonText && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#00AEF0]">
                    <span>Button: {banner.buttonText}</span>
                    <span className="text-slate-400">({banner.buttonUrl || "/"})</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => openEditModal(banner)}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-[#00AEF0] text-sm font-semibold transition"
                >
                  <Edit2 className="w-4 h-4" /> Edit Banner
                </button>

                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-sm font-semibold transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingBanner ? "Edit Hero Banner" : "Add New Hero Banner"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select an image file from your laptop/computer gallery or enter an image URL below.
            </p>

            {/* Placeholder Quick Selector */}
            <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
              <p className="text-xs font-bold text-[#00AEF0] uppercase tracking-wider mb-2">
                Quick Preset Banners (3 Templates):
              </p>
              <div className="grid grid-cols-3 gap-2">
                {placeholderBanners.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectPlaceholder(p)}
                    className="p-2 bg-white border border-slate-300 rounded-lg hover:border-[#00AEF0] text-left transition"
                  >
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{p.title}</p>
                    <span className="text-[10px] text-sky-600 font-semibold">Preset Banner {i + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveForm} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Banner Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Estrella Surgical & Medical Instruments"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. German Stainless Steel CE & ISO Certified Quality"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
                />
              </div>

              {/* Laptop Gallery File Picker & Image Placeholder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Banner Image (Upload from Laptop Gallery or Enter URL)
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
                      <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP, SVG</p>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={imageSrc}
                  onChange={(e) => setImageSrc(e.target.value)}
                  placeholder="/images/hero-banner-1.jpg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition font-mono text-xs"
                />
              </div>

              {/* Interactive Image Preview Box */}
              {imageSrc && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Live Image Preview
                  </label>
                  <div className="relative aspect-[1648/640] bg-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-inner">
                    <Image src={imageSrc} alt="Preview" fill className="object-contain w-full h-full" unoptimized />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="e.g. View Range"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Button Link URL
                  </label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="/categories"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 outline-none focus:border-[#00AEF0]"
                  />
                </div>
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
                  <Save className="w-4 h-4" /> Save Changes & Update Output
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
