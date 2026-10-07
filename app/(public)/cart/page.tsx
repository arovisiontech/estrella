"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  MessageSquare,
  Send,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { createClient } from "@/lib/supabase/client";

const getSafeImageSrc = (src: any) => {
  if (!src) return "/images/banner-sublimation-sports.svg";
  let s = "";
  if (typeof src === "string") {
    s = src.trim();
    if (s.startsWith("{") || s.startsWith("[")) {
      try {
        const parsed = JSON.parse(s);
        if (typeof parsed === "string") s = parsed;
        else if (parsed && typeof parsed === "object") s = parsed.src || parsed.url || parsed.path || "";
      } catch {
        // ignore
      }
    }
  } else if (typeof src === "object") {
    s = src.src || src.url || src.path || "";
  }
  if (!s || s === "null" || s === "undefined") return "/images/banner-sublimation-sports.svg";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("/")) {
    return s;
  }
  return `/${s}`;
};

const CUSTOMIZATION_OPTIONS = [
  "Custom Brand Logo & Embroidery",
  "Sublimation Printing & Custom Colors",
  "Custom Sizing & Tech Pack",
  "Woven Labels & Polybag Packaging",
  "Sample Prototype First",
];

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  // Inquiry Form state
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([
    "Custom Brand Logo & Embroidery",
  ]);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (item: (typeof items)[0], nextQty: number) => {
    if (nextQty <= 0) {
      removeItem({
        productId: item.productId,
        size: item.size,
        color: item.color,
      });
    } else {
      updateQuantity(
        {
          productId: item.productId,
          size: item.size,
          color: item.color,
        },
        nextQty
      );
    }
  };

  const handleRemove = (item: (typeof items)[0]) => {
    removeItem({
      productId: item.productId,
      size: item.size,
      color: item.color,
    });
  };

  const toggleCustomization = (option: string) => {
    setSelectedCustomizations((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  // Build inquiry message payload
  const buildItemsSummaryText = () => {
    const list = items.map((item, idx) => {
      const color = item.color || "Default";
      const size = item.size || "Standard";
      return `${idx + 1}. Product: ${item.name} | SKU: ${item.sku || "N/A"} | Color: ${color} | Size: ${size} | Quantity: ${item.quantity} units`;
    });
    return list.join("\n");
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Please provide a phone or WhatsApp contact number.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Your inquiry cart is empty. Please add at least one product.");
      return;
    }

    setIsSubmitting(true);

    const ref = `EST-INQ-${Math.floor(100000 + Math.random() * 900000)}`;

    const formattedMessage = `
========================================
ESTRELLA B2B PRODUCT INQUIRY (${ref})
========================================

CLIENT DETAILS:
- Full Name: ${fullName.trim()}
- Company / Brand: ${company.trim() || "N/A"}
- Email: ${email.trim()}
- Phone / WhatsApp: ${phone.trim()}
- Country / Port: ${country.trim() || "N/A"}

PRODUCTS REQUESTED (${items.length} items, Total ${totalQuantity} units):
${buildItemsSummaryText()}

CUSTOMIZATION REQUIREMENTS:
${selectedCustomizations.length > 0 ? selectedCustomizations.map((c) => `• ${c}`).join("\n") : "Standard specifications"}

ADDITIONAL NOTES & SPECIFICATIONS:
${notes.trim() || "None provided"}
    `.trim();

    try {
      const supabase = createClient();
      await supabase.from("contact_inquiries").insert([
        {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          company_name: company.trim() || null,
          country: country.trim() || null,
          subject: `Product Inquiry (${items.length} products - ${totalQuantity} units) [${ref}]`,
          message: formattedMessage,
          status: "new",
        },
      ]);
    } catch {
      // ignore network errors and fallback
    }

    // Save in local storage inquiry history
    try {
      const existingInquiries = JSON.parse(
        localStorage.getItem("estrella_client_inquiries") || "[]"
      );
      existingInquiries.unshift({
        ref,
        date: new Date().toISOString(),
        fullName,
        email,
        phone,
        itemsCount: items.length,
        totalQuantity,
        items: [...items],
      });
      localStorage.setItem("estrella_client_inquiries", JSON.stringify(existingInquiries));
    } catch {
      // ignore storage errors
    }

    setIsSubmitting(false);
    setReferenceId(ref);
    setSubmitted(true);
    clearCart();
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Estrella International Team,\n\nI would like to request an official wholesale quotation for the following inquiry items:\n\n${buildItemsSummaryText()}\n\n• Total Units: ${totalQuantity}\n• Client Name: ${fullName.trim() || "Buyer"}\n• Company: ${company.trim() || "N/A"}\n• Country: ${country.trim() || "N/A"}\n\nPlease share manufacturing MOQs, pricing, and sample availability.`
    );
    window.open(`https://wa.me/923000000000?text=${text}`, "_blank");
  };

  return (
    <main className="bg-slate-50 min-h-screen text-slate-900 pb-20 font-sans">
      {/* Breadcrumb Header */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="site-container py-3.5 px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
            <li>
              <Link href="/" className="hover:text-[#00AEF0] transition">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-300">
              /
            </li>
            <li aria-current="page" className="font-bold text-[#00AEF0] uppercase tracking-wider">
              Inquiry Cart
            </li>
          </ol>
        </div>
      </nav>

      {/* Page Title Banner */}
      <section className="bg-slate-900 text-white py-10 sm:py-14 border-b border-slate-800">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 text-[#00AEF0] border border-sky-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            B2B OEM & Custom Manufacturing
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase">
            Product Inquiry & Quotation
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
            Review your selected products, specify colors, sizes, and quantities, then submit your request. Our factory export team will respond within 2 hours.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-8 sm:py-12">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          {submitted ? (
            /* ============================================================ */
            /* SUCCESS CONFIRMATION VIEW                                     */
            /* ============================================================ */
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center animate-fadeIn">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 text-emerald-600">
                <CheckCircle2 size={44} />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-[#00AEF0]">
                Inquiry Successfully Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Thank You For Your Inquiry!
              </h2>

              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                Your quotation request has been dispatched directly to our manufacturing engineering team. An official catalog with tiered wholesale unit pricing and sample lead times will be sent to your email.
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-left text-xs sm:text-sm">
                <p className="font-semibold text-slate-800">
                  Inquiry Reference: <span className="font-mono text-[#00AEF0]">{referenceId}</span>
                </p>
                <p className="text-slate-600 mt-1">
                  Representative Email: <span className="font-medium text-slate-800">{email}</span>
                </p>
                <p className="text-slate-600 mt-0.5">
                  Total Items Inquired: <span className="font-medium text-slate-800">{totalQuantity} Units</span>
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-6 py-3 bg-[#00AEF0] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#0090c8] transition shadow-md"
                >
                  Browse More Products
                </Link>
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={16} />
                  Connect On WhatsApp
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* ============================================================ */
            /* EMPTY CART VIEW                                               */
            /* ============================================================ */
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 p-10 sm:p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Package size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Your Inquiry Cart is Empty</h2>
              <p className="text-slate-500 text-sm mt-2 mb-8">
                Explore our categories and add products to request custom bulk manufacturing quotes, fabric specs, and samples.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#00AEF0] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#0090c8] transition shadow-md shadow-sky-500/20"
              >
                Browse All Products
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            /* ============================================================ */
            /* ACTIVE INQUIRY ITEMS & INQUIRY FORM                           */
            /* ============================================================ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Products List (lg:col-span-6) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Selected Products ({items.length})
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Total units selected: <span className="font-bold text-[#00AEF0]">{totalQuantity} pcs</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold underline underline-offset-2 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition shadow-2xs flex gap-4 items-center"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Image
                          src={getSafeImageSrc(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#00AEF0] transition line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        {item.sku && (
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            SKU: {item.sku}
                          </p>
                        )}

                        {/* Badges for Color & Size */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-[#00AEF0] border border-sky-200/80">
                            Color: <strong className="ml-1 uppercase">{item.color || "Default"}</strong>
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                            Size: <strong className="ml-1 uppercase">{item.size || "Standard"}</strong>
                          </span>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-600 mr-1">
                              Quantity:
                            </span>
                            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                className="p-1 sm:p-1.5 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-9 text-center text-xs font-bold text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                className="p-1 sm:p-1.5 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back to Products Button */}
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#00AEF0] hover:underline"
                  >
                    + Add More Products To Inquiry
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Official B2B Inquiry Form (lg:col-span-6) */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md sticky top-24">
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#00AEF0] flex items-center gap-1">
                      <Sparkles size={13} /> Step 2: Submit Details
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                      Request Manufacturing Quotation
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Our factory representatives evaluate your specifications and reply with wholesale unit costs, sampling options, and lead times.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmitInquiry} className="space-y-4">
                    {/* Full Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00AEF0] focus:outline-none focus:ring-1 focus:ring-[#00AEF0]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Company / Brand Name
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Apex Sports Club"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00AEF0] focus:outline-none focus:ring-1 focus:ring-[#00AEF0]"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Business Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00AEF0] focus:outline-none focus:ring-1 focus:ring-[#00AEF0]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          WhatsApp / Phone <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555-0199 or +44..."
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00AEF0] focus:outline-none focus:ring-1 focus:ring-[#00AEF0]"
                        />
                      </div>
                    </div>

                    {/* Country / Destination */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Destination Country / Port
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. United States, Germany, United Kingdom, UAE"
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00AEF0] focus:outline-none focus:ring-1 focus:ring-[#00AEF0]"
                      />
                    </div>

                    {/* Customization Checkboxes */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Customization Services Required
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CUSTOMIZATION_OPTIONS.map((opt) => {
                          const active = selectedCustomizations.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleCustomization(opt)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer ${
                                active
                                  ? "bg-[#00AEF0] text-white border-[#00AEF0] shadow-2xs"
                                  : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                              }`}
                            >
                              {active ? "✓ " : "+ "}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes & Specs Textarea */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Specific Requirements, Fabrics, Or Delivery Deadline
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Mention any custom fabric GSM, target delivery date, branding notes, or additional sizes..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#00AEF0] focus:outline-none focus:ring-1 focus:ring-[#00AEF0]"
                      />
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-lg bg-[#00AEF0] text-white font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#0090c8] transition shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Dispatching Inquiry...</span>
                        ) : (
                          <>
                            <Send size={16} />
                            Submit Inquiry ({totalQuantity} Units)
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppInquiry}
                        className="w-full py-3 px-6 rounded-lg border border-emerald-600 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageSquare size={16} />
                        Inquire Directly Via WhatsApp
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-2">
                      <Layers size={12} />
                      Direct OEM Factory Quotations • ISO Certified • Strict NDA Available
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
