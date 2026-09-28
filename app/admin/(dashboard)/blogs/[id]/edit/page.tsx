'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { updateBlog, deleteBlog } from '@/lib/actions/admin/blogs';
import { uploadAdminFile } from '@/lib/actions/admin/upload';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  featured_image_url?: string;
  is_published: boolean;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const supabase = createClient();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadBlog() {
      setLoading(true);
      const { data } = await supabase.from('blogs').select('*').eq('id', blogId).single();
      if (data) setBlog(data);
      setLoading(false);
    }
    loadBlog();
  }, [blogId]);

  const handleInputChange = (field: keyof Blog, value: any) => {
    if (blog) {
      setBlog({ ...blog, [field]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !blog) return;
    setUploadingImage(true);
    setMessage('');

    try {
      // Direct browser storage upload with server action fallback
      const timestamp = Date.now();
      const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const filePath = `blogs/${timestamp}-${sanitized}`;

      const { data, error } = await supabase.storage.from('site-assets').upload(filePath, file, { upsert: true });

      if (!error && data) {
        const publicUrl = supabase.storage.from('site-assets').getPublicUrl(filePath).data.publicUrl;
        setBlog(prev => prev ? { ...prev, featured_image_url: publicUrl } : null);
        setMessage('✅ Image uploaded successfully!');
      } else {
        // Fallback to upload action
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'blogs');
        const res = await uploadAdminFile(formData);

        if (res.success && res.data?.url) {
          setBlog(prev => prev ? { ...prev, featured_image_url: res.data!.url } : null);
          setMessage('✅ Image uploaded successfully!');
        } else {
          setMessage(`❌ Image upload failed: ${res.message || 'Failed to upload image'}`);
        }
      }
    } catch (err: any) {
      setMessage(`❌ Image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!blog) return;
    if (!blog.title) {
      setMessage('❌ Title is required');
      return;
    }
    if (!blog.slug) {
      setMessage('❌ Slug is required');
      return;
    }

    setSaving(true);
    const result = await updateBlog(blog.id, blog);

    if (result.success) {
      setMessage('✅ Blog updated successfully');
      setTimeout(() => router.push('/admin/blogs'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!blog || !confirm('Delete this blog?')) return;
    setSaving(true);
    const result = await deleteBlog(blog.id);

    if (result.success) {
      setMessage('✅ Blog deleted');
      setTimeout(() => router.push('/admin/blogs'), 1200);
    } else {
      setMessage(`❌ ${result.message}`);
    }
    setSaving(false);
  };

  if (loading || !blog) {
    return <div className="p-6 text-white flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin text-red-600" /> Loading blog...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/blogs" className="text-red-500 hover:text-red-400 flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>

        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Content</p>
          <h1 className="text-4xl font-bold text-white mt-2">{blog.title}</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded text-sm ${message.includes('✅') ? 'bg-green-950 text-green-100 border border-green-800' : 'bg-red-950 text-red-100 border border-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title *</label>
              <input
                type="text"
                value={blog.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Slug *</label>
              <input
                type="text"
                value={blog.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Excerpt</label>
            <textarea
              value={blog.excerpt || ''}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Content</label>
            <textarea
              value={blog.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
            />
          </div>

          {/* Featured Image & Upload Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-500" /> Featured Blog Image
            </h2>

            {blog.featured_image_url ? (
              <div className="relative aspect-video max-w-md rounded overflow-hidden border border-zinc-800 bg-zinc-950">
                <Image src={blog.featured_image_url} alt="Blog Featured Image" fill className="object-cover" unoptimized />
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={blog.featured_image_url || ''}
                onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
                placeholder="/images/blog-1.jpg or Image URL"
                className="flex-1 bg-zinc-950 text-white px-4 py-2.5 rounded border border-zinc-800 focus:border-red-600 outline-none text-sm"
              />
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition shrink-0">
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Author</label>
              <input
                type="text"
                value={blog.author_name || ''}
                onChange={(e) => handleInputChange('author_name', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">SEO Title</label>
              <input
                type="text"
                value={blog.meta_title || ''}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">SEO Description</label>
            <input
              type="text"
              value={blog.meta_description || ''}
              onChange={(e) => handleInputChange('meta_description', e.target.value)}
              className="w-full bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700 focus:border-red-600 outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={blog.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              Published (Visible on Public Website)
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-800">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold transition"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Blog'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 bg-red-900 hover:bg-red-800 disabled:opacity-50 text-red-100 px-6 py-3 rounded font-semibold transition"
            >
              <Trash2 className="w-4 h-4" /> Delete Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
