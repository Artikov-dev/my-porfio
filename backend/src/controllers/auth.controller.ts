import { Request, Response, NextFunction, CookieOptions } from 'express';
import { AuthService, ADMIN_PAYLOAD } from '../services/auth.service';

const isProduction = process.env.NODE_ENV === 'production';

// clearCookie must receive the same options as cookie(), otherwise browsers keep the cookie
const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  path: '/',
};

const ACCESS_MAX_AGE = 60 * 60 * 1000; // 1 hour
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const PRE_AUTH_MAX_AGE = 5 * 60 * 1000; // 5 minutes

const setAuthCookies = (res: Response) => {
  const { accessToken, refreshToken } = AuthService.generateTokens(ADMIN_PAYLOAD);
  res.cookie('accessToken', accessToken, { ...baseCookieOptions, maxAge: ACCESS_MAX_AGE });
  res.cookie('refreshToken', refreshToken, { ...baseCookieOptions, maxAge: REFRESH_MAX_AGE });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const { require2FA } = await AuthService.validateCredentials(email, password);

    if (require2FA) {
      // Password OK — client must now POST a TOTP code to /verify-2fa
      res.cookie('preAuthToken', AuthService.generatePreAuthToken(), {
        ...baseCookieOptions,
        maxAge: PRE_AUTH_MAX_AGE,
      });
      return res.status(200).json({ status: 'success', data: { require2FA: true } });
    }

    setAuthCookies(res);
    res
      .status(200)
      .json({ status: 'success', message: 'Logged in successfully', data: { require2FA: false } });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body;

    // Must have passed the password step first
    AuthService.verifyPreAuthToken(req.cookies?.preAuthToken);
    AuthService.verify2FA(token);

    res.clearCookie('preAuthToken', baseCookieOptions);
    setAuthCookies(res);

    res
      .status(200)
      .json({ status: 'success', message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

// One-time setup helper (admin only): returns a fresh secret + QR code.
// Scan the QR in an authenticator app, then set the secret as ADMIN_2FA_SECRET on the server.
export const setup2FA = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { secret, qrCode } = await AuthService.generate2FASetup();
    res.status(200).json({
      status: 'success',
      data: { qrCode, secret, enabled: AuthService.is2FAEnabled() },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshTokenCookie = req.cookies?.refreshToken;
    if (!refreshTokenCookie) {
      return res.status(401).json({ status: 'fail', message: 'No refresh token provided' });
    }

    AuthService.verifyRefreshToken(refreshTokenCookie);
    setAuthCookies(res);

    res.status(200).json({ status: 'success', message: 'Token refreshed successfully' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie('accessToken', baseCookieOptions);
    res.clearCookie('refreshToken', baseCookieOptions);
    res.clearCookie('preAuthToken', baseCookieOptions);
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
