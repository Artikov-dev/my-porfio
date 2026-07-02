import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    await AuthService.validateCredentials(email, password);
    
    // Bypass 2FA for now as requested
    const { accessToken, refreshToken } = AuthService.generateTokens({ id: 'admin_id', role: 'admin' });
    
    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ status: 'success', message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    
    // In real scenario, verify preAuthToken from headers first.
    AuthService.verify2FA(token);
    
    const { accessToken, refreshToken } = AuthService.generateTokens({ id: 'admin_id', role: 'admin' });
    
    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ status: 'success', message: 'Logged in successfully' });
  } catch (error) {
    next(error);
  }
};

// Generate QR Code (One time setup endpoint, hidden in production ideally)
export const setup2FA = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const qrCode = await AuthService.generate2FAQrCode('admin@antigravity.com');
    res.status(200).json({ status: 'success', data: { qrCode } });
  } catch (error) {
    next(error);
  }
};
