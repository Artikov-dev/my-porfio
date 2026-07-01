import React from 'react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/Button';

export const ResumeSection = () => {
  return (
    <section id="resume" className="py-32 px-6 relative max-w-6xl mx-auto">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 tracking-tight text-center">
          Curriculum Vitae
        </h2>
      </ScrollReveal>

      <div className="glass p-8 md:p-16 rounded-3xl border border-border flex flex-col md:flex-row items-center justify-between gap-12">
        <ScrollReveal delay={0.2} width="100%">
          <div className="space-y-6 max-w-xl">
            <h3 className="text-3xl font-bold text-foreground">Ready to build something incredible?</h3>
            <p className="text-foreground/70 text-lg leading-relaxed">
              Review my full professional history, technical qualifications, and comprehensive project portfolio in my official resume.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Button variant="solid" className="px-8 py-4 text-lg rounded-full group">
                  Download Resume (PDF)
                  <span className="ml-2 group-hover:translate-y-1 transition-transform inline-block">↓</span>
                </Button>
              </a>
              <a href="https://linkedin.com/in/roma-artikov" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="px-8 py-4 text-lg rounded-full">
                  View LinkedIn
                </Button>
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="relative w-48 h-64 md:w-64 md:h-80 bg-foreground/5 rounded-xl border border-border overflow-hidden shadow-2xl -rotate-6 hover:rotate-0 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 w-1/2 bg-foreground/20 rounded"></div>
              <div className="h-2 w-full bg-foreground/10 rounded"></div>
              <div className="h-2 w-full bg-foreground/10 rounded"></div>
              <div className="h-2 w-3/4 bg-foreground/10 rounded"></div>
              <div className="mt-8 space-y-2">
                <div className="h-2 w-full bg-foreground/10 rounded"></div>
                <div className="h-2 w-5/6 bg-foreground/10 rounded"></div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded">PDF</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
