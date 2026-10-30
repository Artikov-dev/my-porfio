import { z } from 'zod';
import { httpUrl, localizedString, tagList } from './project.schema';

export const blogSchema = z.object({
  body: z.object({
    title: localizedString(200),
    content: localizedString(50000),
    image_url: httpUrl('Invalid image URL'),
    tags: tagList('At least one tag is required'),
  }),
});
