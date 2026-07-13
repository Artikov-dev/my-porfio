import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const verify2FASchema = z.object({
  body: z.object({
    token: z.string().length(6, '2FA token must be exactly 6 digits'),
  }),
});
