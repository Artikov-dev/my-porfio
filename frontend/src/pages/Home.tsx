import React from 'react';
import { ParallaxHero } from '@/components/Hero/ParallaxHero';
import { AboutSection } from '@/components/Sections/About';
import { SkillsSection } from '@/components/Sections/Skills';
import { GithubActivity } from '@/components/Sections/GithubActivity';
import { ExperienceSection } from '@/components/Sections/Experience';
import { ProjectsPreviewSection } from '@/components/Sections/ProjectsPreview';
import { ContactSection } from '@/components/Sections/Contact';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '@/contexts/I18nContext';
import { PageWrapper } from '@/components/Layout/PageWrapper';

import { SEO } from '@/components/SEO/SEO';

export const Home = () => {
  const { t } = useI18n();
  return (
    <PageWrapper>
      <main className="bg-background min-h-screen relative pb-32 overflow-x-hidden w-full">
      <SEO title={t('welcome') || 'Full-Stack Engineer'} />
      <div id="home">
        <ParallaxHero />
      </div>
      <div className="relative z-10 bg-background">
        <AboutSection />
        <SkillsSection />
        <GithubActivity />
        <ExperienceSection />
        <ProjectsPreviewSection />
        <ContactSection />
      </div>
      </main>
    </PageWrapper>
  );
};
