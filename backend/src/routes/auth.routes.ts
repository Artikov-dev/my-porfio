import { Router } from 'express';
import { login, verify2FA, setup2FA } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, verify2FASchema } from '../schemas/auth.schema';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pre-auth token for 2FA
 */
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/verify-2fa', authLimiter, validate(verify2FASchema), verify2FA);
router.get('/setup-2fa', setup2FA); // In production, secure this endpoint!

export default router;
