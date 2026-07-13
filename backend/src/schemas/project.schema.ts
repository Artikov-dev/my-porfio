import { z } from 'zod';

const localizedString = z.object({
  en: z.string().min(1, 'English text is required'),
  uz: z.string().min(1, 'Uzbek text is required'),
  ru: z.string().min(1, 'Russian text is required'),
});

export const projectSchema = z.object({
  body: z.object({
    title: localizedString,
    description: localizedString,
    content: localizedString,
    image_url: z.string().url('Invalid image URL'),
    github_url: z.string().url('Invalid GitHub URL').optional().nullable().or(z.literal('')),
    live_url: z.string().url('Invalid Live URL').optional().nullable().or(z.literal('')),
    tech_stack: z.array(z.string()).min(1, 'At least one tech stack is required'),
  }),
});
