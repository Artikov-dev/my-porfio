import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    titleKey: "frontend_dev",
    skills: [
      { name: "React", percent: 95, color: "text-[#61DAFB]", bg: "hover:bg-[#61DAFB]/20" },
      { name: "TypeScript", percent: 90, color: "text-[#3178C6]", bg: "hover:bg-[#3178C6]/20" },
      { name: "TailwindCSS", percent: 98, color: "text-[#06B6D4]", bg: "hover:bg-[#06B6D4]/20" },
      { name: "Framer Motion", percent: 85, color: "text-[#0055FF]", bg: "hover:bg-[#0055FF]/20" },
      { name: "Zustand", percent: 90, color: "text-foreground", bg: "hover:bg-foreground/20" }
    ]
  },
  {
    titleKey: "backend_eng",
    skills: [
      { name: "Node.js", percent: 92, color: "text-[#339933]", bg: "hover:bg-[#339933]/20" },
      { name: "Express", percent: 95, color: "text-foreground", bg: "hover:bg-foreground/20" },
      { name: "PostgreSQL", percent: 88, color: "text-[#336791]", bg: "hover:bg-[#336791]/20" },
      { name: "Redis", percent: 80, color: "text-[#DC382D]", bg: "hover:bg-[#DC382D]/20" },
      { name: "WebSockets", percent: 85, color: "text-primary", bg: "hover:bg-primary/20" }
    ]
  },
  {
    titleKey: "arch_devops",
    skills: [
      { name: "Clean Arch", percent: 95, color: "text-purple-500", bg: "hover:bg-purple-500/20" },
      { name: "SOLID", percent: 90, color: "text-orange-500", bg: "hover:bg-orange-500/20" },
      { name: "Docker", percent: 75, color: "text-[#2496ED]", bg: "hover:bg-[#2496ED]/20" },
      { name: "Nginx", percent: 70, color: "text-[#009639]", bg: "hover:bg-[#009639]/20" },
      { name: "CI/CD", percent: 80, color: "text-red-500", bg: "hover:bg-red-500/20" }
    ]
  }
];

export const SkillsSection = () => {
  const { t } = useI18n();

  return (
    <section id="skills" className="py-20 md:py-32 px-4 md:px-6 relative max-w-6xl mx-auto overflow-hidden">
      <ScrollReveal>
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t('skills_title')}
          </h2>
          <p className="text-foreground/50 max-w-lg mx-auto">
            (Sichqoncha bilan ko'nikmalarni ushlab, tortib ko'ring!)
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {skillCategories.map((category, index) => {
          // Add a ref to constrain dragging within the parent
          const constraintsRef = useRef(null);

          return (
            <ScrollReveal key={category.titleKey} delay={index * 0.2}>
              <div 
                ref={constraintsRef} 
                className="glass p-6 rounded-3xl border border-white/5 h-[400px] hover:border-primary/30 transition-all duration-300 group flex flex-col relative overflow-hidden bg-background/50 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-foreground mb-6 text-center z-10 pointer-events-none">
                  {t(category.titleKey)}
                </h3>
                
                <div className="flex-1 relative w-full h-full flex flex-wrap content-center justify-center gap-4 z-20">
                  {category.skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      drag
                      dragConstraints={constraintsRef}
                      dragElastic={0.4}
                      dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
                      whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        damping: 12, 
                        stiffness: 100, 
                        delay: index * 0.2 + (i * 0.1) 
                      }}
                      className={`w-[100px] h-[100px] rounded-full glass border border-white/10 flex flex-col items-center justify-center text-center cursor-grab shadow-lg backdrop-blur-md bg-background/80 transition-colors ${skill.bg}`}
                    >
                      <span className={`text-xs font-bold mb-1 ${skill.color}`}>{skill.name}</span>
                      <span className="text-[10px] text-foreground/50 font-mono">{skill.percent}%</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Background glow per category */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0" />
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
