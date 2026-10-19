import { z } from 'zod';
import { httpUrl } from './project.schema';

const localizedString = (max: number) =>
  z.object({
    en: z.string().min(1, 'English text is required').max(max),
    uz: z.string().min(1, 'Uzbek text is required').max(max),
    ru: z.string().min(1, 'Russian text is required').max(max),
  });

export const seoSchema = z.object({
  body: z.object({
    title: localizedString(120),
    description: localizedString(320),
    keywords: z.array(z.string().max(60)).max(30),
    og_image: httpUrl('Invalid OG image URL'),
  }),
});
