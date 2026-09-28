"use client";

import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface MobileAdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileAdminSidebar({
  isOpen,
  onClose,
}: MobileAdminSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-40 h-full transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full w-64 bg-black border-r border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Torque CMS
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-zinc-900 rounded transition"
            >
              <X size={20} />
            </button>
          </div>
          <AdminSidebar isOpen={true} onClose={onClose} />
        </div>
      </div>
    </>
  );
}
