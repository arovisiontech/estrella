"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Save,
  Image as ImageIcon,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import {
  defaultParallaxBannerData,
  ParallaxBannerData,
} from "@/components/home/ParallaxBannerSection";

export default function ParallaxBannerAdminPage() {
  const [data, setData] = useState<ParallaxBannerData>(defaultParallaxBannerData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_parallax_banner");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setData({ ...defaultParallaxBannerData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultParallaxBannerData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBgImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setData((prev) => ({
          ...prev,
          bgImage: event.target?.result as string,
        }));
        setMessage("📷 Parallax background image updated from laptop gallery!");
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_parallax_banner", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_parallax_banner_updated"));
    setMessage("✅ Parallax Banner section saved! Output live on homepage.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset Parallax Banner back to original defaults?")) return;
    setData(defaultParallaxBannerData);
    localStorage.setItem(
      "estrella_parallax_banner",
      JSON.stringify(defaultParallaxBannerData)
    );
    window.dispatchEvent(new Event("estrella_parallax_banner_updated"));
    setMessage("🔄 Reset back to original default layout!");
    setTimeout(() => setMessage(""), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00AEF0] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl pb-16">
      {/* Header Bar */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full">
            Homepage Section Manager
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Parallax Banner Section
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic manager for banner title, subtitle, CTA button text/link, and parallax brochure image placeholder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition"
          >
            <Save className="w-4 h-4" /> Save Changes & Update Output
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-xl font-medium shadow-xs flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* TEXT & CTA CONTENT CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">1. Banner Text & Call-To-Action</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit title, subtitle, button text, and destination page link.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Banner Main Title *
            </label>
            <textarea
              rows={2}
              required
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-base outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Banner Subtitle *
            </label>
            <textarea
              rows={2}
              required
              value={data.subtitle}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium text-sm outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                required
                value={data.buttonText}
                onChange={(e) => setData({ ...data, buttonText: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                required
                value={data.buttonLink}
                onChange={(e) => setData({ ...data, buttonLink: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-mono outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>
        </div>

        {/* PARALLAX IMAGE PLACEHOLDER CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              2. Parallax Image Placeholder (Upload File from Laptop Gallery)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or replace the brochure image file directly from your laptop gallery.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-12 items-center">
            {/* Image Preview Box */}
            <div className="md:col-span-6 relative h-56 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
              <Image
                src={data.bgImage}
                alt="Parallax Banner Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white/20 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Live Banner Preview
                </span>
              </div>
            </div>

            {/* Upload Control */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-slate-50 rounded-2xl p-6 text-center transition cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-[#00AEF0] group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold text-slate-800">
                    Click to replace Parallax Banner image from laptop gallery
                  </p>
                  <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP high-resolution photos</p>
                </div>
              </div>

              <input
                type="text"
                value={data.bgImage}
                onChange={(e) => setData({ ...data, bgImage: e.target.value })}
                placeholder="Image URL"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-sky-500/20 transition text-sm"
          >
            <Save className="w-5 h-5" /> Save Changes & Update Output
          </button>
        </div>
      </form>
    </div>
  );
}
