import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';

// Custom SVG Icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const ContactSection = () => {
  const { t } = useI18n();

  const socials = [
    {
      name: 'Telegram',
      icon: <TelegramIcon className="w-8 h-8" />,
      href: 'https://t.me/artikov_06_tt',
      color: 'hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10'
    },
    {
      name: 'Instagram',
      icon: <InstagramIcon className="w-8 h-8" />,
      href: 'https://instagram.com/artikovv_r',
      color: 'hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinIcon className="w-8 h-8" />,
      href: 'https://www.linkedin.com/in/artikovdev/',
      color: 'hover:text-blue-600 hover:border-blue-600/50 hover:bg-blue-600/10'
    },
    {
      name: 'GitHub',
      icon: <GithubIcon className="w-8 h-8" />,
      href: 'https://github.com/Artikov-dev',
      color: 'hover:text-foreground dark:text-white hover:border-white/50 hover:bg-foreground/10'
    },
    {
      name: 'Email',
      icon: <MailIcon className="w-8 h-8" />,
      href: 'mailto:artikovrozik52@gmail.com',
      color: 'hover:text-teal-400 hover:border-teal-400/50 hover:bg-teal-400/10'
    }
  ];

  return (
    <section id="contact" className="py-32 px-6 relative max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 tracking-tight text-center">
          {t('get_in_touch')}
        </h2>
        <p className="text-center text-foreground/60 mb-16 text-lg max-w-2xl mx-auto">
          {t('contact_desc')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {socials.map((social) => (
            <a 
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-8 rounded-2xl glass border border-white/5 transition-all duration-300 group ${social.color}`}
            >
              <div className="text-foreground/70 transition-colors duration-300 group-hover:text-inherit mb-4">
                {social.icon}
              </div>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-inherit transition-colors duration-300">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};
