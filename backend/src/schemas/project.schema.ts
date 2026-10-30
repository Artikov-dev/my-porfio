import { z } from 'zod';

// Upper bounds keep a single admin request from storing megabytes of text (and keep the
// cached project list small). Long-form fields get more room than titles.
export const localizedString = (max: number) =>
  z.object({
    en: z.string().min(1, 'English text is required').max(max),
    uz: z.string().min(1, 'Uzbek text is required').max(max),
    ru: z.string().min(1, 'Russian text is required').max(max),
  });

export const tagList = (message: string) =>
  z.array(z.string().trim().min(1).max(40)).min(1, message).max(20);

// z.string().url() also accepts `javascript:` URLs, which become XSS when rendered in <a href>
export const httpUrl = (message: string) =>
  z.string().max(2000).url(message).refine((value) => /^https?:\/\//i.test(value), message);

export const projectSchema = z.object({
  body: z.object({
    title: localizedString(200),
    description: localizedString(1000),
    content: localizedString(20000),
    image_url: httpUrl('Invalid image URL'),
    github_url: httpUrl('Invalid GitHub URL').optional().nullable().or(z.literal('')),
    live_url: httpUrl('Invalid Live URL').optional().nullable().or(z.literal('')),
    tech_stack: tagList('At least one tech stack is required'),
  }),
});

export const translateSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1).max(50000),
    from: z.enum(['en', 'uz', 'ru']),
  }),
});
