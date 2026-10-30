"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.ADMIN_PAYLOAD = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otplib_1 = require("otplib");
const qrcode_1 = __importDefault(require("qrcode"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const redis_1 = __importDefault(require("../config/redis"));
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
let lastUsedTimeStep = -1;
// Revoked token ids. Redis when available (survives restarts); the in-memory map covers
// the case where Redis is offline.
const revokedInMemory = new Map(); // jti → exp (unix seconds)
const revoke = async (jti, exp) => {
    const ttl = exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0)
        return;
    revokedInMemory.set(jti, exp);
    await redis_1.default.set(`revoked:${jti}`, '1', 'EX', ttl);
};
const isRevoked = async (jti) => {
    // Tokens issued before jti existed can't be revoked individually; they expire on their own
    if (!jti)
        return false;
    const now = Math.floor(Date.now() / 1000);
    for (const [id, exp] of revokedInMemory) {
        if (exp <= now)
            revokedInMemory.delete(id);
    }
    if (revokedInMemory.has(jti))
        return true;
    return (await redis_1.default.get(`revoked:${jti}`)) !== null;
};
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
        const secret = (0, otplib_1.generateSecret)();
        const otpauth = (0, otplib_1.generateURI)({ issuer: 'artikov.dev Admin', label: ADMIN_EMAIL || 'admin', secret });
        const qrCode = await qrcode_1.default.toDataURL(otpauth);
        return { secret, qrCode };
    },
    // otplib v13's verify() is async and resolves to { valid }. The old code treated the returned
    // Promise as a boolean, so every 6-digit code passed.
    async verify2FA(token) {
        if (!ADMIN_2FA_SECRET) {
            throw new error_middleware_1.CustomError('2FA is not configured', 400);
        }
        let result;
        try {
            // ±30s tolerance for clock drift between the phone and the server
            result = await (0, otplib_1.verify)({ token, secret: ADMIN_2FA_SECRET, epochTolerance: 30 });
        }
        catch {
            result = { valid: false };
        }
        // A code can't be used twice (e.g. replayed by someone who saw it)
        if (!result.valid || (result.timeStep !== undefined && result.timeStep <= lastUsedTimeStep)) {
            throw new error_middleware_1.CustomError('Invalid 2FA token', 401);
        }
        if (result.timeStep !== undefined)
            lastUsedTimeStep = result.timeStep;
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
    // Returns the decoded payload only for real admin access tokens (not pre-auth tokens or logged-out ones)
    async verifyAccessToken(token) {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, JWT_OPTIONS);
        if (decoded?.role !== 'admin') {
            throw new Error('Not an admin token');
        }
        if (await isRevoked(decoded.jti)) {
            throw new Error('Token revoked');
        }
        return decoded;
    },
    async verifyRefreshToken(token) {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET, JWT_OPTIONS);
            if (decoded?.role !== 'admin')
                throw new Error('Not an admin token');
        }
        catch (err) {
            throw new error_middleware_1.CustomError('Invalid or expired refresh token', 401);
        }
        if (await isRevoked(decoded.jti)) {
            throw new error_middleware_1.CustomError('Invalid or expired refresh token', 401);
        }
        return decoded;
    },
    // Blocks a token until it would have expired anyway (logout, refresh-token rotation).
    // Accepts either secret's tokens; anything that doesn't verify is already useless.
    async revokeToken(token, secret) {
        if (!token || !secret)
            return;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret, JWT_OPTIONS);
            if (decoded?.jti && decoded.exp)
                await revoke(decoded.jti, decoded.exp);
        }
        catch {
            // expired / invalid — nothing to revoke
        }
    },
    generateTokens(payload = exports.ADMIN_PAYLOAD) {
        // jti makes every token individually revocable
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1h'),
            jwtid: (0, crypto_1.randomUUID)(),
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'),
            jwtid: (0, crypto_1.randomUUID)(),
        });
        return { accessToken, refreshToken };
    },
};
