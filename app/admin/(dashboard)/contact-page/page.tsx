"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Save, CheckCircle2, RotateCcw, Mail, MapPin, Phone, Clock } from "lucide-react";

export interface ContactPageCMSData {
  heroTitle: string;
  heroSubtitle: string;
  locationTitle: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  businessHours: string;
  mapEmbedUrl: string;
}

export const defaultContactCMSData: ContactPageCMSData = {
  heroTitle: "Tell Us About Your Project",
  heroSubtitle: "Share your requirements and our team will contact you with the next steps.",
  locationTitle: "Visit Our Office",
  companyName: "ESTRELLA INTERNATIONAL",
  addressLine1: "CHINA CHOWK, Sialkot 51310",
  addressLine2: "Pakistan",
  phone: "+92-52-3561460",
  email: "info@estrella-international.com",
  businessHours: "Mon-Sat: 9:00 AM – 6:00 PM (PKT)",
  mapEmbedUrl: "https://maps.google.com/maps?q=Estrella+International,+China+Chowk,+Sialkot,+Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed",
};

export default function ContactPageAdmin() {
  const [data, setData] = useState<ContactPageCMSData>(defaultContactCMSData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem("estrella_contact_cms");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setData({ ...defaultContactCMSData, ...parsed });
        }
      } catch {}
    }
    setLoading(false);
  }, []);

  const handleChange = (field: keyof ContactPageCMSData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("estrella_contact_cms", JSON.stringify(data));
    setMessage("✅ Contact Us Page content updated successfully!");
    setTimeout(() => setMessage(""), 4000);
  };

  const handleReset = () => {
    if (confirm("Reset Contact Us content to default Estrella parameters?")) {
      setData(defaultContactCMSData);
      localStorage.removeItem("estrella_contact_cms");
      setMessage("✅ Reset to default Contact Us settings.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-600 font-medium">Loading Contact CMS...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] bg-sky-50 px-2.5 py-1 rounded-full">
            Page CMS Editor
          </span>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Contact Us Page CMS
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Manage contact page titles, office location details, phone, email, business hours, and map settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition text-xs"
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>
          <button
            type="submit"
            form="contact-cms-form"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00AEF0] hover:bg-[#0095ce] text-white font-bold rounded-xl shadow-md shadow-sky-500/20 transition text-sm"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-sky-50 border border-sky-200 text-[#00AEF0] rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      <form id="contact-cms-form" onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Main Titles */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-sky-50 text-[#00AEF0] rounded-xl">
              <Mail size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Inquiry Form Section Header</h2>
              <p className="text-xs text-slate-500">Form section heading and description</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Section Heading
              </label>
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Subheading / Description
              </label>
              <textarea
                rows={2}
                value={data.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Office Location Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-sky-50 text-[#00AEF0] rounded-xl">
              <MapPin size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Office Location & Address</h2>
              <p className="text-xs text-slate-500">Company title, address lines, and map parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Location Section Heading
              </label>
              <input
                type="text"
                value={data.locationTitle}
                onChange={(e) => handleChange("locationTitle", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={data.addressLine1}
                onChange={(e) => handleChange("addressLine1", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Address Line 2 (Country)
              </label>
              <input
                type="text"
                value={data.addressLine2}
                onChange={(e) => handleChange("addressLine2", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Channels & Hours */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-sky-50 text-[#00AEF0] rounded-xl">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Contact Channels & Business Hours</h2>
              <p className="text-xs text-slate-500">Phone number, email address, and operating hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Business Hours
              </label>
              <input
                type="text"
                value={data.businessHours}
                onChange={(e) => handleChange("businessHours", e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#00AEF0]"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-[#00AEF0] hover:bg-[#0095ce] text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition text-base"
          >
            <Save size={20} /> Save Contact CMS
          </button>
        </div>
      </form>
    </div>
  );
}
