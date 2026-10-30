import jwt from 'jsonwebtoken';
import { generateSecret, generateURI, verify as verifyOTP } from 'otplib';
import qrcode from 'qrcode';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import redisClient from '../config/redis';
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
let lastUsedTimeStep = -1;

// Revoked token ids. Redis when available (survives restarts); the in-memory map covers
// the case where Redis is offline.
const revokedInMemory = new Map<string, number>(); // jti → exp (unix seconds)

const revoke = async (jti: string, exp: number) => {
  const ttl = exp - Math.floor(Date.now() / 1000);
  if (ttl <= 0) return;
  revokedInMemory.set(jti, exp);
  await redisClient.set(`revoked:${jti}`, '1', 'EX', ttl);
};

const isRevoked = async (jti: string | undefined) => {
  // Tokens issued before jti existed can't be revoked individually; they expire on their own
  if (!jti) return false;
  const now = Math.floor(Date.now() / 1000);
  for (const [id, exp] of revokedInMemory) {
    if (exp <= now) revokedInMemory.delete(id);
  }
  if (revokedInMemory.has(jti)) return true;
  return (await redisClient.get(`revoked:${jti}`)) !== null;
};

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
    const secret = generateSecret();
    const otpauth = generateURI({ issuer: 'artikov.dev Admin', label: ADMIN_EMAIL || 'admin', secret });
    const qrCode = await qrcode.toDataURL(otpauth);
    return { secret, qrCode };
  },

  // otplib v13's verify() is async and resolves to { valid }. The old code treated the returned
  // Promise as a boolean, so every 6-digit code passed.
  async verify2FA(token: string) {
    if (!ADMIN_2FA_SECRET) {
      throw new CustomError('2FA is not configured', 400);
    }
    let result: { valid: boolean; timeStep?: number };
    try {
      // ±30s tolerance for clock drift between the phone and the server
      result = await verifyOTP({ token, secret: ADMIN_2FA_SECRET, epochTolerance: 30 });
    } catch {
      result = { valid: false };
    }
    // A code can't be used twice (e.g. replayed by someone who saw it)
    if (!result.valid || (result.timeStep !== undefined && result.timeStep <= lastUsedTimeStep)) {
      throw new CustomError('Invalid 2FA token', 401);
    }
    if (result.timeStep !== undefined) lastUsedTimeStep = result.timeStep;
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

  // Returns the decoded payload only for real admin access tokens (not pre-auth tokens or logged-out ones)
  async verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string, JWT_OPTIONS) as any;
    if (decoded?.role !== 'admin') {
      throw new Error('Not an admin token');
    }
    if (await isRevoked(decoded.jti)) {
      throw new Error('Token revoked');
    }
    return decoded;
  },

  async verifyRefreshToken(token: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, JWT_OPTIONS);
      if (decoded?.role !== 'admin') throw new Error('Not an admin token');
    } catch (err) {
      throw new CustomError('Invalid or expired refresh token', 401);
    }
    if (await isRevoked(decoded.jti)) {
      throw new CustomError('Invalid or expired refresh token', 401);
    }
    return decoded;
  },

  // Blocks a token until it would have expired anyway (logout, refresh-token rotation).
  // Accepts either secret's tokens; anything that doesn't verify is already useless.
  async revokeToken(token: string | undefined, secret: string | undefined) {
    if (!token || !secret) return;
    try {
      const decoded = jwt.verify(token, secret, JWT_OPTIONS) as any;
      if (decoded?.jti && decoded.exp) await revoke(decoded.jti, decoded.exp);
    } catch {
      // expired / invalid — nothing to revoke
    }
  },

  generateTokens(payload: object = ADMIN_PAYLOAD) {
    // jti makes every token individually revocable
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
      jwtid: randomUUID(),
    });

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN || '7d') as any,
        jwtid: randomUUID(),
      },
    );

    return { accessToken, refreshToken };
  },
};
