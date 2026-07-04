import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';

const experience = [
  {
    roleKey: "exp5_role",
    companyKey: "exp5_comp",
    period: "Jul 2026 - Present",
    descKey: "exp5_desc"
  },
  {
    roleKey: "exp4_role",
    companyKey: "exp4_comp",
    period: "2026",
    descKey: "exp4_desc"
  },
  {
    roleKey: "exp3_role",
    companyKey: "exp3_comp",
    period: "Dec 2025 - Apr 2026",
    descKey: "exp3_desc"
  },
  {
    roleKey: "exp2_role",
    companyKey: "exp2_comp",
    period: "Jul 2025 - Sep 2025",
    descKey: "exp2_desc"
  },
  {
    roleKey: "exp1_role",
    companyKey: "exp1_comp",
    period: "Nov 2024 - Jan 2025",
    descKey: "exp1_desc"
  }
];

export const ExperienceSection = () => {
  const { t } = useI18n();

  return (
    <section id="experience" className="py-32 px-6 relative max-w-4xl mx-auto">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 tracking-tight">
          {t('work_experience')}
        </h2>
      </ScrollReveal>

      <div className="space-y-12 border-l border-border pl-8 ml-4">
        {experience.map((exp, index) => (
          <ScrollReveal key={index} delay={index * 0.2}>
            <div className="relative">
              <div className="absolute -left-[41px] top-2 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{t(exp.roleKey)}</h3>
              <div className="text-primary font-medium mb-4">{t(exp.companyKey)} <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">{exp.period}</span></div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t(exp.descKey)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
