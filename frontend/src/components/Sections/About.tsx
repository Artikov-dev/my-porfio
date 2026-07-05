import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';

export const AboutSection = () => {
  const { t, language } = useI18n();

  const title = language === 'uz' ? 'Men Haqimda' : language === 'ru' ? 'Обо мне' : 'About Me';

  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-6 relative max-w-6xl mx-auto">
      <ScrollReveal>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 md:mb-16 tracking-tight">
          {title}
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <ScrollReveal delay={0.2}>
          <div className="space-y-6 text-foreground/60 text-lg leading-relaxed">
            <p>{t('about_p1')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('about_p2').replace('Clean Architecture', '<strong>Clean Architecture</strong>') }}></p>
            <p>{t('about_p3')}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="relative group h-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass aspect-square rounded-2xl overflow-hidden border border-border flex items-center justify-center bg-foreground/5">
              <img
                src="/imRA.jpg"
                alt="Roma Artikov"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
