"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";
import { createDepartment } from "@/lib/actions/admin/departments";
import { uploadAdminFile } from "@/lib/actions/admin/upload";

export default function NewDepartmentPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    image_url: "",
    is_active: true,
    sort_order: 1,
  });

  const handleNameChange = (name: string) => {
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setFormData((prev) => {
      const prevGenerated = prev.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const shouldUpdateSlug = !prev.slug || prev.slug === prevGenerated;
      return {
        ...prev,
        name,
        slug: shouldUpdateSlug ? generatedSlug : prev.slug,
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucket", "site-assets");
      const res = await uploadAdminFile(data);
      if (res.success && res.data) {
        setFormData((prev) => ({ ...prev, image_url: res.data!.url }));
      } else {
        setMessage(`❌ Upload failed: ${res.message || "Failed to upload image"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage("❌ Name is required");
      return;
    }
    if (!formData.slug.trim()) {
      setMessage("❌ Slug is required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const result = await createDepartment({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description,
        short_description: formData.short_description,
        image_url: formData.image_url || "/images/banner.png",
        is_active: formData.is_active,
        sort_order: Number(formData.sort_order),
      });

      if (result.success) {
        setMessage("✅ Department created successfully");
        setTimeout(() => router.push("/admin/departments"), 1200);
      } else {
        setMessage(`❌ ${result.message || "Failed to create department"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/departments"
          className="text-[#00AEF0] hover:text-[#0090c8] flex items-center gap-2 mb-6 font-semibold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </Link>

        <div className="mb-8">
          <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Department Management</p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Add New Department</h1>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
              message.includes("✅") ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">Department Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Department Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="e.g. Quality Control"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="e.g. quality-control"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="Brief summary of department operations..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Full Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="Detailed workflow, capabilities, equipment, and standards..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Department Image Upload */}
            <div className="border-t border-slate-200 pt-6">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Department Banner / Image</label>
              {formData.image_url ? (
                <div className="relative aspect-video w-64 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden mb-3 group">
                  <Image src={formData.image_url} alt="Department" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: "" })}
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs cursor-pointer transition">
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-[#00AEF0]" /> : <Upload className="w-4 h-4 text-slate-600" />}
                {formData.image_url ? "Replace Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">Visibility & Status</h2>
            <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 accent-[#00AEF0] rounded"
              />
              Active (Visible in header dropdown & public website)
            </label>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/departments"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 transition shadow-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] disabled:bg-slate-300 text-white text-sm font-semibold px-8 py-2.5 rounded-lg transition shadow cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
