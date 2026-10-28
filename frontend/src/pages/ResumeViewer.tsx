import React, { useEffect, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { buttonClassName } from '@/components/ui/Button';
import { Download, ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/Layout/PageWrapper';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO/SEO';
import { getResume } from '@/lib/resume';
import { cn } from '@/lib/utils';
import { PdfPages, PdfStatus } from '@/components/Resume/PdfPages';
import { GithubIcon, LinkedinIcon, MailIcon, TelegramIcon } from '@/components/ui/SocialIcons';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'uz', label: "O'zbekcha" },
  { code: 'ru', label: 'Русский' },
] as const;

const CONTACTS = [
  { name: 'Telegram', value: '@artikov_06_tt', href: 'https://t.me/artikov_06_tt', Icon: TelegramIcon },
  { name: 'LinkedIn', value: 'in/artikovdev', href: 'https://www.linkedin.com/in/artikovdev/', Icon: LinkedinIcon },
  { name: 'GitHub', value: 'Artikov-dev', href: 'https://github.com/Artikov-dev', Icon: GithubIcon },
  { name: 'Email', value: 'artikovrozik52@gmail.com', href: 'mailto:artikovrozik52@gmail.com', Icon: MailIcon },
];

// Shown when the PDF can't be loaded or rendered
const NoPreview = ({ pdfUrl, fileName }: { pdfUrl: string; fileName: string }) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <p className="text-sm text-foreground/50 mb-2 break-all">{fileName}</p>
      <p className="text-foreground/70 mb-6 leading-relaxed">{t('resume_no_preview')}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={buttonClassName('solid', 'flex items-center justify-center gap-2 px-6 py-3 rounded-xl')}>
          <ExternalLink className="w-5 h-5" /> {t('resume_open')}
        </a>
        <a href={pdfUrl} download={fileName} className={buttonClassName('outline', 'flex items-center justify-center gap-2 px-6 py-3 rounded-xl')}>
          <Download className="w-5 h-5" /> {t('download_cv')}
        </a>
      </div>
    </div>
  );
};

export const ResumeViewer = () => {
  const { language, setLanguage, t } = useI18n();
  const [status, setStatus] = useState<PdfStatus>('loading');
  const { url: pdfUrl, fileName } = getResume(language);
  const pageLabel = React.useCallback((n: number) => t('resume_page').replace('{n}', String(n)), [t]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageWrapper>
      <SEO title={t('resume')} />
      <div className="min-h-screen max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-10 pb-16 grid gap-6 lg:gap-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Sidebar: who, which language, get the file, how to reach me */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:sticky lg:top-8 self-start flex flex-col gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors w-fit rounded-md focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="w-4 h-4" /> {t('resume_back')}
          </Link>

          <div className="rounded-2xl border border-border bg-background p-5 md:p-6 flex flex-col gap-5">
            <div className="flex items-center gap-4 lg:flex-col lg:items-start">
              <img
                src="/imRA.webp"
                alt=""
                width={72}
                height={72}
                className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-full object-cover border border-border"
              />
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight leading-tight">Ro'zimuhammad Artikov</h1>
                <p className="text-sm text-foreground/60 mt-1">
                  {t('hero_title1')} {t('hero_title2')}
                </p>
              </div>
            </div>

            <div>
              <p id="cv-language" className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-2">
                {t('resume_language')}
              </p>
              <div role="radiogroup" aria-labelledby="cv-language" className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-foreground/5">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    role="radio"
                    aria-checked={language === code}
                    title={label}
                    onClick={() => setLanguage(code)}
                    className={cn(
                      'h-9 rounded-lg text-xs font-semibold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-primary',
                      language === code
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-foreground/60 hover:text-foreground',
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              <a href={pdfUrl} download={fileName} className={buttonClassName('solid', 'flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm')}>
                <Download className="w-4 h-4" /> {t('download_cv')}
              </a>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={buttonClassName('outline', 'flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm')}>
                <ExternalLink className="w-4 h-4" /> {t('resume_open')}
              </a>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/50 mb-2">{t('resume_contacts')}</p>
              <ul className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                {CONTACTS.map(({ name, value, href, Icon }) => (
                  <li key={name}>
                    <a
                      href={href}
                      target={href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground/70 hover:text-primary hover:bg-foreground/5 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        <span className="sr-only">{name}: </span>
                        {value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.aside>

        {/* The "desk": CV pages rendered as paper sheets */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          aria-busy={status === 'loading'}
          className="min-w-0 rounded-2xl bg-foreground/[0.04] border border-border p-3 sm:p-6 md:p-8"
        >
          {status === 'loading' && <p className="sr-only" role="status">{t('resume_loading')}</p>}
          {status === 'error' && <NoPreview pdfUrl={pdfUrl} fileName={fileName} />}
          {/* Always mounted (renders nothing on error) so switching language retries the load */}
          <PdfPages url={pdfUrl} pageLabel={pageLabel} onStatusChange={setStatus} />
        </motion.main>
      </div>
    </PageWrapper>
  );
};
