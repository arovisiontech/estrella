"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Save,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import {
  defaultWhoWeManufactureForData,
  WhoWeManufactureForData,
  WhoWeManufactureForCard,
} from "@/components/home/WhoWeManufactureForSection";

export default function WhoWeManufactureForAdminPage() {
  const [data, setData] = useState<WhoWeManufactureForData>(defaultWhoWeManufactureForData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_who_we_manufacture_for");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.cards)) {
          setData({ ...defaultWhoWeManufactureForData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultWhoWeManufactureForData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCardIconUpload = (
    cardId: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const updatedCards = data.cards.map((c) =>
          c.id === cardId ? { ...c, icon: event.target?.result as string } : c
        );
        setData((prev) => ({ ...prev, cards: updatedCards }));
        setMessage("📷 Card icon/image updated from laptop gallery!");
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateCardField = (
    cardId: string,
    field: "title" | "description" | "badgesText",
    value: string
  ) => {
    const updatedCards = data.cards.map((c) => {
      if (c.id === cardId) {
        if (field === "badgesText") {
          const badgeArray = value.split(",").map((s) => s.trim()).filter(Boolean);
          return { ...c, badges: badgeArray };
        }
        return { ...c, [field]: value };
      }
      return c;
    });
    setData((prev) => ({ ...prev, cards: updatedCards }));
  };

  const addCard = () => {
    const newCard: WhoWeManufactureForCard = {
      id: `card-${Date.now()}`,
      title: "New Target Client Sector",
      description:
        "Describe your custom manufacturing services, MOQs, OEM capabilities, and target industry sector here.",
      iconType: "shirt",
      badges: ["Custom Line", "Flexible MOQ"],
    };
    setData((prev) => ({ ...prev, cards: [...prev.cards, newCard] }));
    setMessage("➕ New section card added! Edit details below.");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteCard = (cardId: string) => {
    if (data.cards.length <= 1) {
      alert("At least one target client card is required.");
      return;
    }
    if (!confirm("Are you sure you want to remove this client sector card?")) return;
    const updatedCards = data.cards.filter((c) => c.id !== cardId);
    setData((prev) => ({ ...prev, cards: updatedCards }));
    setMessage("🗑️ Client sector card removed!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_who_we_manufacture_for", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_who_we_manufacture_for_updated"));
    setMessage("✅ Who We Manufacture For section saved! Output live on homepage.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset this section back to original defaults?")) return;
    setData(defaultWhoWeManufactureForData);
    localStorage.setItem(
      "estrella_who_we_manufacture_for",
      JSON.stringify(defaultWhoWeManufactureForData)
    );
    window.dispatchEvent(new Event("estrella_who_we_manufacture_for_updated"));
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
            Who We Manufacture For Section
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic manager for sector titles, descriptions, badges, icons, and laptop gallery image placeholders.
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
        {/* HEADER TITLES CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">1. Section Main Heading & Subtitle</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the title and subtitle shown above the 4 target client cards.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Section Main Title *
              </label>
              <input
                type="text"
                required
                value={data.sectionTitle}
                onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-base outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Section Subtitle *
              </label>
              <input
                type="text"
                required
                value={data.sectionSubtitle}
                onChange={(e) => setData({ ...data, sectionSubtitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium text-sm outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>
          </div>
        </div>

        {/* TARGET CARDS LIST */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                2. Target Sector Cards ({data.cards.length} Cards)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit titles, descriptions, badges, and upload custom icons/images directly from laptop gallery.
              </p>
            </div>

            <button
              type="button"
              onClick={addCard}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Sector Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.cards.map((card, idx) => (
              <div
                key={card.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#00AEF0] bg-sky-100 px-2.5 py-0.5 rounded-md">
                    Card #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteCard(card.id)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Card
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Card Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      required
                      value={card.title}
                      onChange={(e) => updateCardField(card.id, "title", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-extrabold text-sm outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Card Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={card.description}
                      onChange={(e) => updateCardField(card.id, "description", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Badges / Tags */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Badges / Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={card.badges.join(", ")}
                      onChange={(e) => updateCardField(card.id, "badgesText", e.target.value)}
                      placeholder="e.g. Full Sublimation, Flexible MOQ"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-medium outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Card Icon File Picker from Laptop Gallery */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Card Icon (Upload Image from Laptop Gallery)
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Icon Preview */}
                      <div className="h-12 w-12 shrink-0 rounded-full border border-slate-300 bg-[#18182b] p-2 flex items-center justify-center">
                        {card.icon ? (
                          <Image
                            src={card.icon}
                            alt="Icon Preview"
                            width={28}
                            height={28}
                            className="h-6 w-6 object-contain filter invert"
                            unoptimized
                          />
                        ) : (
                          <span className="text-white text-xs font-bold">ICON</span>
                        )}
                      </div>

                      <div className="flex-1 relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-2.5 text-center transition cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCardIconUpload(card.id, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex items-center justify-center gap-2 text-[#00AEF0]">
                          <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">Replace Icon from Laptop</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
