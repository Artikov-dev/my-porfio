import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';

const experience = [
  {
    roleKey: "exp1_role",
    companyKey: "exp1_comp",
    period: "2024 - Present",
    descKey: "exp1_desc"
  },
  {
    roleKey: "exp2_role",
    companyKey: "exp2_comp",
    period: "2021 - 2024",
    descKey: "exp2_desc"
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
              <h3 className="text-2xl font-bold text-foreground dark:text-white mb-1">{t(exp.roleKey)}</h3>
              <div className="text-primary font-medium mb-4">{t(exp.companyKey)} <span className="text-gray-500 text-sm ml-2">{exp.period}</span></div>
              <p className="text-foreground/60 leading-relaxed">{t(exp.descKey)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
