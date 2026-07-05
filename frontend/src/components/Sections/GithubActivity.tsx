import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from '@/contexts/ThemeContext';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ExternalLink, GitCommit, GitPullRequest, Star, GitBranch } from 'lucide-react';

export const GithubActivity = () => {
  const { theme } = useTheme();

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative max-w-6xl mx-auto">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/10 dark:bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

      <ScrollReveal>
        <div className="flex flex-col items-center justify-center text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium text-sm mb-6 border border-green-500/20">
            <GitCommit size={16} />
            <span>Open Source Contributions</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Days I <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Code</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl text-lg">
            Consistent efforts build great products. Here is a snapshot of my daily coding activity on GitHub.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="relative z-10 group">
          {/* Main Card */}
          <div className="glass rounded-3xl p-1 border border-white/10 shadow-2xl bg-gradient-to-br from-background/80 to-background overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_50px_-15px_rgba(34,197,94,0.4)] hover:border-green-500/30">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 border-b border-white/5 bg-foreground/[0.02]">
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-0">
                <div className="relative group/avatar cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full blur opacity-50 group-hover/avatar:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  <img 
                    src="https://github.com/Artikov-dev.png" 
                    alt="GitHub Avatar" 
                    className="w-16 h-16 rounded-full relative z-10 border-2 border-background transition-transform duration-500 group-hover/avatar:scale-110 group-hover/avatar:rotate-3"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    Roma Artikov
                  </h3>
                  <a href="https://github.com/Artikov-dev" target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-green-500 transition-colors flex items-center gap-1 text-sm mt-1">
                    @Artikov-dev <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="https://github.com/Artikov-dev" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group/btn flex items-center gap-2 px-6 py-2 rounded-xl bg-foreground text-background hover:bg-green-500 hover:text-white transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-green-500/25 active:scale-95"
                >
                  <GitBranch size={16} className="transition-transform group-hover/btn:rotate-12 group-hover/btn:scale-110" /> Follow
                </a>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="p-4 md:p-8 w-full flex items-center justify-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] relative group">
              {/* Tooltip hint for empty spaces */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none opacity-50 md:opacity-0 transition-opacity group-hover:opacity-0" />
              
              <div className="min-w-max transition-all duration-700 hover:scale-[1.02] cursor-crosshair">
                <GitHubCalendar 
                  username="Artikov-dev" 
                  colorScheme={theme === 'dark' ? 'dark' : 'light'}
                  blockSize={14}
                  blockMargin={5}
                  fontSize={14}
                  theme={{
                    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
