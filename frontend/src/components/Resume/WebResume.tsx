import React from 'react';
import { Mail, Phone, MapPin, Globe, Briefcase } from 'lucide-react';

export const WebResume = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-2xl overflow-hidden min-h-full flex flex-col md:flex-row">
        
        {/* Left Column (Dark Sidebar) */}
        <div className="w-full md:w-[35%] bg-slate-900 dark:bg-black text-slate-300 p-8 flex flex-col">
          
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-light text-white tracking-wide mb-1">
              RO'ZIMUHAMMADXON
            </h1>
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">
              ARTIKOV
            </h1>
            <div className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-semibold tracking-widest uppercase">
              Frontend Developer
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Contact</h2>
            <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                <Phone size={16} />
              </div>
              <span>+998 99 817 47 46</span>
            </div>
            <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                <Mail size={16} />
              </div>
              <span>artikovrozik52@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                <MapPin size={16} />
              </div>
              <span>Tashkent, Uzbekistan</span>
            </div>
            <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                <Globe size={16} />
              </div>
              <span>github.com/Artikov-dev</span>
            </div>
            <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary">
                <Briefcase size={16} />
              </div>
              <span>linkedin.com/in/ArtikovDev</span>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['React.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Redux / Zustand', 'Next.js', 'Node.js', 'FastAPI', 'Git & GitHub'].map(skill => (
                <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Languages</h2>
            <div className="flex justify-between items-center text-sm">
              <span>Uzbek</span>
              <span className="text-primary font-medium">Native</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>English</span>
              <span className="text-primary font-medium">B2 / Upper-Int</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Russian</span>
              <span className="text-primary font-medium">Conversational</span>
            </div>
          </div>

        </div>

        {/* Right Column (Light Content) */}
        <div className="w-full md:w-[65%] p-8 md:p-12">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              Career Summary
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
              Modern web ilovalar yaratishda 1 yildan ortiq real amaliy tajribaga ega dasturchi. 
              Kichik jamoalarda frontend jarayonlarini boshqarish, hackathon'larda qatnashish orqali bosim ostida ishlash ko'nikmalarini shakllantirganman.
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Mobile (Kotlin, Java) va Backend (FastAPI) texnologiyalarida ham tajribaga egaman. Jamoaviy ishlashga, yangi bilimlarni o'rganishga va rivojlanishga doim tayyorman.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              Experience
            </h2>
            
            <div className="space-y-8">
              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Frontend Developer</h3>
                <div className="text-primary text-sm font-medium mb-2">MohirLab Inc. <span className="text-slate-500 font-normal">| Dec 2025 – Apr 2026</span></div>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Worked on developing web applications and maintaining existing projects.</li>
                  <li>Participated in building and optimizing UI components using React and JavaScript.</li>
                  <li>Handled API integration and ensured smooth frontend-backend communication.</li>
                  <li>Collaborated with the team on new feature development and debugging processes.</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_rgba(20,184,166,0.8)]"></div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Frontend Mentor (Instructor)</h3>
                <div className="text-primary text-sm font-medium mb-2">PDP Junior <span className="text-slate-500 font-normal">| Jul 2025 – Sep 2025</span></div>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Delivered practical frontend development lessons to 20+ students.</li>
                  <li>Conducted project-based training in HTML, CSS, and JavaScript.</li>
                  <li>Helped students improve coding skills and problem-solving abilities.</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full -left-[7px] top-1.5"></div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quality Control Specialist</h3>
                <div className="text-slate-500 text-sm font-medium mb-2">PDP University <span className="font-normal">| 2026 (1 month)</span></div>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Worked in the Education Quality Control Department.</li>
                  <li>Participated in monitoring academic processes and preparing reports.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              Education
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Bachelor's degree (in progress)</h3>
              <div className="text-primary text-sm font-medium mb-2">PDP University <span className="text-slate-500 font-normal">| Sep 2024 – Present</span></div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Field: Information and Digital Technologies<br/>
                Specialization: Software Development (Web Development)
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
