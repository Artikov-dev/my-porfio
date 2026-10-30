import { z } from 'zod';
import { httpUrl, localizedString } from './project.schema';

export const seoSchema = z.object({
  body: z.object({
    title: localizedString(120),
    description: localizedString(320),
    keywords: z.array(z.string().max(60)).max(30),
    og_image: httpUrl('Invalid OG image URL'),
  }),
});
