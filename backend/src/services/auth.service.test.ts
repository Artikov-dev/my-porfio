import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generate, generateSecret } from 'otplib';

// auth.service reads these at import time
const secret = generateSecret();
process.env.ADMIN_2FA_SECRET = secret;
process.env.JWT_SECRET = 'test-access-secret-0123456789abcdef0123';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-0123456789abcdef012';
process.env.REDIS_URL = 'redis://127.0.0.1:1'; // nothing listens here → in-memory revocation path

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AuthService } = require('./auth.service') as typeof import('./auth.service');

test('2FA rejects a wrong code', async () => {
  const valid = await generate({ secret });
  const wrong = valid === '000000' ? '111111' : '000000';
  await assert.rejects(AuthService.verify2FA(wrong), /Invalid 2FA token/);
});

test('2FA accepts the current code once, then rejects a replay', async () => {
  const code = await generate({ secret });
  assert.equal(await AuthService.verify2FA(code), true);
  await assert.rejects(AuthService.verify2FA(code), /Invalid 2FA token/);
});

test('2FA setup returns a secret and a QR code', async () => {
  const { secret: newSecret, qrCode } = await AuthService.generate2FASetup();
  assert.ok(newSecret.length >= 16);
  assert.match(qrCode, /^data:image\/png;base64,/);
});

test('pre-auth token is not accepted as an access token', async () => {
  const preAuth = AuthService.generatePreAuthToken();
  await assert.rejects(AuthService.verifyAccessToken(preAuth));
});

test('revoked access and refresh tokens stop working', async () => {
  const { accessToken, refreshToken } = AuthService.generateTokens();
  await AuthService.verifyAccessToken(accessToken);
  await AuthService.verifyRefreshToken(refreshToken);

  await AuthService.revokeToken(accessToken, process.env.JWT_SECRET);
  await AuthService.revokeToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  await assert.rejects(AuthService.verifyAccessToken(accessToken));
  await assert.rejects(AuthService.verifyRefreshToken(refreshToken), /Invalid or expired refresh token/);
});

test('a refresh token is not accepted as an access token', async () => {
  const { refreshToken } = AuthService.generateTokens();
  await assert.rejects(AuthService.verifyAccessToken(refreshToken));
});
