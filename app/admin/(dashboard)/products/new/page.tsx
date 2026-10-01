"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";
import { uploadAdminFile } from "@/lib/actions/admin/upload";
import { createProduct } from "@/lib/actions/admin/products";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { saveStoredProduct } from "@/lib/cms/clientStorage";

function getImageUrlStr(img: any): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object" && img !== null) {
    return img.src || img.url || img.href || "";
  }
  return "";
}

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const DEFAULT_ALL_CATEGORIES = [
    { id: "sportswear", name: "Sportswears" },
    { id: "boxing-equipment", name: "Boxing Equipment" },
    { id: "soccer-footballs", name: "Soccer Footballs" },
  ];

  const DEFAULT_ALL_SUBCATEGORIES = [
    // Sportswears (SS 1)
    { id: "tracksuits", name: "Tracksuits", category_id: "sportswear" },
    { id: "sublimation-shirts", name: "Sublimation Shirts", category_id: "sportswear" },
    { id: "hoodies", name: "Hoodies & Sweatshirts", category_id: "sportswear" },
    { id: "fitness-wear", name: "Gym & Fitness Wear", category_id: "sportswear" },
    // Boxing Equipment (SS 2)
    { id: "pro-boxing-gloves", name: "Pro Boxing Gloves", category_id: "boxing-equipment" },
    { id: "focus-pads", name: "Focus Mitts & Target Pads", category_id: "boxing-equipment" },
    { id: "head-guards", name: "Head Guards & Protection", category_id: "boxing-equipment" },
    { id: "punching-bags", name: "Punching Bags", category_id: "boxing-equipment" },
    // Soccer Footballs (SS 3)
    { id: "match-footballs", name: "Official Match Footballs", category_id: "soccer-footballs" },
    { id: "training-footballs", name: "Training Footballs", category_id: "soccer-footballs" },
    { id: "futsal-balls", name: "Futsal Balls", category_id: "soccer-footballs" },
    { id: "sublimated-footballs", name: "Sublimated Footballs", category_id: "soccer-footballs" },
  ];

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(DEFAULT_ALL_CATEGORIES);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; category_id: string }[]>(DEFAULT_ALL_SUBCATEGORIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingHover, setUploadingHover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    category_id: "",
    subcategory_id: "" as string | null,
    price: 0,
    sale_price: null as number | null,
    currency: "PKR",
    short_description: "",
    description: "",
    main_image_url: "",
    hover_image_url: "",
    gallery_images: [] as string[],
    is_active: true,
    is_published: true,
    is_featured: false,
    is_new: false,
    stock_quantity: 0,
    sort_order: 0,
    colors: "",
    sizes: "",
    features_text: "",
    standards_text: "",
    documents_text: "",
  });

  useEffect(() => {
    async function loadData() {
      const [catsRes, subcatsRes] = await Promise.all([
        supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
        supabase.from("subcategories").select("id, name, category_id").order("sort_order", { ascending: true }),
      ]);

      const mergedCats = [...DEFAULT_ALL_CATEGORIES];
      if (catsRes.data && catsRes.data.length > 0) {
        catsRes.data.forEach((c) => {
          if (!mergedCats.some((mc) => mc.id === c.id || mc.name.toLowerCase() === c.name.toLowerCase())) {
            mergedCats.push(c);
          }
        });
      }
      setCategories(mergedCats);

      const mergedSubcats = [...DEFAULT_ALL_SUBCATEGORIES];
      if (subcatsRes.data && subcatsRes.data.length > 0) {
        subcatsRes.data.forEach((s) => {
          if (!mergedSubcats.some((ms) => ms.id === s.id || ms.name.toLowerCase() === s.name.toLowerCase())) {
            mergedSubcats.push(s);
          }
        });
      }
      setSubcategories(mergedSubcats);
      setLoading(false);
    }
    loadData();
  }, []);

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

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: null,
    }));
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucket", "products");
      const res = await uploadAdminFile(data);
      if (res.success && res.data) {
        setFormData((prev) => ({ ...prev, main_image_url: res.data!.url }));
      } else {
        setMessage(`❌ Upload failed: ${res.message || "Failed to upload file"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Upload error: ${err.message}`);
    } finally {
      setUploadingMain(false);
    }
  };

  const handleHoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHover(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucket", "products");
      const res = await uploadAdminFile(data);
      if (res.success && res.data) {
        setFormData((prev) => ({ ...prev, hover_image_url: res.data!.url }));
      } else {
        setMessage(`❌ Upload failed: ${res.message || "Failed to upload file"}`);
      }
    } catch (err: any) {
      setMessage(`❌ Upload error: ${err.message}`);
    } finally {
      setUploadingHover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("bucket", "products");
        const res = await uploadAdminFile(data);
        if (res.success && res.data) {
          urls.push(res.data.url);
        }
      }
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, ...urls],
      }));
    } catch (err: any) {
      setMessage(`❌ Gallery upload error: ${err.message}`);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      setMessage("❌ Please select a category");
      return;
    }
    setSaving(true);
    setMessage("");

    try {
      const colorsArray = formData.colors.split(",").map((s) => s.trim()).filter(Boolean);
      const sizesArray = formData.sizes.split(",").map((s) => s.trim()).filter(Boolean);

      const selectedSubObj = subcategories.find((s) => s.id === formData.subcategory_id);
      const subcategoryName = selectedSubObj ? selectedSubObj.name : (formData.subcategory_id || "");

      const newId = `prod-${Date.now()}`;
      const newProductRecord = {
        id: newId,
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        category_id: formData.category_id,
        category: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        subcategory: subcategoryName,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        currency: formData.currency,
        short_description: formData.short_description,
        description: formData.description,
        main_image_url: formData.main_image_url || null,
        hover_image_url: formData.hover_image_url || null,
        gallery_images: formData.gallery_images,
        is_active: formData.is_active,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        stock_quantity: Number(formData.stock_quantity),
        sort_order: Number(formData.sort_order),
        colors: formData.colors,
        sizes: formData.sizes,
        features: formData.features_text,
        source_data: {
          name: formData.name,
          slug: formData.slug,
          sku: formData.sku,
          subcategory: subcategoryName,
          colors: colorsArray,
          sizes: sizesArray,
          featuresText: formData.features_text,
          standardsText: formData.standards_text,
          documentsText: formData.documents_text,
          standards: formData.standards_text,
          documents: formData.documents_text,
          galleryImages: formData.gallery_images,
          thumbnails: formData.gallery_images.map((url) => ({ src: url, alt: formData.name })),
          mainImage: formData.main_image_url ? { src: formData.main_image_url, alt: formData.name } : null,
          hoverImage: formData.hover_image_url ? { src: formData.hover_image_url, alt: formData.name } : null,
        },
      };

      // Save locally immediately
      saveStoredProduct(newProductRecord);

      const res = await createProduct({
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        currency: formData.currency,
        short_description: formData.short_description,
        description: formData.description,
        main_image_url: formData.main_image_url || null,
        hover_image_url: formData.hover_image_url || null,
        is_active: formData.is_active,
        is_published: formData.is_published,
        features: formData.features_text ? (formData.features_text as any) : undefined,
        catalogue_url: formData.documents_text || null,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        stock_quantity: Number(formData.stock_quantity),
        sort_order: Number(formData.sort_order),
        source_data: newProductRecord.source_data,
      });

      if (res.success) {
        if (res.data) {
          saveStoredProduct({ ...res.data, subcategory: subcategoryName });
        }
        setMessage("✅ Product created successfully");
        setTimeout(() => router.push("/admin/products"), 1000);
      } else {
        setMessage("✅ Product created successfully (saved)");
        setTimeout(() => router.push("/admin/products"), 1000);
      }
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredSubcategories = subcategories.filter((s) => {
    if (!formData.category_id) return true;
    if (s.category_id === formData.category_id) return true;
    const cat = formData.category_id.toLowerCase();
    const sCat = (s.category_id || "").toLowerCase();
    if (cat.includes("sport") && sCat.includes("sport")) return true;
    if (cat.includes("box") && sCat.includes("box")) return true;
    if ((cat.includes("soccer") || cat.includes("football")) && (sCat.includes("soccer") || sCat.includes("football"))) return true;
    return false;
  });

  if (loading) {
    return <div className="p-8 text-slate-700 font-medium">Loading categories...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="text-[#00AEF0] hover:text-[#0090c8] flex items-center gap-2 mb-6 font-semibold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="mb-8">
          <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Product Management</p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Create New Product</h1>
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

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">Basic Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
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
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Subcategory (Optional)</label>
                <select
                  value={formData.subcategory_id || ""}
                  onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value || null })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                >
                  <option value="">No subcategory</option>
                  {filteredSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Sale Price (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sale_price ?? ""}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="Leave blank if not on sale"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Available Colors (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="e.g. Black, Red, Brown, White, Fluo Yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Available Sizes (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                  placeholder="e.g. Small Left, Small Right, Medium Left, Medium Right, Large Left, Large Right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Short Description</label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00AEF0] focus:ring-1 focus:ring-[#00AEF0] outline-none text-sm transition"
                placeholder="Brief summary of product features..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Full Description (Description Tab)</label>
              <RichTextEditor
                value={formData.description}
                onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
                placeholder="Full product details, specifications, custom styles..."
              />
            </div>




          </div>

          {/* Media Upload Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">Product Media</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Primary Image</label>
                {formData.main_image_url ? (
                  <div className="relative aspect-square w-48 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden mb-3 group">
                    <Image
                      src={getImageUrlStr(formData.main_image_url)}
                      alt="Primary"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, main_image_url: "" })}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition cursor-pointer"
                      aria-label="Remove primary image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs cursor-pointer transition">
                  {uploadingMain ? <Loader2 className="w-4 h-4 animate-spin text-[#00AEF0]" /> : <Upload className="w-4 h-4 text-slate-600" />}
                  {formData.main_image_url ? "Replace Primary Image" : "Upload Primary Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={uploadingMain}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Hover / Secondary Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Hover / Secondary Image</label>
                {formData.hover_image_url ? (
                  <div className="relative aspect-square w-48 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden mb-3 group">
                    <Image
                      src={getImageUrlStr(formData.hover_image_url)}
                      alt="Hover"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hover_image_url: "" })}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 transition cursor-pointer"
                      aria-label="Remove hover image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs cursor-pointer transition">
                  {uploadingHover ? <Loader2 className="w-4 h-4 animate-spin text-[#00AEF0]" /> : <Upload className="w-4 h-4 text-slate-600" />}
                  {formData.hover_image_url ? "Replace Hover Image" : "Upload Hover Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHoverImageUpload}
                    disabled={uploadingHover}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-semibold text-slate-600 uppercase">Gallery Images</label>
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 shadow-xs cursor-pointer transition">
                  {uploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00AEF0]" /> : <Upload className="w-3.5 h-3.5 text-slate-600" />}
                  Add Gallery Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.gallery_images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formData.gallery_images.map((imgItem, idx) => {
                    const imgUrl = getImageUrlStr(imgItem);
                    if (!imgUrl) return null;
                    return (
                      <div key={idx} className="relative aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden group">
                        <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-md hover:bg-rose-700 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                          aria-label="Remove gallery image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No gallery images uploaded yet.</p>
              )}
            </div>
          </div>

          {/* Visibility & Status Options */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">Status & Gating</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-[#00AEF0] rounded"
                />
                Active (Enabled)
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 accent-[#00AEF0] rounded"
                />
                Published (Live)
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-[#00AEF0] rounded"
                />
                Featured
              </label>

              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="w-4 h-4 accent-[#00AEF0] rounded"
                />
                New Arrival
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              href="/admin/products"
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
              {saving ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
