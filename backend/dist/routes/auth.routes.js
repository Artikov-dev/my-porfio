"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
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
router.post('/login', rateLimiter_1.authLimiter, auth_controller_1.login);
router.post('/verify-2fa', rateLimiter_1.authLimiter, auth_controller_1.verify2FA);
router.get('/setup-2fa', auth_controller_1.setup2FA); // In production, secure this endpoint!
exports.default = router;
