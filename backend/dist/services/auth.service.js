"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.ADMIN_PAYLOAD = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otplib = require('otplib');
const authenticator = otplib.authenticator || otplib.default || otplib;
const qrcode_1 = __importDefault(require("qrcode"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_1 = require("../config/logger");
dotenv_1.default.config();
// Single admin account, configured only via environment variables.
// There are deliberately NO fallback credentials: if these are missing, login is disabled.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
// Optional: when set, login requires a TOTP code (Google Authenticator etc.)
const ADMIN_2FA_SECRET = process.env.ADMIN_2FA_SECRET;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    logger_1.logger.error('⚠️ ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set — admin login is disabled.');
}
if (!ADMIN_2FA_SECRET) {
    logger_1.logger.warn('⚠️ ADMIN_2FA_SECRET is not set — admin login works without 2FA.');
}
const JWT_OPTIONS = { algorithms: ['HS256'] };
const PRE_AUTH_PURPOSE = '2fa_pending';
exports.ADMIN_PAYLOAD = { id: 'admin_id', role: 'admin' };
exports.AuthService = {
    is2FAEnabled() {
        return Boolean(ADMIN_2FA_SECRET);
    },
    async validateCredentials(email, password) {
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
            throw new error_middleware_1.CustomError('Admin login is not configured', 503);
        }
        // Always run bcrypt so response time doesn't reveal whether the email matched
        const isValidPassword = await bcrypt_1.default.compare(password, ADMIN_PASSWORD_HASH);
        if (email.trim().toLowerCase() !== ADMIN_EMAIL || !isValidPassword) {
            throw new error_middleware_1.CustomError('Invalid credentials', 401);
        }
        return { id: exports.ADMIN_PAYLOAD.id, email: ADMIN_EMAIL, require2FA: this.is2FAEnabled() };
    },
    // Generates a NEW secret for first-time setup. Put the returned secret into ADMIN_2FA_SECRET.
    async generate2FASetup() {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(ADMIN_EMAIL || 'admin', 'artikov.dev Admin', secret);
        const qrCode = await qrcode_1.default.toDataURL(otpauth);
        return { secret, qrCode };
    },
    verify2FA(token) {
        if (!ADMIN_2FA_SECRET) {
            throw new error_middleware_1.CustomError('2FA is not configured', 400);
        }
        const isValid = authenticator.verify({ token, secret: ADMIN_2FA_SECRET });
        if (!isValid) {
            throw new error_middleware_1.CustomError('Invalid 2FA token', 401);
        }
        return true;
    },
    // Short-lived token proving the password step passed; only accepted by /verify-2fa
    generatePreAuthToken() {
        return jsonwebtoken_1.default.sign({ purpose: PRE_AUTH_PURPOSE }, process.env.JWT_SECRET, { expiresIn: '5m' });
    },
    verifyPreAuthToken(token) {
        try {
            if (!token)
                throw new Error('missing');
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, JWT_OPTIONS);
            if (decoded.purpose !== PRE_AUTH_PURPOSE)
                throw new Error('wrong purpose');
            return true;
        }
        catch {
            throw new error_middleware_1.CustomError('Login session expired, please sign in again', 401);
        }
    },
    // Returns the decoded payload only for real admin access tokens (not pre-auth tokens)
    verifyAccessToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, JWT_OPTIONS);
        if (decoded?.role !== 'admin') {
            throw new Error('Not an admin token');
        }
        return decoded;
    },
    verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, JWT_OPTIONS);
            if (decoded?.role !== 'admin')
                throw new Error('Not an admin token');
            return decoded;
        }
        catch (err) {
            throw new error_middleware_1.CustomError('Invalid or expired refresh token', 401);
        }
    },
    generateTokens(payload = exports.ADMIN_PAYLOAD) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1h'),
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'),
        });
        return { accessToken, refreshToken };
    },
};
