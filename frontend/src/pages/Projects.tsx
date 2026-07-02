import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Github, ExternalLink } from 'lucide-react';

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.map((project: any) => (
              <div key={project.id} className="glass rounded-2xl flex flex-col overflow-hidden group border border-border hover:border-primary/50 transition-all duration-300 h-full">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" 
                    style={{ backgroundImage: `url(${project.image_url})` }}
                  />
                </div>
                
                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-foreground dark:text-white mb-3">
                    {project.title[language] || project.title.en}
                  </h3>
                  
                  <p className="text-foreground/70 line-clamp-3 mb-6 flex-grow">
                    {project.description?.[language] || project.description?.en || project.content?.[language]}
                  </p>

                  {/* Tech Stack Tags */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech_stack.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="solid" className="w-full flex items-center justify-center gap-2">
                          <ExternalLink size={16} />
                          {t('view_online')}
                        </Button>
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Github size={16} />
                          {t('view_github')}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
