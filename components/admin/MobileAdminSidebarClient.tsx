"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { X } from "lucide-react";

export default function MobileAdminSidebarClient() {
  const [isOpen, setIsOpen] = useState(false);

  // Note: The menu button is in AdminHeader component
  // This component just manages the sidebar drawer state

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-30 h-screen transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full w-64 bg-black border-r border-zinc-800 flex flex-col">
          <AdminSidebar isOpen={true} onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  );
}
