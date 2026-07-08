import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/contexts/I18nContext';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/Button';
import { Code2, ExternalLink } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PageWrapper } from '@/components/Layout/PageWrapper';

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Custom glow background position
  const background = useTransform(
    [mouseXSpring, mouseYSpring],
    ([mouseX, mouseY]) => {
      const xp = (mouseX as number + 0.5) * 100;
      const yp = (mouseY as number + 0.5) * 100;
      return `radial-gradient(800px circle at ${xp}% ${yp}%, rgba(34,197,94,0.15), transparent 40%)`;
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative group perspective-[1000px] ${className}`}
    >
      <motion.div 
        className="absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />
      <div className="h-full" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};


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
    <PageWrapper>
      <div className="min-h-screen bg-background pt-24 md:pt-32 px-4 md:px-6">
      <Helmet>
        <title>Roma Artikov | {t('projects')}</title>
        <meta name="description" content={`Explore my latest projects and case studies. | Roma Artikov`} />
      </Helmet>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-8 md:mb-10">{t('projects')}</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass rounded-2xl flex flex-col overflow-hidden border border-border h-[500px]">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-6 flex flex-col flex-grow">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex gap-2 mb-6">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-border">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <Skeleton className="h-10 flex-1 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data?.map((project: any) => (
              <TiltCard key={project.id} className="h-full">
                <div className="glass rounded-2xl flex flex-col overflow-hidden group/card border border-border hover:border-primary/50 transition-all duration-300 h-full bg-background/50 backdrop-blur-xl shadow-2xl">
                  {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover/card:scale-110 transition-transform duration-700" 
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
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border mt-auto">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1 w-full">
                        <Button variant="solid" className="w-full flex items-center justify-center gap-2">
                          <ExternalLink size={16} />
                          {t('view_online')}
                        </Button>
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 w-full">
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
            ))}
          </div>
        )}
      </div>
      </div>
    </PageWrapper>
  );
};
