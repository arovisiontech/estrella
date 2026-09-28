"use client";

import { useState, useEffect } from "react";
import { Shield, Trash2, Eye, EyeOff, UserCheck } from "lucide-react";
import { getAdministrators, setAdminActive, updateAdminRole } from "@/lib/actions/admin/admins";

interface AdminUser {
  id: string;
  email: string;
  full_name?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadAdmins = async () => {
    setLoading(true);
    const res = await getAdministrators();
    if (res.success && res.data) {
      setAdmins(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleRoleChange(id: string, newRole: "admin" | "editor" | "viewer") {
    const res = await updateAdminRole(id, newRole);
    if (res.success) {
      setMessage(`✅ ${res.message}`);
      loadAdmins();
    } else {
      setMessage(`❌ ${res.message || "Failed to update role"}`);
    }
    setTimeout(() => setMessage(""), 3000);
  }

  async function toggleActive(id: string, currentActive: boolean) {
    const res = await setAdminActive(id, !currentActive);
    if (res.success) {
      setMessage(`✅ ${res.message}`);
      loadAdmins();
    } else {
      setMessage(`❌ ${res.message || "Failed to update active status"}`);
    }
    setTimeout(() => setMessage(""), 3000);
  }

  if (loading) {
    return <div className="p-8 text-white">Loading administrator profiles...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Settings</p>
          <h1 className="text-4xl font-bold text-white mt-1">Administrators</h1>
          <p className="text-zinc-400 mt-2">{admins.length} administrator profiles found</p>
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

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900 text-xs uppercase font-semibold text-zinc-400">
                  <th className="text-left p-4">Admin User</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No administrators found in profiles table.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-zinc-900/50 transition">
                      <td className="p-4 text-white">
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-4 h-4 text-red-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-xs text-white">{admin.full_name || admin.email}</p>
                            <p className="text-[11px] text-zinc-500 font-mono">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin.id, e.target.value as any)}
                          className="px-3 py-1 rounded text-xs font-semibold bg-zinc-900 border border-zinc-700 text-white outline-none cursor-pointer"
                        >
                          <option value="admin">Admin (Full Control)</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(admin.id, admin.is_active)}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 ${
                            admin.is_active
                              ? "bg-green-950 text-green-200 border border-green-800"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {admin.is_active ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Blocked
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-zinc-400 text-xs">
                        {new Date(admin.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(admin.id, admin.is_active)}
                          className="text-xs text-zinc-400 hover:text-red-400 transition"
                        >
                          {admin.is_active ? "Block Access" : "Grant Access"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
