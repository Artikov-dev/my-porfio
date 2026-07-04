import React from 'react';
import { ParallaxHero } from '@/components/Hero/ParallaxHero';
import { AboutSection } from '@/components/Sections/About';
import { SkillsSection } from '@/components/Sections/Skills';
import { ExperienceSection } from '@/components/Sections/Experience';
import { ProjectsPreviewSection } from '@/components/Sections/ProjectsPreview';
import { ContactSection } from '@/components/Sections/Contact';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/I18nContext';
import { PageWrapper } from '@/components/Layout/PageWrapper';

export const Home = () => {
  const { t } = useI18n();
  return (
    <PageWrapper>
      <main className="bg-background min-h-screen relative pb-32">
      <Helmet>
        <title>Roma Artikov | {t('welcome') || 'Full-Stack Engineer'}</title>
        <meta name="description" content="I build high-performance, secure, and enterprise-grade web applications with a focus on Clean Architecture." />
      </Helmet>
      <div id="home">
        <ParallaxHero />
      </div>
      <div className="relative z-10 bg-background">
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsPreviewSection />
        <ContactSection />
      </div>
      </main>
    </PageWrapper>
  );
};
