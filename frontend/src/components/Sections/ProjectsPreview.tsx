import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
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
    <section id="projects" className="py-32 px-6 relative max-w-6xl mx-auto text-center">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight">
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
            <ScrollReveal key={project.id} delay={0.2 + (index * 0.1)}>
              <TiltCard>
                <div className="glass p-8 rounded-2xl h-[300px] flex flex-col justify-end relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url(${project.image_url})` }}
                  ></div>
                  <div className="relative z-20" style={{ transform: 'translateZ(50px)' }}>
                    <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">
                      {project.title[language] || project.title.en}
                    </h3>
                    <p className="text-foreground/70 line-clamp-2">
                      {project.tech_stack || project.description?.[language] || project.description?.en}
                    </p>
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
