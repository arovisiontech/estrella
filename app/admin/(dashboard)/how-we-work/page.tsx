"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Save,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  RotateCcw,
  Edit2,
} from "lucide-react";
import Image from "next/image";
import {
  defaultHowWeWorkData,
  HowWeWorkData,
  HowWeWorkStep,
} from "@/components/home/HowWeWorkSection";

export default function HowWeWorkAdminPage() {
  const [data, setData] = useState<HowWeWorkData>(defaultHowWeWorkData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_how_we_work");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
          setData({ ...defaultHowWeWorkData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultHowWeWorkData);
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
        setMessage("📷 Background image updated from laptop gallery!");
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStepIconUpload = (
    stepId: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const updatedSteps = data.steps.map((st) =>
          st.id === stepId ? { ...st, icon: event.target?.result as string } : st
        );
        setData((prev) => ({ ...prev, steps: updatedSteps }));
        setMessage("📷 Step icon updated from laptop gallery!");
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateStepField = (
    stepId: string,
    field: "title" | "description" | "icon",
    value: string
  ) => {
    const updatedSteps = data.steps.map((st) =>
      st.id === stepId ? { ...st, [field]: value } : st
    );
    setData((prev) => ({ ...prev, steps: updatedSteps }));
  };

  const addStep = () => {
    const newStep: HowWeWorkStep = {
      id: `step-${Date.now()}`,
      title: "NEW WORK PROCESS",
      description:
        "Describe your technical manufacturing step, client consultation, or quality protocol here.",
      icon: "/images/how-we-work/icon-1.png",
    };
    setData((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
    setMessage("➕ New process step added! Edit details below.");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteStep = (stepId: string) => {
    if (data.steps.length <= 1) {
      alert("At least one process step is required.");
      return;
    }
    if (!confirm("Are you sure you want to remove this process step?")) return;
    const updatedSteps = data.steps.filter((st) => st.id !== stepId);
    setData((prev) => ({ ...prev, steps: updatedSteps }));
    setMessage("🗑️ Process step removed!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_how_we_work", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_how_we_work_updated"));
    setMessage("✅ How We Work section changes saved! Output live on homepage.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (
      !confirm("Are you sure you want to reset How We Work back to original defaults?")
    )
      return;
    setData(defaultHowWeWorkData);
    localStorage.setItem(
      "estrella_how_we_work",
      JSON.stringify(defaultHowWeWorkData)
    );
    window.dispatchEvent(new Event("estrella_how_we_work_updated"));
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
            How We Work Section
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic manager for process steps, titles, descriptions, circular icons, and background image.
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
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-xl font-medium shadow-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION HEADER & BACKGROUND CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">1. Main Title & Background Image</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit section title and upload background workshop image from laptop.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Section Title *
              </label>
              <input
                type="text"
                required
                value={data.sectionTitle}
                onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-extrabold text-base outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>

            {/* Background Image Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Background Image (Upload from Laptop Gallery)
              </label>
              <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-slate-50 rounded-xl p-4 text-center transition cursor-pointer group mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBgImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-7 h-7 text-[#00AEF0] group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-800">
                    Click to replace section background image from laptop
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={data.bgImage}
                onChange={(e) => setData({ ...data, bgImage: e.target.value })}
                placeholder="Image URL"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono text-slate-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* PROCESS STEPS LIST CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                2. Process Steps ({data.steps.length} Steps)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit titles, descriptions, and replace icons directly from laptop gallery.
              </p>
            </div>

            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Process Step
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.steps.map((step, idx) => (
              <div
                key={step.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#00AEF0] bg-sky-100 px-2.5 py-0.5 rounded-md">
                    Step #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteStep(step.id)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Step
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Step Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      required
                      value={step.title}
                      onChange={(e) => updateStepField(step.id, "title", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-extrabold text-sm outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Step Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Step Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={step.description}
                      onChange={(e) => updateStepField(step.id, "description", e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Step Icon File Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Step Icon (Upload from Laptop Gallery)
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Icon Preview */}
                      <div className="h-12 w-12 shrink-0 rounded-full border border-slate-300 bg-slate-900 p-2 flex items-center justify-center">
                        <Image
                          src={step.icon}
                          alt="Icon Preview"
                          width={28}
                          height={28}
                          className="h-6 w-6 object-contain filter invert"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-2.5 text-center transition cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleStepIconUpload(step.id, e)}
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
