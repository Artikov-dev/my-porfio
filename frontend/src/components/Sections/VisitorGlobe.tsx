import React from 'react';
import { LiveGlobe } from '@/components/ui/LiveGlobe';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';
import { Globe, Users, Activity } from 'lucide-react';

export const VisitorGlobe = () => {
  const { t } = useI18n();

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative max-w-6xl mx-auto">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 dark:bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

      <ScrollReveal>
        <div className="flex flex-col items-center justify-center text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium text-sm mb-6 border border-green-500/20">
            <Globe size={16} className="animate-spin-slow" />
            <span>Live Network</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Global Reach
          </h2>
          <p className="text-foreground/60 max-w-2xl text-lg">
            A real-time visualization of where people are visiting this portfolio from. Built with WebSockets and IP Geolocation.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="relative z-10">
          <div className="glass rounded-3xl p-6 md:p-12 border border-white/10 shadow-2xl bg-gradient-to-br from-background/80 to-background overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_-15px_rgba(34,197,94,0.3)] hover:border-green-500/30 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            
            {/* Globe Container */}
            <div className="w-full md:w-1/2 flex-1 order-2 md:order-1">
              <LiveGlobe />
            </div>

            {/* Info Metrics */}
            <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 order-1 md:order-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-white/5 hover:border-green-500/20 transition-colors">
                <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">Real-time Connection</h4>
                  <p className="text-sm text-foreground/60">Using WebSockets to instantly detect and display active visitors on the map.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-white/5 hover:border-green-500/20 transition-colors">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">Worldwide Traffic</h4>
                  <p className="text-sm text-foreground/60">Aggregating geolocation data to create an interactive heat map of all-time visits.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-foreground/[0.02] border border-white/5 hover:border-green-500/20 transition-colors">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">Interactive 3D</h4>
                  <p className="text-sm text-foreground/60">Rendered seamlessly at 60fps using a lightweight WebGL engine for maximum performance.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
