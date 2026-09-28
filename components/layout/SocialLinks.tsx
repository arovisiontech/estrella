"use client";

import { socialLinks } from "@/lib/data/footer";

const iconSymbols: Record<string, string> = {
  Instagram: "ig",
  Facebook: "f",
  Twitter: "𝕏",
  LinkedIn: "in",
  Pinterest: "p",
};

export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit us on ${social.label}`}
          className="w-10 h-10 flex items-center justify-center bg-[#00AEF0] text-white font-bold rounded-sm transition-all duration-300 hover:scale-110 hover:bg-[#0089bd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-sm shadow-md shadow-[#00AEF0]/20"
          title={social.label}
        >
          {iconSymbols[social.label] || social.label[0]}
        </a>
      ))}
    </div>
  );
}
