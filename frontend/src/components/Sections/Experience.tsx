import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';

// Periods are stored as 'YYYY-MM' (or 'YYYY') and formatted in the visitor's language
const LOCALES = { en: 'en-US', uz: 'uz-UZ', ru: 'ru-RU' } as const;

const experience = [
  {
    roleKey: "exp5_role",
    companyKey: "exp5_comp",
    start: "2026-07", end: null,
    descKey: "exp5_desc"
  },
  {
    roleKey: "exp4_role",
    companyKey: "exp4_comp",
    start: "2026", end: undefined,
    descKey: "exp4_desc"
  },
  {
    roleKey: "exp3_role",
    companyKey: "exp3_comp",
    start: "2025-12", end: "2026-04",
    descKey: "exp3_desc"
  },
  {
    roleKey: "exp2_role",
    companyKey: "exp2_comp",
    start: "2025-07", end: "2025-09",
    descKey: "exp2_desc"
  },
  {
    roleKey: "exp1_role",
    companyKey: "exp1_comp",
    start: "2024-11", end: "2025-01",
    descKey: "exp1_desc"
  }
];

export const ExperienceSection = () => {
  const { t, language } = useI18n();

  const formatDate = (value: string) => {
    if (!value.includes('-')) return value; // year only
    const [year, month] = value.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString(LOCALES[language], { month: 'short', year: 'numeric' });
  };

  // end: null → still working there, undefined → single year
  const formatPeriod = (start: string, end: string | null | undefined) =>
    end === undefined ? formatDate(start) : `${formatDate(start)} – ${end === null ? t('present') : formatDate(end)}`;

  return (
    <section id="experience" className="py-20 md:py-32 px-4 md:px-6 relative max-w-4xl mx-auto">
      <ScrollReveal>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-12 md:mb-16 tracking-tight">
          {t('work_experience')}
        </h2>
      </ScrollReveal>

      <div className="space-y-12 border-l border-border pl-8 ml-4">
        {experience.map((exp, index) => (
          <ScrollReveal key={index} delay={index * 0.2}>
            <div className="relative">
              <div className="absolute -left-[41px] top-2 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{t(exp.roleKey)}</h3>
              <div className="text-primary font-medium mb-4">{t(exp.companyKey)} <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">{formatPeriod(exp.start, exp.end)}</span></div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t(exp.descKey)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
