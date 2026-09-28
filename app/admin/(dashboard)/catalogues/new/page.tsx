"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Upload, FileText, X, Loader2, BookOpen } from "lucide-react";
import { createCatalogue } from "@/lib/actions/admin/catalogues";

export default function NewCataloguePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    cover_image_url: "",
    is_active: true,
    sort_order: 0,
  });

  // Reliable API File Upload for heavy PDFs & Images
  const uploadFileDirectly = async (
    file: File,
    folder = "pdf-files"
  ): Promise<{ success: boolean; url?: string; message?: string }> => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", folder);
      data.append("bucket", "catalogues");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json && json.success && json.url) {
        return { success: true, url: json.url };
      }
      return {
        success: false,
        message: json?.message || "File upload failed.",
      };
    } catch (err: any) {
      console.error("Upload API call error:", err);
      return {
        success: false,
        message: err?.message || "Network error uploading file.",
      };
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    setMessage("");
    try {
      const res = await uploadFileDirectly(file, "pdf-files");
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          file_url: res.url!,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
        setMessage("✅ PDF file uploaded successfully!");
      } else {
        setMessage(`❌ Upload failed: ${res.message || "Failed to upload PDF"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Upload error: ${err.message}`);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setMessage("");
    try {
      const res = await uploadFileDirectly(file, "cover-images");
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, cover_image_url: res.url! }));
        setMessage("✅ Cover image uploaded successfully!");
      } else {
        setMessage(`❌ Cover upload failed: ${res.message || "Failed to upload cover"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Cover upload error: ${err.message}`);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file_url) {
      setMessage("❌ Please upload a Catalogue PDF file");
      return;
    }
    setSaving(true);
    setMessage("");

    try {
      const res = await createCatalogue({
        title: formData.title,
        description: formData.description || null,
        file_url: formData.file_url,
        cover_image_url: formData.cover_image_url || null,
        is_active: formData.is_active,
        sort_order: Number(formData.sort_order),
      });

      if (res.success) {
        setMessage("✅ Catalogue created successfully");
        setTimeout(() => router.push("/admin/catalogues"), 1000);
      } else {
        setMessage(`❌ Error: ${res.message || "Failed to create catalogue"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link
        href="/admin/catalogues"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#00AEF0] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalogues
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-1 rounded-full">
          Catalogue Management
        </span>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">Upload New Catalogue</h1>
        <p className="text-slate-500 text-sm mt-1">Upload PDF brochures, manuals, or product catalogues of any file size.</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-bold shadow-xs ${
            message.includes("✅") ? "bg-sky-50 border border-sky-200 text-[#00AEF0]" : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#00AEF0]" /> Catalogue Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Catalogue Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Estrella Sportswear Catalogue 2026"
                className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm font-medium transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm font-medium transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Brief summary of this PDF catalogue..."
                className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#00AEF0] focus:bg-white outline-none text-sm font-medium transition"
              />
            </div>
          </div>
        </div>

        {/* Files Upload Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#00AEF0]" /> PDF Document & Cover Image
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PDF File Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Catalogue PDF File *</label>
              {formData.file_url ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-50 border border-sky-100 mb-3">
                  <FileText className="w-8 h-8 text-[#00AEF0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-900 truncate font-bold">{formData.file_url.split("/").pop()}</p>
                    <div className="flex items-center gap-2 text-[11px] mt-1">
                      <a
                        href={formData.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00AEF0] font-bold hover:underline"
                      >
                        Preview PDF File
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, file_url: "" })}
                    className="text-slate-400 hover:text-red-600 p-1"
                    aria-label="Remove PDF"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00AEF0] hover:bg-[#0095ce] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-sky-500/20 transition">
                {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {formData.file_url ? "Replace PDF File" : "Upload Heavy PDF File"}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploadingPdf}
                  className="hidden"
                />
              </label>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Cover Image (Optional)</label>
              {formData.cover_image_url ? (
                <div className="relative aspect-[3/4] w-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden mb-3 group">
                  <Image
                    src={formData.cover_image_url}
                    alt="Cover Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image_url: "" })}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                    aria-label="Remove cover image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition">
                {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {formData.cover_image_url ? "Replace Cover Image" : "Upload Cover Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Visibility Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">Status & Visibility</h2>
          <label className="flex items-center gap-3 text-sm text-slate-700 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 accent-[#00AEF0] rounded"
            />
            Active (Visible on public /catalogue page for users to view/download)
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/admin/catalogues"
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0095ce] disabled:bg-slate-300 text-white text-sm font-bold px-8 py-2.5 rounded-xl shadow-md shadow-sky-500/20 transition"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Create Catalogue"}
          </button>
        </div>
      </form>
    </div>
  );
}
