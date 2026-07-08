import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Trash2, Save, X, RefreshCw, FileText } from 'lucide-react';

interface LocalizedString {
  en: string;
  uz: string;
  ru: string;
}

interface Blog {
  id: string;
  title: LocalizedString;
  content: LocalizedString;
  image_url: string;
  tags: string[];
  reading_time: number;
  views: number;
  created_at: string;
}

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState<LocalizedString>({ en: '', uz: '', ru: '' });
  const [content, setContent] = useState<LocalizedString>({ en: '', uz: '', ru: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openModal = () => {
    setTitle({ en: '', uz: '', ru: '' });
    setContent({ en: '', uz: '', ru: '' });
    setImageUrl('');
    setTags('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      content,
      image_url: imageUrl,
      tags: tags.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await api.post('/blogs', payload);
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to save blog', err);
      alert('Error saving blog.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchBlogs();
      } catch (err) {
        console.error('Failed to delete blog', err);
      }
    }
  };

  const autoTranslate = async (sourceText: string, fieldType: 'title' | 'content') => {
    if (!sourceText) return;
    setIsTranslating(true);
    try {
      const { data } = await api.post('/projects/translate', { text: sourceText, from: 'en' });
      const translated = data.data;

      if (fieldType === 'title') setTitle(prev => ({ ...prev, ...translated }));
      if (fieldType === 'content') setContent(prev => ({ ...prev, ...translated }));
    } catch (err) {
      console.error('Translation failed', err);
      alert('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) return <div className="text-foreground dark:text-white">Loading blogs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-2">
          <FileText className="text-primary" /> Blogs ({blogs.length})
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-teal-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> New Blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(b => (
          <div key={b.id} className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden relative group">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${b.image_url})`}} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => handleDelete(b.id)} className="bg-foreground/10 hover:bg-red-500 p-3 rounded-full text-white backdrop-blur-md transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">{b.title?.en}</h3>
              <p className="text-foreground/70 text-sm line-clamp-2 mb-4 flex-1">{b.content?.en}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(b.tags || []).slice(0, 3).map(tag => (
                  <span key={tag} className="bg-foreground/5 border border-border text-xs px-2 py-1 rounded-md text-foreground/80">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-foreground/50">
                <span>{b.reading_time} min read</span>
                <span>{b.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-background/90 backdrop-blur-md p-6 border-b border-border flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-foreground dark:text-white">Create New Blog</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground dark:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary">Content & Translations</h3>
                  <button
                    type="button"
                    onClick={() => {
                      autoTranslate(title.en, 'title');
                      autoTranslate(content.en, 'content');
                    }}
                    disabled={isTranslating}
                    className="text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                    Auto-Translate (from EN)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['en', 'uz', 'ru'].map((lang) => (
                    <div key={`title-${lang}`} className="space-y-2">
                      <label className="text-xs font-mono uppercase text-foreground/50">Title ({lang})</label>
                      <input
                        required={lang === 'en'}
                        value={title[lang as keyof LocalizedString]}
                        onChange={e => setTitle(prev => ({ ...prev, [lang]: e.target.value }))}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['en', 'uz', 'ru'].map((lang) => (
                    <div key={`content-${lang}`} className="space-y-2">
                      <label className="text-xs font-mono uppercase text-foreground/50">Content ({lang})</label>
                      <textarea
                        required={lang === 'en'} rows={8}
                        value={content[lang as keyof LocalizedString]}
                        onChange={e => setContent(prev => ({ ...prev, [lang]: e.target.value }))}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm focus:border-primary focus:outline-none resize-none font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-medium text-primary">Media & Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-foreground/50">Image URL</label>
                    <input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-foreground/50">Tags (comma separated)</label>
                    <input required value={tags} onChange={e => setTags(e.target.value)} placeholder="React, Engineering, Design" className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-primary hover:bg-teal-500 text-white px-8 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-primary/20">
                  <Save className="w-5 h-5" /> Save Blog
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
