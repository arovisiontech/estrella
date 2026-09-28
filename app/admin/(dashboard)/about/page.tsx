"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Save,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import { defaultAboutUsData, AboutUsFullData } from "@/components/about/AboutUsData";

const HONEYCOMB_PLACEMENTS = [
  { key: "center", label: "1. Center Hexagon (Main Center Image)" },
  { key: "top", label: "2. Top Small Hexagon" },
  { key: "upper-left", label: "3. Upper Left Hexagon" },
  { key: "upper-[#00AEF0]", label: "4. Upper Right Hexagon" },
  { key: "lower-left", label: "5. Lower Left Hexagon" },
  { key: "lower-right", label: "6. Lower Right Hexagon" },
  { key: "bottom", label: "7. Bottom Small Hexagon" },
];

export default function AboutUsAdminPage() {
  const [data, setData] = useState<AboutUsFullData>(defaultAboutUsData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_about_page");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setData({ ...defaultAboutUsData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultAboutUsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGalleryUpload = (
    placementKey: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newSrc = event.target.result as string;
        const updatedGallery = data.gallery.map((item) =>
          item.placement === placementKey ? { ...item, src: newSrc } : item
        );
        setData((prev) => ({ ...prev, gallery: updatedGallery }));
        setMessage(`📷 Honeycomb image for ${placementKey.toUpperCase()} updated from laptop gallery!`);
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateOffer = (idx: number, val: string) => {
    const updated = [...data.whoWeAreOffers];
    updated[idx] = val;
    setData({ ...data, whoWeAreOffers: updated });
  };

  const addOffer = () => {
    setData({
      ...data,
      whoWeAreOffers: [...data.whoWeAreOffers, "NEW SERVICE OFFERING ITEM"],
    });
  };

  const deleteOffer = (idx: number) => {
    const updated = data.whoWeAreOffers.filter((_, i) => i !== idx);
    setData({ ...data, whoWeAreOffers: updated });
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_about_page", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_about_page_updated"));
    setMessage("✅ About Us page section-by-section changes saved! Output live on /about.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset About Us page back to original defaults?")) return;
    setData(defaultAboutUsData);
    localStorage.setItem("estrella_about_page", JSON.stringify(defaultAboutUsData));
    window.dispatchEvent(new Event("estrella_about_page_updated"));
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
          <span className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <BookOpen className="w-3.5 h-3.5" /> About Us Page Manager
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            About Us Page CMS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Section-by-section dynamic manager for text, headings, offers, and 7 honeycomb hexagon gallery photos.
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
        {/* SECTION 1: HERO INTRO & 7 HONEYCOMB HEXAGON GALLERY */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              1. Hero Intro & 7 Honeycomb Hexagon Gallery Photos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit experience badge, location text, main heading, and replace all 7 hexagon images directly from laptop gallery.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Experience Count (Years)
              </label>
              <input
                type="text"
                required
                value={data.yearsValue}
                onChange={(e) => setData({ ...data, yearsValue: e.target.value })}
                placeholder="40+"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-base outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Experience Label
              </label>
              <input
                type="text"
                required
                value={data.yearsLabel}
                onChange={(e) => setData({ ...data, yearsLabel: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Subheading / Location Text
              </label>
              <input
                type="text"
                required
                value={data.locationText}
                onChange={(e) => setData({ ...data, locationText: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Main Bold Heading *
            </label>
            <textarea
              rows={2}
              required
              value={data.mainHeading}
              onChange={(e) => setData({ ...data, mainHeading: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm outline-none focus:border-[#00AEF0]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Body Paragraph 1 *
              </label>
              <textarea
                rows={3}
                required
                value={data.paragraph1}
                onChange={(e) => setData({ ...data, paragraph1: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Body Paragraph 2 *
              </label>
              <textarea
                rows={3}
                required
                value={data.paragraph2}
                onChange={(e) => setData({ ...data, paragraph2: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>

          {/* 7 HEXAGON GALLERY IMAGE PLACEHOLDERS FROM LAPTOP GALLERY */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Honeycomb Gallery Images (7 Hexagons)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {data.gallery.map((item) => (
                <div key={item.placement} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-extrabold text-[#00AEF0] uppercase">
                    {item.placement}
                  </span>

                  {/* Hexagon Preview Box */}
                  <div className="relative aspect-square w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Laptop File Upload Picker */}
                  <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-2.5 text-center transition cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleGalleryUpload(item.placement, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center justify-center gap-1.5 text-[#00AEF0]">
                      <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">Replace from Laptop</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: OUR APPROACH */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">2. Our Approach Section</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit eyebrow label, main heading, and approach description.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Eyebrow Label
              </label>
              <input
                type="text"
                required
                value={data.approachEyebrow}
                onChange={(e) => setData({ ...data, approachEyebrow: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Approach Heading
              </label>
              <input
                type="text"
                required
                value={data.approachHeading}
                onChange={(e) => setData({ ...data, approachHeading: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-sm outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Approach Description Paragraph
            </label>
            <textarea
              rows={3}
              required
              value={data.approachDescription}
              onChange={(e) => setData({ ...data, approachDescription: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs leading-relaxed outline-none focus:border-[#00AEF0]"
            />
          </div>
        </div>

        {/* SECTION 3: TABS CONTENT */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">3. Tab Content (Who We Are, Production, Our Value)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the content for each tab shown on the About Us page.
            </p>
          </div>

          {/* TAB 1: WHO WE ARE */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold uppercase text-[#00AEF0]">Tab 1: Who We Are</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Paragraph Text
              </label>
              <textarea
                rows={3}
                required
                value={data.whoWeAreText}
                onChange={(e) => setData({ ...data, whoWeAreText: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Bullet Points (We Proudly Offer)
                </label>
                <button
                  type="button"
                  onClick={addOffer}
                  className="text-xs font-bold text-emerald-600 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Offer
                </button>
              </div>

              <div className="space-y-2">
                {data.whoWeAreOffers.map((offer, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={offer}
                      onChange={(e) => updateOffer(idx, e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-semibold outline-none focus:border-[#00AEF0]"
                    />
                    <button
                      type="button"
                      onClick={() => deleteOffer(idx)}
                      className="p-2 text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB 2: PRODUCTION FACILITY & WORKFORCE */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold uppercase text-[#00AEF0]">Tab 2: Production Facility & Workforce</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <input
                  type="text"
                  value={data.productionTitle1}
                  onChange={(e) => setData({ ...data, productionTitle1: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-slate-900 mb-2 outline-none"
                />
                <textarea
                  rows={3}
                  value={data.productionDesc1}
                  onChange={(e) => setData({ ...data, productionDesc1: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={data.productionTitle2}
                  onChange={(e) => setData({ ...data, productionTitle2: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-slate-900 mb-2 outline-none"
                />
                <textarea
                  rows={3}
                  value={data.productionDesc2}
                  onChange={(e) => setData({ ...data, productionDesc2: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={data.productionTitle3}
                  onChange={(e) => setData({ ...data, productionTitle3: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-slate-900 mb-2 outline-none"
                />
                <textarea
                  rows={3}
                  value={data.productionDesc3}
                  onChange={(e) => setData({ ...data, productionDesc3: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* TAB 3: OUR VALUE */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold uppercase text-[#00AEF0]">Tab 3: Our Value</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <input
                  type="text"
                  value={data.value1Title}
                  onChange={(e) => setData({ ...data, value1Title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-[#00AEF0] mb-2 outline-none"
                />
                <textarea
                  rows={3}
                  value={data.value1Desc}
                  onChange={(e) => setData({ ...data, value1Desc: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={data.value2Title}
                  onChange={(e) => setData({ ...data, value2Title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-[#00AEF0] mb-2 outline-none"
                />
                <textarea
                  rows={3}
                  value={data.value2Desc}
                  onChange={(e) => setData({ ...data, value2Desc: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={data.value3Title}
                  onChange={(e) => setData({ ...data, value3Title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-bold text-xs text-[#00AEF0] mb-2 outline-none"
                />
                <textarea
                  rows={3}
                  value={data.value3Desc}
                  onChange={(e) => setData({ ...data, value3Desc: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 outline-none"
                />
              </div>
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
