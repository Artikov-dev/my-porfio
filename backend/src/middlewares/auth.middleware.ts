import { Request, Response, NextFunction } from 'express';
import { CustomError } from './error.middleware';
import { AuthService } from '../services/auth.service';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new CustomError('Not authorized, no token', 401);
    }

    // Rejects expired tokens, wrong algorithms and non-admin (e.g. 2FA pre-auth) tokens
    (req as any).user = AuthService.verifyAccessToken(token);

    next();
  } catch (error) {
    next(new CustomError('Not authorized, token failed', 401));
  }
};
