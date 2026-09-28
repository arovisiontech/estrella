'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  is_published: boolean;
  author?: string;
  published_at?: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const loadBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setBlogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  async function togglePublished(id: string, isPublished: boolean) {
    const { error } = await supabase
      .from('blogs')
      .update({ is_published: !isPublished })
      .eq('id', id);

    if (!error) {
      setMessage('✅ Blog updated');
      loadBlogs();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm('Delete this blog?')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) {
      setMessage('✅ Blog deleted');
      loadBlogs();
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase">Content</p>
            <h1 className="text-4xl font-bold text-white mt-2">Blogs</h1>
            <p className="text-zinc-400 mt-2">{filteredBlogs.length} blogs</p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Add Blog
          </Link>
        </div>

        {message && (
          <div className="mb-4 bg-green-900 text-green-100 p-3 rounded">
            {message}
          </div>
        )}

        <div className="mb-6 flex items-center gap-4 bg-zinc-900 p-4 rounded">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </div>

        <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="text-left p-4 text-zinc-400">Title</th>
                  <th className="text-left p-4 text-zinc-400">Author</th>
                  <th className="text-left p-4 text-zinc-400">Published</th>
                  <th className="text-left p-4 text-zinc-400">Date</th>
                  <th className="text-left p-4 text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-zinc-400">No blogs found</td>
                  </tr>
                ) : (
                  filteredBlogs.map(blog => (
                    <tr key={blog.id} className="border-b border-zinc-800 hover:bg-zinc-900">
                      <td className="p-4 text-white">{blog.title}</td>
                      <td className="p-4 text-zinc-400">{blog.author || '-'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublished(blog.id, blog.is_published)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            blog.is_published
                              ? 'bg-green-900 text-green-100'
                              : 'bg-yellow-900 text-yellow-100'
                          }`}
                        >
                          {blog.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-zinc-400">{blog.published_at ? new Date(blog.published_at).toLocaleDateString() : '-'}</td>
                      <td className="p-4 flex gap-2">
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
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
