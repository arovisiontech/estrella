"use client";

import { Menu, LogOut } from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

interface AdminHeaderProps {
  adminName: string;
  adminEmail: string;
  onMenuClick?: () => void;
}

export default function AdminHeader({
  adminName,
  adminEmail,
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left: Menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-slate-800" />
        </button>

        {/* Center spacer */}
        <div className="hidden md:block" />

        {/* Right: Admin info and logout */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-end">
            <p className="text-sm font-semibold text-slate-900">{adminName}</p>
            <p className="text-xs text-slate-500">{adminEmail}</p>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <AdminLogoutButton />
        </div>
      </div>
    </header>
  );
}
