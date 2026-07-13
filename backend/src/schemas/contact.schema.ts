import { z } from 'zod';

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    subject: z.string().max(200, 'Subject is too long').optional().nullable(),
    body: z.string().min(10, 'Message is too short').max(2000, 'Message is too long'),
    location: z.string().max(200).optional().nullable(),
  }),
});
