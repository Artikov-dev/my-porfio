import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/contexts/I18nContext';
import { api } from '@/lib/api';
import { GithubIcon, LinkedinIcon, InstagramIcon, MailIcon, TelegramIcon } from '@/components/ui/SocialIcons';

const EMPTY_FORM = { name: '', email: '', subject: '', body: '' };

const inputClass =
  'w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-colors';

// Posts to /api/contact — saved in the DB, shown in the admin "Messages" page and sent to Telegram
const ContactForm = () => {
  const { t } = useI18n();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  const update = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || null,
        body: form.body.trim(),
      });
      toast.success(t('form_success'));
      setForm(EMPTY_FORM);
    } catch (err: any) {
      toast.error(err?.response?.status === 429 ? t('form_rate_limited') : t('form_error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass border border-border rounded-2xl p-6 md:p-8 space-y-4 text-left">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{t('form_title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="text-sm text-foreground/70">{t('form_name')}</label>
          <input id="contact-name" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-sm text-foreground/70">{t('form_email')}</label>
          <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={update('email')} className={inputClass} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-sm text-foreground/70">{t('form_subject')}</label>
        <input id="contact-subject" maxLength={200} value={form.subject} onChange={update('subject')} className={inputClass} />
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-body" className="text-sm text-foreground/70">{t('form_message')}</label>
        <textarea id="contact-body" required minLength={10} maxLength={2000} rows={5} value={form.body} onChange={update('body')} className={`${inputClass} resize-y`} />
      </div>
      <Button type="submit" variant="solid" isLoading={sending} className="w-full md:w-auto px-8 py-3 text-base rounded-xl">
        {t('form_send')}
      </Button>
    </form>
  );
};

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
      color: 'hover:text-primary hover:border-primary/50 hover:bg-primary/10'
    }
  ];

  return (
    <section id="contact" className="py-20 md:py-32 px-4 md:px-6 relative max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-8 tracking-tight text-center">
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
              className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl glass border border-white/5 transition-all duration-300 group ${social.color}`}
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

      <ScrollReveal delay={0.2} className="mt-12">
        <ContactForm />
      </ScrollReveal>
    </section>
  );
};
