import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';

const skillCategories = [
  {
    titleKey: "frontend_dev",
    skills: [
      { name: "React 19", percent: 95 },
      { name: "TypeScript", percent: 90 },
      { name: "TailwindCSS v4", percent: 98 },
      { name: "Framer Motion", percent: 85 },
      { name: "Zustand", percent: 90 }
    ]
  },
  {
    titleKey: "backend_eng",
    skills: [
      { name: "Node.js", percent: 92 },
      { name: "Express", percent: 95 },
      { name: "PostgreSQL", percent: 88 },
      { name: "Redis", percent: 80 },
      { name: "WebSockets", percent: 85 }
    ]
  },
  {
    titleKey: "arch_devops",
    skills: [
      { name: "Clean Architecture", percent: 95 },
      { name: "SOLID Principles", percent: 90 },
      { name: "Docker", percent: 75 },
      { name: "Nginx", percent: 70 },
      { name: "CI/CD", percent: 80 }
    ]
  }
];

export const SkillsSection = () => {
  const { t } = useI18n();

  return (
    <section id="skills" className="py-32 px-6 relative max-w-6xl mx-auto">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 tracking-tight text-center">
          {t('skills_title')}
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => (
          <ScrollReveal key={category.titleKey} delay={index * 0.2}>
            <div className="glass p-8 rounded-2xl border border-border h-full hover:border-primary/50 transition-all duration-300 group">
              <h3 className="text-xl font-bold text-foreground mb-8 group-hover:text-primary transition-colors">
                {t(category.titleKey)}
              </h3>
              <div className="flex flex-col gap-5">
                {category.skills.map(skill => (
                  <div key={skill.name} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-foreground/80">{skill.name}</span>
                      <span className="text-primary">{skill.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
