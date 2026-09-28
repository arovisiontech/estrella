"use client";

import { useState, ReactNode } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import MobileAdminSidebar from "./MobileAdminSidebar";

interface AdminLayoutClientProps {
  adminName: string;
  adminEmail: string;
  children: ReactNode;
}

export default function AdminLayoutClient({
  adminName,
  adminEmail,
  children,
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Header with menu control */}
      <AdminHeader
        adminName={adminName}
        adminEmail={adminEmail}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block md:w-64 border-r border-slate-200 bg-white">
          <AdminSidebar isOpen={true} />
        </div>

        {/* Mobile Sidebar - client-side drawer */}
        <MobileAdminSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
