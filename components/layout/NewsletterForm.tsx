"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/actions/admin/subscribers";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await subscribeNewsletter(email.trim());
      if (res.success) {
        setMessage({
          type: "success",
          text: res.message || "Thank you for subscribing!",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: res.message || "Failed to subscribe. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      setMessage({
        type: "error",
        text: error?.message || "Failed to subscribe. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="your email......"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="grow px-3.5 py-2.5 bg-zinc-800 text-sm text-white placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEF0] disabled:opacity-50"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[#00AEF0] text-white text-sm font-semibold hover:bg-[#0089bd] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md shadow-[#00AEF0]/20"
        >
          {loading ? "..." : "SUBSCRIBE"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-2 text-sm font-medium ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
