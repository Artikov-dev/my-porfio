import jwt from 'jsonwebtoken';
const otplib = require('otplib');
const authenticator = otplib.authenticator || otplib.default || otplib;
import qrcode from 'qrcode';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { CustomError } from '../middlewares/error.middleware';
import { logger } from '../config/logger';

dotenv.config();

// Single admin account, configured only via environment variables.
// There are deliberately NO fallback credentials: if these are missing, login is disabled.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
// Optional: when set, login requires a TOTP code (Google Authenticator etc.)
const ADMIN_2FA_SECRET = process.env.ADMIN_2FA_SECRET;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
  logger.error('⚠️ ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set — admin login is disabled.');
}
if (!ADMIN_2FA_SECRET) {
  logger.warn('⚠️ ADMIN_2FA_SECRET is not set — admin login works without 2FA.');
}

const JWT_OPTIONS: jwt.VerifyOptions = { algorithms: ['HS256'] };
const PRE_AUTH_PURPOSE = '2fa_pending';

export const ADMIN_PAYLOAD = { id: 'admin_id', role: 'admin' } as const;

export const AuthService = {
  is2FAEnabled() {
    return Boolean(ADMIN_2FA_SECRET);
  },

  async validateCredentials(email: string, password: string) {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      throw new CustomError('Admin login is not configured', 503);
    }

    // Always run bcrypt so response time doesn't reveal whether the email matched
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || !isValidPassword) {
      throw new CustomError('Invalid credentials', 401);
    }

    return { id: ADMIN_PAYLOAD.id, email: ADMIN_EMAIL, require2FA: this.is2FAEnabled() };
  },

  // Generates a NEW secret for first-time setup. Put the returned secret into ADMIN_2FA_SECRET.
  async generate2FASetup() {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(ADMIN_EMAIL || 'admin', 'artikov.dev Admin', secret);
    const qrCode = await qrcode.toDataURL(otpauth);
    return { secret, qrCode };
  },

  verify2FA(token: string) {
    if (!ADMIN_2FA_SECRET) {
      throw new CustomError('2FA is not configured', 400);
    }
    const isValid = authenticator.verify({ token, secret: ADMIN_2FA_SECRET });
    if (!isValid) {
      throw new CustomError('Invalid 2FA token', 401);
    }
    return true;
  },

  // Short-lived token proving the password step passed; only accepted by /verify-2fa
  generatePreAuthToken() {
    return jwt.sign({ purpose: PRE_AUTH_PURPOSE }, process.env.JWT_SECRET as string, { expiresIn: '5m' });
  },

  verifyPreAuthToken(token: string | undefined) {
    try {
      if (!token) throw new Error('missing');
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string, JWT_OPTIONS) as any;
      if (decoded.purpose !== PRE_AUTH_PURPOSE) throw new Error('wrong purpose');
      return true;
    } catch {
      throw new CustomError('Login session expired, please sign in again', 401);
    }
  },

  // Returns the decoded payload only for real admin access tokens (not pre-auth tokens)
  verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string, JWT_OPTIONS) as any;
    if (decoded?.role !== 'admin') {
      throw new Error('Not an admin token');
    }
    return decoded;
  },

  verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, JWT_OPTIONS) as any;
      if (decoded?.role !== 'admin') throw new Error('Not an admin token');
      return decoded;
    } catch (err) {
      throw new CustomError('Invalid or expired refresh token', 401);
    }
  },

  generateTokens(payload: object = ADMIN_PAYLOAD) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as any,
      },
    );

    return { accessToken, refreshToken };
  },
};
