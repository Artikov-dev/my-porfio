import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '@/components/Layout/PageWrapper';

export const Blogs = () => {
  const { t, language } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data.data;
    }
  });

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background pt-24 md:pt-32 px-4 md:px-6">
      <Helmet>
        <title>Roma Artikov | {t('blog')}</title>
        <meta name="description" content={`Read technical articles and insights by Roma Artikov.`} />
      </Helmet>
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-8 md:mb-10">{t('blog')}</h1>
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass p-6 rounded-xl flex flex-col sm:flex-row gap-6">
                <Skeleton className="w-full h-48 sm:w-32 sm:h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {data?.map((blog: any) => (
              <div key={blog.id} className="glass p-6 rounded-xl flex flex-col sm:flex-row gap-6 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-full h-48 sm:w-32 sm:h-24 bg-foreground/5 rounded-lg flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${blog.image_url})`}} />
                <div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{blog.title[language] || blog.title.en}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>{blog.reading_time} min read</span>
                    <span>•</span>
                    <span>{blog.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </PageWrapper>
  );
};
