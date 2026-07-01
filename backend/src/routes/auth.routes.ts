import { Router } from 'express';
import { login, verify2FA, setup2FA } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimiter';

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
router.post('/login', authLimiter, login);
router.post('/verify-2fa', authLimiter, verify2FA);
router.get('/setup-2fa', setup2FA); // In production, secure this endpoint!

export default router;
