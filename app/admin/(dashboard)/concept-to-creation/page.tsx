"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Save, Image as ImageIcon, CheckCircle2, RotateCcw } from "lucide-react";
import Image from "next/image";
import {
  defaultConceptData,
  ConceptToCreationData,
} from "@/components/home/ConceptToCreationSection";

export default function ConceptToCreationAdminPage() {
  const [data, setData] = useState<ConceptToCreationData>(defaultConceptData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_concept_to_creation");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setData({ ...defaultConceptData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultConceptData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = (
    key: "image1" | "image2" | "image3" | "image4",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setData((prev) => ({
          ...prev,
          [key]: event.target?.result as string,
        }));
        setMessage(`📷 New image selected from laptop gallery for ${key.toUpperCase()}!`);
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_concept_to_creation", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_concept_to_creation_updated"));
    setMessage("✅ From Concept to Creation section changes saved! Output live on homepage.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset this section back to original defaults?")) return;
    setData(defaultConceptData);
    localStorage.setItem(
      "estrella_concept_to_creation",
      JSON.stringify(defaultConceptData)
    );
    window.dispatchEvent(new Event("estrella_concept_to_creation_updated"));
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
            From Concept to Creation Section
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic manager for text, mission/vision headings, red CTA button, and 4 geometric chamfered gallery images.
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
        {/* TEXT CONTENT CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">1. Text Content & Subtitles</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the bold main title, mission & vision subtitles, paragraphs, and red button.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Main Bold Section Title *
            </label>
            <textarea
              rows={3}
              required
              value={data.mainTitle}
              onChange={(e) => setData({ ...data, mainTitle: e.target.value })}
              placeholder="FROM CONCEPT TO CREATION..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-sm outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Mission Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                  Red Subtitle 1 (Mission Heading)
                </label>
                <input
                  type="text"
                  required
                  value={data.subtitle1}
                  onChange={(e) => setData({ ...data, subtitle1: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-sm outline-none focus:border-[#00AEF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Paragraph 1 (Mission Content)
                </label>
                <textarea
                  rows={4}
                  required
                  value={data.desc1}
                  onChange={(e) => setData({ ...data, desc1: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
                />
              </div>
            </div>

            {/* Vision Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                  Red Subtitle 2 (Vision Heading)
                </label>
                <input
                  type="text"
                  required
                  value={data.subtitle2}
                  onChange={(e) => setData({ ...data, subtitle2: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-sm outline-none focus:border-[#00AEF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Paragraph 2 (Vision Content)
                </label>
                <textarea
                  rows={4}
                  required
                  value={data.desc2}
                  onChange={(e) => setData({ ...data, desc2: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                required
                value={data.buttonText}
                onChange={(e) => setData({ ...data, buttonText: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-sm outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                required
                value={data.buttonLink}
                onChange={(e) => setData({ ...data, buttonLink: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>
        </div>

        {/* 4 GEOMETRIC IMAGES CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              2. Dynamic Gallery Images (Laptop File Pickers & Geometric Placeholders)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any placeholder below to pick an image file directly from your laptop gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* IMAGE 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Shape 1 (Left Tall)
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                    Chamfer Bottom-Right
                  </span>
                </div>

                {/* Geometric Preview Box */}
                <div className="relative aspect-[3/4] w-full bg-slate-900 rounded-xl overflow-hidden mb-3 border border-slate-300 shadow-xs">
                  <div
                    className="w-full h-full relative"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 82%, 75% 100%, 0 100%)",
                    }}
                  >
                    <Image
                      src={data.image1}
                      alt="Shape 1"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Laptop File Upload Picker */}
                <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-3 text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("image1", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center gap-2 text-[#00AEF0]">
                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Replace Image from Laptop</span>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={data.image1}
                onChange={(e) => setData({ ...data, image1: e.target.value })}
                placeholder="Image 1 URL"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-[11px] font-mono text-slate-600 outline-none focus:border-[#00AEF0]"
              />
            </div>

            {/* IMAGE 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Shape 2 (Middle Top)
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                    Chamfer Top-Left
                  </span>
                </div>

                {/* Geometric Preview Box */}
                <div className="relative aspect-[4/3] w-full bg-slate-900 rounded-xl overflow-hidden mb-3 border border-slate-300 shadow-xs">
                  <div
                    className="w-full h-full relative"
                    style={{
                      clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%, 0 22%)",
                    }}
                  >
                    <Image
                      src={data.image2}
                      alt="Shape 2"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Laptop File Upload Picker */}
                <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-3 text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("image2", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center gap-2 text-[#00AEF0]">
                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Replace Image from Laptop</span>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={data.image2}
                onChange={(e) => setData({ ...data, image2: e.target.value })}
                placeholder="Image 2 URL"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-[11px] font-mono text-slate-600 outline-none focus:border-[#00AEF0]"
              />
            </div>

            {/* IMAGE 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Shape 3 (Middle Bottom)
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                    Chamfer Bottom-Right
                  </span>
                </div>

                {/* Geometric Preview Box */}
                <div className="relative aspect-[3/4] w-full bg-slate-900 rounded-xl overflow-hidden mb-3 border border-slate-300 shadow-xs">
                  <div
                    className="w-full h-full relative"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
                    }}
                  >
                    <Image
                      src={data.image3}
                      alt="Shape 3"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Laptop File Upload Picker */}
                <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-3 text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("image3", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center gap-2 text-[#00AEF0]">
                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Replace Image from Laptop</span>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={data.image3}
                onChange={(e) => setData({ ...data, image3: e.target.value })}
                placeholder="Image 3 URL"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-[11px] font-mono text-slate-600 outline-none focus:border-[#00AEF0]"
              />
            </div>

            {/* IMAGE 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Shape 4 (Right Tall)
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded">
                    Chamfer Bottom-Left
                  </span>
                </div>

                {/* Geometric Preview Box */}
                <div className="relative aspect-[3/4] w-full bg-slate-900 rounded-xl overflow-hidden mb-3 border border-slate-300 shadow-xs">
                  <div
                    className="w-full h-full relative"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 22% 100%, 0 78%)",
                    }}
                  >
                    <Image
                      src={data.image4}
                      alt="Shape 4"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Laptop File Upload Picker */}
                <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-3 text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("image4", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-center gap-2 text-[#00AEF0]">
                    <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">Replace Image from Laptop</span>
                  </div>
                </div>
              </div>

              <input
                type="text"
                value={data.image4}
                onChange={(e) => setData({ ...data, image4: e.target.value })}
                placeholder="Image 4 URL"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-[11px] font-mono text-slate-600 outline-none focus:border-[#00AEF0]"
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
