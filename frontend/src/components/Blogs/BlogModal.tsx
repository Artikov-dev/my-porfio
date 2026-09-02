import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Eye, Calendar, Share2, Check, ArrowLeft, Bookmark, Sparkles } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { BlogItem } from '@/lib/mockBlogs';

interface BlogModalProps {
  blog: BlogItem | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ blog, onClose }) => {
  const { t, language } = useI18n();
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (blog) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blog, onClose]);

  if (!blog) return null;

  const title = blog.title[language] || blog.title.en || '';
  const content = blog.content[language] || blog.content.en || '';

  const formattedDate = new Date(blog.created_at || Date.now()).toLocaleDateString(
    language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(`${title} - ${url}`);
    setCopied(true);
    toast.success(t('copied') || 'Link copied!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper to parse simple markdown to rich JSX elements
  const renderContent = (rawText: string) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'code';
          codeLines = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${index}`} className="my-6 rounded-2xl overflow-hidden border border-border/80 bg-slate-950 shadow-xl font-mono text-sm">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
                  <span className="ml-2 font-semibold text-slate-300 uppercase">{codeLanguage}</span>
                </span>
                <span className="text-slate-500 text-[11px]">snippet</span>
              </div>
              <pre className="p-4 md:p-5 overflow-x-auto text-cyan-300 leading-relaxed font-mono">
                <code>{codeLines.join('\n')}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl md:text-3xl font-extrabold text-foreground mt-10 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Bullet points
      if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${index}`} className="ml-5 list-disc text-foreground/85 my-2 leading-relaxed">
            {renderInlineCode(line.replace('- ', ''))}
          </li>
        );
        return;
      }

      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        elements.push(
          <div key={`num-${index}`} className="flex items-start gap-3 my-2 text-foreground/85 leading-relaxed">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
              {line.match(/^\d+/)?.[0]}
            </span>
            <p className="flex-1">{renderInlineCode(line.replace(/^\d+\.\s*/, ''))}</p>
          </div>
        );
        return;
      }

      // Normal paragraph (ignore empty lines)
      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="text-foreground/80 leading-relaxed my-4 text-base md:text-lg">
            {renderInlineCode(line)}
          </p>
        );
      }
    });

    return elements;
  };

  // Helper for inline `code` highlights
  const renderInlineCode = (text: string) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm font-semibold border border-primary/20">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-background/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Close Button */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label="Share article"
              className="p-2.5 rounded-full bg-background/80 dark:bg-slate-800/80 backdrop-blur-md border border-border text-foreground hover:text-primary hover:border-primary/50 transition-all shadow-lg"
              title={t('share')}
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2.5 rounded-full bg-background/80 dark:bg-slate-800/80 backdrop-blur-md border border-border text-foreground hover:text-red-500 hover:border-red-500/50 transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {/* Cover Image Banner */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${blog.image_url})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-slate-900 via-background/60 dark:via-slate-900/60 to-transparent" />
              
              {/* Floating Tags */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2 z-10">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 backdrop-blur-md text-primary border border-primary/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Content Container */}
            <div className="px-6 md:px-12 py-8 max-w-3xl mx-auto">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-foreground/60 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{blog.reading_time} {t('min_read')}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>{blog.views} {t('views')}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-8 leading-snug">
                {title}
              </h1>

              {/* Author Info Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 border border-border/60 mb-8">
                <img
                  src="/imRA.jpg"
                  alt="Roma Artikov"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/40"
                  onError={(e) => {
                    // Fallback if image not found
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
                  }}
                />
                <div>
                  <h4 className="font-bold text-foreground text-sm">Roma Artikov</h4>
                  <p className="text-xs text-foreground/60">Full-Stack Engineer & Author</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-primary/10 text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Tech Article
                  </span>
                </div>
              </div>

              {/* Rendered Body Content */}
              <div className="article-body">
                {renderContent(content)}
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('close')}
                </Button>

                <Button
                  variant="solid"
                  onClick={handleShare}
                  className="w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? t('copied') : t('share')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
