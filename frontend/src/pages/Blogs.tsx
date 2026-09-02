import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/contexts/I18nContext';
import { PageWrapper } from '@/components/Layout/PageWrapper';
import { SEO } from '@/components/SEO/SEO';
import { DEFAULT_BLOGS, BlogItem } from '@/lib/mockBlogs';
import { BlogModal } from '@/components/Blogs/BlogModal';
import { Clock, Eye, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Blogs = () => {
  const { t, language } = useI18n();
  const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      try {
        const res = await api.get('/blogs', { timeout: 6000 });
        if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          return res.data.data;
        }
        return DEFAULT_BLOGS;
      } catch (err) {
        return DEFAULT_BLOGS;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const displayBlogs: BlogItem[] = (data && data.length > 0) ? data : DEFAULT_BLOGS;

  const handleOpenBlog = (blog: BlogItem) => {
    setSelectedBlog(blog);
    if (!sessionStorage.getItem(`viewed_blog_${blog.id}`)) {
      sessionStorage.setItem(`viewed_blog_${blog.id}`, 'true');
      api.post(`/blogs/${blog.id}/view`).catch(() => {});
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20 px-4 md:px-6">
        <SEO title={t('blog')} />
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering & Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              {t('blog')}
            </h1>
            <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto">
              {language === 'uz' 
                ? 'Dasturlash, arxitektura, yuqori unumdorlik va yangi texnologiyalar bo\'yicha amaliy maqolalar.'
                : language === 'ru'
                ? 'Практические статьи о веб-разработке, системной архитектуре и современных технологиях.'
                : 'Practical engineering articles on full-stack architecture, performance, and modern web systems.'
              }
            </p>
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass p-6 rounded-2xl flex flex-col sm:flex-row gap-6 border border-border">
                  <Skeleton className="w-full h-48 sm:w-56 sm:h-36 rounded-xl flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-3 pt-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {displayBlogs.map((blog: BlogItem, index: number) => {
                const title = blog.title[language] || blog.title.en || '';
                const content = blog.content[language] || blog.content.en || '';
                const cleanSnippet = content.replace(/[#`*\-]/g, '').slice(0, 160) + '...';

                return (
                  <motion.div 
                    key={blog.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => handleOpenBlog(blog)}
                    className="group glass p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-6 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-48 sm:w-56 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 bg-foreground/5">
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                        style={{ backgroundImage: `url(${blog.image_url})`}} 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-semibold bg-background/80 backdrop-blur-md rounded-lg text-foreground border border-border flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-primary" />
                        {t('quick_read')}
                      </span>
                    </div>

                    {/* Content preview */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {blog.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-primary/10 text-primary">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                          {title}
                        </h3>

                        <p className="text-foreground/70 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {cleanSnippet}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-border text-xs sm:text-sm text-foreground/60">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {blog.reading_time} {t('min_read')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            {blog.views} {t('views')}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                          <span>{t('quick_read')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quick Read Modal */}
      <BlogModal
        blog={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />
    </PageWrapper>
  );
};
