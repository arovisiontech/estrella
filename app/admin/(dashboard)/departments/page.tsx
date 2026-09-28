"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit2, Trash2, Search, Building2, CheckCircle2, XCircle } from "lucide-react";
import { getDepartments } from "@/lib/cms/departments";
import { setDepartmentActive, deleteDepartment } from "@/lib/actions/admin/departments";
import type { AdaptedDepartment } from "@/lib/cms/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<AdaptedDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  async function loadDepartments() {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (e) {
      console.error("Departments load error:", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredDepartments = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function handleToggleActive(id: string, currentActive: boolean) {
    const res = await setDepartmentActive(id, !currentActive);
    if (res.success) {
      setMessage("✅ Department status updated");
      loadDepartments();
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(`❌ ${res.message || "Failed to update status"}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this department?")) return;
    const res = await deleteDepartment(id);
    if (res.success) {
      setMessage("✅ Department deleted successfully");
      loadDepartments();
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage(`❌ ${res.message || "Failed to delete department"}`);
    }
  }

  if (loading) {
    return <div className="p-8 text-slate-700 font-medium">Loading departments...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#00AEF0] text-xs font-bold uppercase tracking-wider">Organization & Operations</p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Departments</h1>
            <p className="text-slate-500 text-sm mt-1">{filteredDepartments.length} total departments</p>
          </div>
          <Link
            href="/admin/departments/new"
            className="flex items-center gap-2 bg-[#00AEF0] hover:bg-[#0090c8] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Department
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
              message.includes("✅") ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search department by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 outline-none text-sm"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase font-bold text-slate-600">
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">Slug</th>
                  <th className="text-left p-4">Short Description</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                      No departments found
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => {
                    const imgSrc = typeof dept.image === "string" ? dept.image : dept.image?.src || "/images/banner.png";
                    return (
                      <tr key={dept.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                              <Image src={imgSrc} alt={dept.name} fill className="object-cover" unoptimized />
                            </div>
                            <span className="text-sm font-bold text-slate-900">{dept.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 font-mono text-xs">{dept.slug}</td>
                        <td className="p-4 text-slate-600 text-xs max-w-xs truncate">{dept.shortDescription || dept.description}</td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(dept.id, Boolean(dept.isActive))}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                              dept.isActive !== false
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            }`}
                          >
                            {dept.isActive !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {dept.isActive !== false ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/departments/${dept.id}/edit`}
                              className="p-2 text-slate-600 hover:text-[#00AEF0] hover:bg-slate-100 rounded-lg transition"
                              title="Edit Department"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(dept.id)}
                              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete Department"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
