"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-red-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="Logout"
    >
      <LogOut size={18} />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
