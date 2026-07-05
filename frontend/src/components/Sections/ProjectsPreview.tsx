import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { Code2, ExternalLink } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export const ProjectsPreviewSection = () => {
  const { t, language } = useI18n();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data.data;
    }
  });

  return (
    <section id="projects" className="py-20 md:py-32 px-4 md:px-6 relative max-w-6xl mx-auto text-center">
      <ScrollReveal>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 tracking-tight">
          {t('featured_eng')}
        </h2>
        <p className="text-foreground/60 max-w-2xl mx-auto mb-16 text-lg">
          {t('featured_desc')}
        </p>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-left">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-left">
          {projects?.slice(0, 3).map((project: any, index: number) => (
            <ScrollReveal key={project.id} delay={0.2 + (index * 0.1)} className="h-full">
              <TiltCard className="h-full">
                <div className="glass rounded-2xl flex flex-col overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-all duration-300 h-full">
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
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1 w-full" onClick={(e) => e.stopPropagation()}>
                          <Button variant="solid" className="w-full flex items-center justify-center gap-2">
                            <ExternalLink size={16} />
                            {t('view_online')}
                          </Button>
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 w-full" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <Code2 size={16} />
                            {t('view_github')}
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      )}

      <ScrollReveal delay={0.6}>
        <Link to="/projects">
          <Button variant="solid" className="px-8 py-4 text-lg rounded-full">
            {t('view_all_projects')}
          </Button>
        </Link>
      </ScrollReveal>
    </section>
  );
};
