import jwt from 'jsonwebtoken';
const otplib = require('otplib');
const authenticator = otplib.authenticator || otplib.default || otplib;
import qrcode from 'qrcode';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { CustomError } from '../middlewares/error.middleware';

dotenv.config();

// Usually this comes from DB, but since there's only 1 admin, we can mock it or use env
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'artikovrozik52@gmail.com';
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('antiparol', 10);
const ADMIN_2FA_SECRET =
  process.env.ADMIN_2FA_SECRET || authenticator.generateSecret();

export const AuthService = {
  async validateCredentials(email: string, password: string) {
    if (email !== ADMIN_EMAIL) {
      throw new CustomError('Invalid credentials', 401);
    }

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      throw new CustomError('Invalid credentials', 401);
    }

    return { id: 'admin_id', email: ADMIN_EMAIL, require2FA: true };
  },

  async generate2FAQrCode(email: string) {
    const otpauth = authenticator.keyuri(
      email,
      'Antigravity Admin',
      ADMIN_2FA_SECRET,
    );
    const qrCodeDataUrl = await qrcode.toDataURL(otpauth);
    return qrCodeDataUrl;
  },

  verify2FA(token: string) {
    const isValid = authenticator.verify({ token, secret: ADMIN_2FA_SECRET });
    if (!isValid) {
      throw new CustomError('Invalid 2FA token', 401);
    }
    return true;
  },

  generateTokens(payload: object) {
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
