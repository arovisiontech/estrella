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
  defaultManufacturingProcessData,
  ManufacturingProcessData,
  ManufacturingStep,
} from "@/components/home/ManufacturingProcessSection";

export default function ManufacturingProcessAdminPage() {
  const [data, setData] = useState<ManufacturingProcessData>(defaultManufacturingProcessData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_manufacturing_process");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
          setData({ ...defaultManufacturingProcessData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultManufacturingProcessData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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
        setMessage("📷 Process step icon updated from laptop gallery!");
        setTimeout(() => setMessage(""), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateStepTitle = (stepId: string, value: string) => {
    const updatedSteps = data.steps.map((st) =>
      st.id === stepId ? { ...st, title: value } : st
    );
    setData((prev) => ({ ...prev, steps: updatedSteps }));
  };

  const addStep = () => {
    const newStep: ManufacturingStep = {
      id: `step-${Date.now()}`,
      title: "New Process Step",
      iconType: "receiving",
    };
    setData((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
    setMessage("➕ New process hexagon step added!");
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
    localStorage.setItem("estrella_manufacturing_process", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_manufacturing_process_updated"));
    setMessage("✅ Our Manufacturing Process section saved! Output live on homepage.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset this section back to original defaults?")) return;
    setData(defaultManufacturingProcessData);
    localStorage.setItem(
      "estrella_manufacturing_process",
      JSON.stringify(defaultManufacturingProcessData)
    );
    window.dispatchEvent(new Event("estrella_manufacturing_process_updated"));
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
            Our Manufacturing Process Section
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic manager for process titles, description, hexagon steps, icons, and laptop gallery image placeholders.
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
        {/* SECTION TITLES & DESCRIPTION CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">1. Section Title & Description</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit title and overview text for the manufacturing process.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Section Title *
            </label>
            <input
              type="text"
              required
              value={data.sectionTitle}
              onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-black text-base uppercase outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Section Description / Overview Paragraph *
            </label>
            <textarea
              rows={3}
              required
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium text-sm leading-relaxed outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>
        </div>

        {/* HEXAGON PROCESS STEPS LIST */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                2. Hexagon Process Steps ({data.steps.length} Steps)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Edit hexagon titles and replace icons directly from laptop gallery.
              </p>
            </div>

            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add Hexagon Step
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {data.steps.map((step, idx) => (
              <div
                key={step.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ea580c] bg-orange-100 px-2 py-0.5 rounded">
                    Step #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteStep(step.id)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 text-center">
                  {/* Step Title Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      required
                      value={step.title}
                      onChange={(e) => updateStepTitle(step.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-center text-slate-900 font-extrabold text-xs outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Icon File Upload Box */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Icon Image (Laptop Picker)
                    </label>
                    <div className="relative border-2 border-dashed border-sky-300 hover:border-[#00AEF0] bg-white rounded-xl p-2 text-center transition cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStepIconUpload(step.id, e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-1 text-[#00AEF0]">
                        <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold">Replace Icon</span>
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
