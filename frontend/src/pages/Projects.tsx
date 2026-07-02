import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';

export const Projects = () => {
  const { t, language } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data.data;
    }
  });

  return (
    <div className="min-h-screen bg-background pt-32 px-6">
      <Helmet>
        <title>Roma Artikov | {t('projects')}</title>
        <meta name="description" content={`Explore my latest projects and case studies. | Roma Artikov`} />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground dark:text-white mb-10">{t('projects')}</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((project: any) => (
              <div key={project.id} className="glass p-6 rounded-xl hover:border-primary/50 transition-colors">
                <div className="h-40 bg-foreground/5 rounded-lg mb-4 bg-cover bg-center" style={{ backgroundImage: `url(${project.image_url})`}} />
                <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{project.title[language] || project.title.en}</h3>
                <p className="text-foreground/60 text-sm line-clamp-2">{project.description[language] || project.description.en}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
