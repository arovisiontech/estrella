"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Sparkles, Upload, Trash2, Plus, Loader2, Check, ExternalLink, Image as ImageIcon } from "lucide-react";
import { uploadAdminFile } from "@/lib/actions/admin/upload";
import { updateProductHighlights, type ProductHighlightItem } from "@/lib/actions/admin/products";

interface ProductHighlightsModalProps {
  product: {
    id: string;
    name: string;
    sku: string;
    slug: string;
    main_image_url?: string;
    source_data?: any;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (productId: string, updatedHighlights: ProductHighlightItem[]) => void;
}

export default function ProductHighlightsModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductHighlightsModalProps) {
  const [highlights, setHighlights] = useState<ProductHighlightItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!product || !isOpen) return;

    setMessage(null);
    const existing = product.source_data?.highlights;

    if (Array.isArray(existing) && existing.length > 0) {
      setHighlights(
        existing.map((h: any) => ({
          image: {
            src: (typeof h.image === "object" ? h.image?.src : h.image) || h.icon || "",
            alt: (typeof h.image === "object" ? h.image?.alt : "") || h.title || product.name,
          },
          title: h.title || "",
          description: h.description || "",
          is_custom: true,
        }))
      );
    } else {
      // Default to 3 empty/starter highlight slots as requested
      setHighlights([
        { image: { src: "", alt: `${product.name} Highlight 1` }, title: "", description: "", is_custom: true },
        { image: { src: "", alt: `${product.name} Highlight 2` }, title: "", description: "", is_custom: true },
        { image: { src: "", alt: `${product.name} Highlight 3` }, title: "", description: "", is_custom: true },
      ]);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleTextChange = (index: number, field: "title" | "description", value: string) => {
    setHighlights((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleImageUrlChange = (index: number, src: string) => {
    setHighlights((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        image: {
          src: src.trim(),
          alt: updated[index].title || product.name || "Highlight",
        },
      };
      return updated;
    });
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    setUploadingIndex(index);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("bucket", "products");

      const res = await uploadAdminFile(data);
      if (res.success && res.data?.url) {
        handleImageUrlChange(index, res.data.url);
        setMessage({ type: "success", text: `Highlight #${index + 1} image uploaded successfully!` });
      } else {
        setMessage({ type: "error", text: `Upload failed: ${res.message || "Unknown error"}` });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `Upload error: ${err.message}` });
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    handleImageUrlChange(index, "");
  };

  const handleRemoveCard = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCard = () => {
    setHighlights((prev) => [
      ...prev,
      {
        image: { src: "", alt: `${product.name} Highlight ${prev.length + 1}` },
        title: "",
        description: "",
        is_custom: true,
      },
    ]);
  };

  const handleResetThreeSlots = () => {
    setHighlights([
      { image: { src: "", alt: `${product.name} Highlight 1` }, title: "", description: "", is_custom: true },
      { image: { src: "", alt: `${product.name} Highlight 2` }, title: "", description: "", is_custom: true },
      { image: { src: "", alt: `${product.name} Highlight 3` }, title: "", description: "", is_custom: true },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Filter out completely empty items, but keep partial ones if they have at least title or image
      const sanitized = highlights.filter(
        (h) => (h.title && h.title.trim().length > 0) || (h.image?.src && h.image.src.trim().length > 0)
      );

      const res = await updateProductHighlights(product.id, sanitized);
      if (res.success) {
        setMessage({ type: "success", text: "✅ Highlights updated and live on site!" });
        if (onSuccess) {
          onSuccess(product.id, sanitized);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setMessage({ type: "error", text: `❌ Save failed: ${res.message}` });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: `❌ Save error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Product Highlights</h2>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs font-mono text-zinc-300">
                  SKU: {product.sku}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Editing highlights for <span className="text-white font-medium">{product.name}</span> (Large view page feature cards)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {message && (
          <div
            className={`px-6 py-3 text-sm font-medium border-b flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-950/80 text-green-200 border-green-800"
                : "bg-red-950/80 text-red-200 border-red-800"
            }`}
          >
            {message.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
            <span>
              Manage up to 3 (or more) feature highlight cards with custom images, titles, and descriptions.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetThreeSlots}
                className="text-zinc-400 hover:text-white underline transition cursor-pointer"
              >
                Reset to 3 Cards
              </button>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{highlights.length} Highlights</span>
            </div>
          </div>

          {highlights.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg p-6">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm mb-4">No highlights defined for this product yet.</p>
              <button
                type="button"
                onClick={handleResetThreeSlots}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium text-sm transition"
              >
                Create 3 Highlight Cards
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {highlights.map((highlight, index) => {
                const hasImage = Boolean(highlight.image?.src && highlight.image.src.trim().length > 0);
                const isUploading = uploadingIndex === index;

                return (
                  <div
                    key={index}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between relative group hover:border-zinc-700 transition"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Highlight #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(index)}
                        title="Delete highlight card"
                        className="text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Box */}
                    <div className="mb-4">
                      <div className="relative aspect-square w-full rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col items-center justify-center group/img">
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center p-4 text-center">
                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                            <span className="text-xs text-zinc-400 font-medium">Uploading image...</span>
                          </div>
                        ) : hasImage ? (
                          <>
                            <Image
                              src={highlight.image.src}
                              alt={highlight.title || `Highlight ${index + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            {/* Hover overlay for image change/remove */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                              <button
                                type="button"
                                onClick={() => fileInputRefs.current[index]?.click()}
                                className="px-3 py-1 bg-white text-black text-xs font-semibold rounded hover:bg-zinc-200 transition flex items-center gap-1"
                              >
                                <Upload className="w-3.5 h-3.5" /> Change
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="px-3 py-1 bg-red-600/80 text-white text-xs font-semibold rounded hover:bg-red-600 transition flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <div
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-zinc-900/50 w-full h-full transition"
                          >
                            <ImageIcon className="w-8 h-8 text-zinc-600 mb-1.5" />
                            <span className="text-xs font-semibold text-zinc-300">Upload Image</span>
                            <span className="text-[11px] text-zinc-500 mt-0.5">JPG, PNG, WebP</span>
                          </div>
                        )}
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={(el) => {
                          fileInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(index, file);
                        }}
                      />

                      {/* Manual Image URL Input */}
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Or paste image URL..."
                          value={highlight.image.src || ""}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-amber-500 transition"
                        />
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2.5 flex-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wide">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Carbon-Fibre Knuckle Guard"
                          value={highlight.title}
                          onChange={(e) => handleTextChange(index, "title", e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-400 mb-1 uppercase tracking-wide">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Short description of this highlight..."
                          value={highlight.description}
                          onChange={(e) => handleTextChange(index, "description", e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-amber-500 resize-none transition"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add more button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddCard}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Add Another Highlight Card
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/60">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-medium text-sm transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-sm transition shadow-lg shadow-red-600/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Highlights...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Highlights
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
