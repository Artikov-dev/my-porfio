import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { useI18n } from '@/contexts/I18nContext';

export const ProjectsPreviewSection = () => {
  const { t } = useI18n();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
        <ScrollReveal delay={0.2}>
          <TiltCard>
            <div className="glass p-8 rounded-2xl h-[300px] flex flex-col justify-end relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="relative z-20" style={{ transform: 'translateZ(50px)' }}>
                <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">E-Commerce Microservices</h3>
                <p className="text-foreground/70">Node.js • Redis • Kubernetes</p>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <TiltCard>
            <div className="glass p-8 rounded-2xl h-[300px] flex flex-col justify-end relative overflow-hidden group cursor-pointer border border-border hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
              <div className="relative z-20" style={{ transform: 'translateZ(50px)' }}>
                <h3 className="text-2xl font-bold text-foreground dark:text-white mb-2">FinTech Analytics Dashboard</h3>
                <p className="text-foreground/70">React • D3.js • WebSockets</p>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>
      </div>

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
