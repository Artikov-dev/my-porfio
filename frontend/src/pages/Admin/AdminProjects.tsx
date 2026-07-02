import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Plus, Edit2, Trash2, Globe, Link as LinkIcon, Save, X, RefreshCw } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a12.8 12.8 0 0 0-7 0C6.2 2.7 5 3.1 5 3.1a5.5 5.5 0 0 0-.2 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
  </svg>
);

interface LocalizedString {
  en: string;
  uz: string;
  ru: string;
}

interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  image_url: string;
  github_url: string;
  live_url: string;
  tech_stack: string[];
}

export const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState<LocalizedString>({ en: '', uz: '', ru: '' });
  const [description, setDescription] = useState<LocalizedString>({ en: '', uz: '', ru: '' });
  const [content, setContent] = useState<LocalizedString>({ en: '', uz: '', ru: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setTitle(project.title);
      setDescription(project.description);
      setContent(project.content);
      setImageUrl(project.image_url);
      setGithubUrl(project.github_url || '');
      setLiveUrl(project.live_url || '');
      setTechStack((project.tech_stack || []).join(', '));
    } else {
      setEditingId(null);
      setTitle({ en: '', uz: '', ru: '' });
      setDescription({ en: '', uz: '', ru: '' });
      setContent({ en: '', uz: '', ru: '' });
      setImageUrl('');
      setGithubUrl('');
      setLiveUrl('');
      setTechStack('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      content,
      image_url: imageUrl,
      github_url: githubUrl,
      live_url: liveUrl,
      tech_stack: techStack.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to save project', err);
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    }
  };

  const autoTranslate = async (sourceText: string, fieldType: 'title' | 'description' | 'content') => {
    if (!sourceText) return;
    setIsTranslating(true);
    try {
      // Assuming English is the source language for now
      const { data } = await api.post('/projects/translate', { text: sourceText, from: 'en' });
      const translated = data.data; // { en: '...', uz: '...', ru: '...' }

      if (fieldType === 'title') setTitle(prev => ({ ...prev, ...translated }));
      if (fieldType === 'description') setDescription(prev => ({ ...prev, ...translated }));
      if (fieldType === 'content') setContent(prev => ({ ...prev, ...translated }));

    } catch (err) {
      console.error('Translation failed', err);
      alert('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) return <div className="text-foreground dark:text-white">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-2">
          <Globe className="text-primary" /> Projects ({projects.length})
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-teal-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden relative group">
              <img src={p.image_url} alt={p.title.en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => openModal(p)} className="bg-foreground/10 hover:bg-primary p-3 rounded-full text-white backdrop-blur-md transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="bg-foreground/10 hover:bg-red-500 p-3 rounded-full text-white backdrop-blur-md transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">{p.title.en}</h3>
              <p className="text-foreground/70 text-sm line-clamp-2 mb-4 flex-1">{p.description.en}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {(p.tech_stack || []).slice(0, 3).map(tech => (
                  <span key={tech} className="bg-foreground/5 border border-border text-xs px-2 py-1 rounded-md text-foreground/80">
                    {tech}
                  </span>
                ))}
                {(p.tech_stack || []).length > 3 && <span className="text-xs text-foreground/50">+{(p.tech_stack || []).length - 3}</span>}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:text-teal-400">
                    <LinkIcon className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground dark:text-white ml-auto">
                    <GithubIcon className="w-4 h-4" /> Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-background/90 backdrop-blur-md p-6 border-b border-border flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-foreground dark:text-white">{editingId ? 'Edit Project' : 'Create New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground dark:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-8">

              {/* Translations Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-primary">Content & Translations</h3>
                  {/* Auto Translate Button (Translates from EN to UZ and RU) */}
                  <button
                    type="button"
                    onClick={() => {
                      autoTranslate(title.en, 'title');
                      autoTranslate(description.en, 'description');
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
                        required
                        value={title[lang as keyof LocalizedString]}
                        onChange={e => setTitle(prev => ({ ...prev, [lang]: e.target.value }))}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['en', 'uz', 'ru'].map((lang) => (
                    <div key={`desc-${lang}`} className="space-y-2">
                      <label className="text-xs font-mono uppercase text-foreground/50">Short Desc ({lang})</label>
                      <textarea
                        required rows={2}
                        value={description[lang as keyof LocalizedString]}
                        onChange={e => setDescription(prev => ({ ...prev, [lang]: e.target.value }))}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['en', 'uz', 'ru'].map((lang) => (
                    <div key={`content-${lang}`} className="space-y-2">
                      <label className="text-xs font-mono uppercase text-foreground/50">Full Content ({lang})</label>
                      <textarea
                        required rows={4}
                        value={content[lang as keyof LocalizedString]}
                        onChange={e => setContent(prev => ({ ...prev, [lang]: e.target.value }))}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Media & Links */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-medium text-primary">Media & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-foreground/50">Image URL</label>
                    <input required value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/projects/img1.jpg or https://..." className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-foreground/50">Tech Stack (comma separated)</label>
                    <input required value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="React, Node.js, PostgreSQL" className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-foreground/50">GitHub URL</label>
                    <input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-foreground/50">Live Demo URL</label>
                    <input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className="w-full bg-black/30 border border-border rounded-xl px-4 py-2.5 text-foreground dark:text-white text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-primary hover:bg-teal-500 text-white px-8 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-primary/20">
                  <Save className="w-5 h-5" /> Save Project
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
