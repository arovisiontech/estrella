"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveSiteSettings } from "@/lib/actions/admin/settings";
import { Save, Loader2, Palette } from "lucide-react";

interface Settings {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_youtube?: string;
  theme_primary_color?: string;
  theme_accent_color?: string;
  theme_border_radius?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    company_name: "TORQUE MOTO CHINA CHOWK",
    email: "Info@Torque-Moto.Com",
    phone: "+92-523-561460",
    address: "Sialkot 51310 - Pakistan",
    footer_text: "Building quality motorcycle apparel since 1982.",
    seo_title: "Torque Motorsports | Premium Motorcycle Gear",
    seo_description: "Premium motorcycle jackets, gloves, and protective gear manufactured in Pakistan.",
    social_facebook: "https://facebook.com",
    social_instagram: "https://instagram.com",
    social_linkedin: "https://linkedin.com",
    social_youtube: "https://youtube.com",
    theme_primary_color: "#dc2626",
    theme_accent_color: "#991b1b",
    theme_border_radius: "rounded-sm",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*");

    if (!error && data && data.length > 0) {
      const settingsMap: Record<string, string> = {};
      data.forEach((row) => {
        settingsMap[row.setting_key] = row.setting_value ?? "";
      });

      setSettings((prev) => ({
        ...prev,
        ...settingsMap,
      }));
    }
    setLoading(false);
  }

  async function handleSaveSettings() {
    setSaving(true);
    setMessage("");

    const result = await saveSiteSettings(settings as unknown as Record<string, string>);

    if (result.success) {
      setMessage(`✅ ${result.message}`);
    } else {
      setMessage(`❌ ${result.message || "Failed to save settings"}`);
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 4000);
  }

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="p-8 text-white">Loading site configurations...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Configuration</p>
          <h1 className="text-4xl font-bold text-white mt-1">Site & Theme Settings</h1>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded text-sm ${
              message.includes("✅") ? "bg-green-950 text-green-200 border border-green-800" : "bg-red-950 text-red-200 border border-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Company Information */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Company Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* SEO & Footer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">SEO & Footer</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Footer Tagline / Text</label>
                <textarea
                  value={settings.footer_text}
                  onChange={(e) => handleChange("footer_text", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Default SEO Title</label>
                <input
                  type="text"
                  value={settings.seo_title}
                  onChange={(e) => handleChange("seo_title", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Default SEO Description</label>
                <textarea
                  value={settings.seo_description}
                  onChange={(e) => handleChange("seo_description", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Social Links</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={settings.social_facebook || ""}
                  onChange={(e) => handleChange("social_facebook", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Instagram URL</label>
                <input
                  type="url"
                  value={settings.social_instagram || ""}
                  onChange={(e) => handleChange("social_instagram", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={settings.social_linkedin || ""}
                  onChange={(e) => handleChange("social_linkedin", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={settings.social_youtube || ""}
                  onChange={(e) => handleChange("social_youtube", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Theme Customization */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Palette className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Theme & Brand Styling</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Primary Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.theme_primary_color || "#dc2626"}
                    onChange={(e) => handleChange("theme_primary_color", e.target.value)}
                    className="w-10 h-10 rounded border border-zinc-800 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.theme_primary_color || "#dc2626"}
                    onChange={(e) => handleChange("theme_primary_color", e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs rounded focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.theme_accent_color || "#991b1b"}
                    onChange={(e) => handleChange("theme_accent_color", e.target.value)}
                    className="w-10 h-10 rounded border border-zinc-800 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.theme_accent_color || "#991b1b"}
                    onChange={(e) => handleChange("theme_accent_color", e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white font-mono text-xs rounded focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Button Radius</label>
                <select
                  value={settings.theme_border_radius || "rounded-sm"}
                  onChange={(e) => handleChange("theme_border_radius", e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-white rounded focus:border-red-600 outline-none text-sm"
                >
                  <option value="rounded-none">Sharp (0px)</option>
                  <option value="rounded-sm">Subtle (2px)</option>
                  <option value="rounded-md">Medium (6px)</option>
                  <option value="rounded-lg">Rounded (8px)</option>
                  <option value="rounded-full">Pill (9999px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white px-8 py-3 rounded text-sm font-semibold transition"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
