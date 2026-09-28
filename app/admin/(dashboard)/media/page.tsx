'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, Copy, Image, FileText, Search } from 'lucide-react';

interface MediaFile {
  name: string;
  size?: number;
  created_at?: string;
  url: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const loadFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('media').list();

      if (!error && data) {
        const filesWithUrls = data.map((file: any) => ({
          name: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          url: supabase.storage.from('media').getPublicUrl(file.name).data.publicUrl,
        }));
        setFiles(filesWithUrls);
      }
    } catch (err) {
      console.error('Error loading files:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { error } = await supabase.storage.from('media').upload(
        `${Date.now()}-${file.name}`,
        file
      );

      if (error) {
        setMessage('❌ Upload failed: ' + error.message);
      } else {
        setMessage('✅ File uploaded successfully');
        loadFiles();
      }
    } catch (err) {
      setMessage('❌ Upload error');
    }
    setUploading(false);
  };

  const deleteFile = async (filename: string) => {
    if (!confirm('Delete this file?')) return;

    const { error } = await supabase.storage.from('media').remove([filename]);

    if (error) {
      setMessage('❌ Delete failed');
    } else {
      setMessage('✅ File deleted');
      loadFiles();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setMessage('✅ URL copied to clipboard');
    setTimeout(() => setMessage(''), 2000);
  };

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['mp4', 'webm'].includes(ext || '')) return 'video';
    return 'file';
  };

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-red-500 text-xs font-bold uppercase">Media</p>
          <h1 className="text-4xl font-bold text-white mt-2">Media Library</h1>
          <p className="text-zinc-400 mt-2">{filteredFiles.length} files</p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.startsWith('❌')
              ? 'bg-red-900 text-red-100'
              : 'bg-green-900 text-green-100'
          }`}>
            {message}
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 mb-8 text-center hover:border-red-600 transition">
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept="image/*,.pdf,video/*"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-12 h-12 text-zinc-500" />
              <p className="text-white font-semibold">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-zinc-400">Images, PDFs, and videos (max 50MB)</p>
            </div>
          </label>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-zinc-900 text-white outline-none border border-zinc-700 rounded focus:border-red-600"
            />
          </div>
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p>No files uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => {
              const fileType = getFileType(file.name);
              return (
                <div
                  key={file.name}
                  className="border border-zinc-800 bg-zinc-950 rounded-lg p-4 hover:border-red-600 transition"
                >
                  <div className="mb-4">
                    {fileType === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-40 object-cover rounded bg-zinc-900"
                      />
                    ) : (
                      <div className="w-full h-40 bg-zinc-900 rounded flex items-center justify-center">
                        {fileType === 'pdf' ? (
                          <FileText className="w-12 h-12 text-red-600" />
                        ) : (
                          <Image className="w-12 h-12 text-zinc-600" />
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-white text-sm truncate mb-2">{file.name}</p>
                  <p className="text-xs text-zinc-400 mb-4">
                    {file.size ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyUrl(file.url)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded text-xs font-semibold transition"
                      title="Copy public URL"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                    </button>
                    <button
                      onClick={() => deleteFile(file.name)}
                      className="flex items-center justify-center bg-red-900 hover:bg-red-800 text-white px-3 py-2 rounded transition"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
