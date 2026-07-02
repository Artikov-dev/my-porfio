"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otplib = require('otplib');
const authenticator = otplib.authenticator || otplib.default || otplib;
const qrcode_1 = __importDefault(require("qrcode"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_middleware_1 = require("../middlewares/error.middleware");
dotenv_1.default.config();
// Usually this comes from DB, but since there's only 1 admin, we can mock it or use env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'artikovrozik52@gmail.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt_1.default.hashSync('antiparol', 10);
const ADMIN_2FA_SECRET = process.env.ADMIN_2FA_SECRET || authenticator.generateSecret();
exports.AuthService = {
    async validateCredentials(email, password) {
        if (email !== ADMIN_EMAIL) {
            throw new error_middleware_1.CustomError('Invalid credentials', 401);
        }
        const isValid = await bcrypt_1.default.compare(password, ADMIN_PASSWORD_HASH);
        if (!isValid) {
            throw new error_middleware_1.CustomError('Invalid credentials', 401);
        }
        return { id: 'admin_id', email: ADMIN_EMAIL, require2FA: true };
    },
    async generate2FAQrCode(email) {
        const otpauth = authenticator.keyuri(email, 'Antigravity Admin', ADMIN_2FA_SECRET);
        const qrCodeDataUrl = await qrcode_1.default.toDataURL(otpauth);
        return qrCodeDataUrl;
    },
    verify2FA(token) {
        const isValid = authenticator.verify({ token, secret: ADMIN_2FA_SECRET });
        if (!isValid) {
            throw new error_middleware_1.CustomError('Invalid 2FA token', 401);
        }
        return true;
    },
    generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1h'),
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'),
        });
        return { accessToken, refreshToken };
    }
};
