'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function BannersPage() {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase">Home Content</p>
            <h1 className="text-4xl font-bold text-white mt-2">Banners</h1>
            <p className="text-zinc-400 mt-2">Manage promotional banners across the website</p>
          </div>
          <Link
            href="/admin/home/banners/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Add Banner
          </Link>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg p-8">
          <div className="text-center">
            <p className="text-zinc-400 text-lg">No banners configured yet.</p>
            <p className="text-zinc-500 text-sm mt-2">
              Currently, the website uses the Hero Slider for primary promotional content.
            </p>
            <p className="text-zinc-500 text-sm mt-4">
              Banner management will be available for managing additional promotional sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
