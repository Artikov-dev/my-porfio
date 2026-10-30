import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';
import { EXPERIENCE, formatPeriod } from '@/lib/experience';


export const ExperienceSection = () => {
  const { t, language } = useI18n();

  return (
    <section id="experience" className="py-20 md:py-32 px-4 md:px-6 relative max-w-4xl mx-auto">
      <ScrollReveal>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 md:mb-16 tracking-tight">
          {t('work_experience')}
        </h2>
      </ScrollReveal>

      <div className="space-y-12 border-l border-border pl-8 ml-4">
        {EXPERIENCE.map((exp, index) => (
          <ScrollReveal key={index} delay={index * 0.2}>
            <div className="relative">
              <div className="absolute -left-[41px] top-2 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{t(exp.roleKey)}</h3>
              <div className="text-primary font-medium mb-4">{t(exp.companyKey)} <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">{formatPeriod(exp, language, t('present'))}</span></div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t(exp.descKey)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
