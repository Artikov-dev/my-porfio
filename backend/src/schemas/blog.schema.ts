import { z } from 'zod';

const localizedString = z.object({
  en: z.string().min(1, 'English text is required'),
  uz: z.string().min(1, 'Uzbek text is required'),
  ru: z.string().min(1, 'Russian text is required'),
});

export const blogSchema = z.object({
  body: z.object({
    title: localizedString,
    content: localizedString,
    image_url: z.string().url('Invalid image URL'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
  }),
});
