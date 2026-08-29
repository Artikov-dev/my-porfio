"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const auth_middleware_1 = require("../middlewares/auth.middleware");
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
router.post('/login', rateLimiter_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.loginSchema), auth_controller_1.login);
router.post('/verify-2fa', rateLimiter_1.authLimiter, (0, validate_middleware_1.validate)(auth_schema_1.verify2FASchema), auth_controller_1.verify2FA);
router.get('/setup-2fa', auth_controller_1.setup2FA); // In production, secure this endpoint!
router.get('/me', auth_middleware_1.requireAuth, auth_controller_1.getMe);
router.post('/refresh', auth_controller_1.refreshToken);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
