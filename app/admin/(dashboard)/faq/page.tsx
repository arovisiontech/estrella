"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import {
  defaultFAQData,
  FAQData,
  FAQItem,
} from "@/components/home/FAQSection";

export default function FAQAdminPage() {
  const [data, setData] = useState<FAQData>(defaultFAQData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = () => {
    setLoading(true);
    const cached = localStorage.getItem("estrella_faq");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
          setData({ ...defaultFAQData, ...parsed });
          setLoading(false);
          return;
        }
      } catch {}
    }
    setData(defaultFAQData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateFAQItem = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    const updatedItems = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "Enter your custom question here?",
      answer: "Provide a detailed and helpful response for your clients here.",
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setMessage("➕ New FAQ item added! Edit question & answer below.");
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteFAQItem = (id: string) => {
    if (data.items.length <= 1) {
      alert("At least one FAQ item is required.");
      return;
    }
    if (!confirm("Are you sure you want to remove this FAQ item?")) return;
    const updatedItems = data.items.filter((item) => item.id !== id);
    setData((prev) => ({ ...prev, items: updatedItems }));
    setMessage("🗑️ FAQ item removed!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_faq", JSON.stringify(data));
    window.dispatchEvent(new Event("estrella_faq_updated"));
    setMessage("✅ FAQ section saved! Output live on homepage.");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset FAQ section back to original defaults?")) return;
    setData(defaultFAQData);
    localStorage.setItem("estrella_faq", JSON.stringify(defaultFAQData));
    window.dispatchEvent(new Event("estrella_faq_updated"));
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
            <HelpCircle className="w-3.5 h-3.5" /> F&Q Section Manager
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic manager for adding, editing, reordering, and deleting questions and answers.
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
        {/* SECTION HEADER TITLES */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">1. FAQ Section Header & Subtitle</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the title and subtitle shown above the question items.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                FAQ Main Title *
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
                FAQ Subtitle *
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

        {/* FAQ ITEMS LIST CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                2. Questions & Answers List ({data.items.length} Questions)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Client can easily add, edit, remove, and update any question and answer.
              </p>
            </div>

            <button
              type="button"
              onClick={addFAQItem}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add New Question
            </button>
          </div>

          <div className="space-y-6">
            {data.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#00AEF0] bg-sky-100 px-2.5 py-0.5 rounded-md">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteFAQItem(item.id)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Question
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Question Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Question *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.question}
                      onChange={(e) => updateFAQItem(item.id, "question", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-extrabold text-sm outline-none focus:border-[#00AEF0]"
                    />
                  </div>

                  {/* Answer Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Detailed Answer *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={item.answer}
                      onChange={(e) => updateFAQItem(item.id, "answer", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs leading-relaxed font-medium outline-none focus:border-[#00AEF0]"
                    />
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
