"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getMe = exports.setup2FA = exports.verify2FA = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const isProduction = process.env.NODE_ENV === 'production';
// clearCookie must receive the same options as cookie(), otherwise browsers keep the cookie
const baseCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    path: '/',
};
const ACCESS_MAX_AGE = 60 * 60 * 1000; // 1 hour
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const PRE_AUTH_MAX_AGE = 5 * 60 * 1000; // 5 minutes
const setAuthCookies = (res) => {
    const { accessToken, refreshToken } = auth_service_1.AuthService.generateTokens(auth_service_1.ADMIN_PAYLOAD);
    res.cookie('accessToken', accessToken, { ...baseCookieOptions, maxAge: ACCESS_MAX_AGE });
    res.cookie('refreshToken', refreshToken, { ...baseCookieOptions, maxAge: REFRESH_MAX_AGE });
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { require2FA } = await auth_service_1.AuthService.validateCredentials(email, password);
        if (require2FA) {
            // Password OK — client must now POST a TOTP code to /verify-2fa
            res.cookie('preAuthToken', auth_service_1.AuthService.generatePreAuthToken(), {
                ...baseCookieOptions,
                maxAge: PRE_AUTH_MAX_AGE,
            });
            return res.status(200).json({ status: 'success', data: { require2FA: true } });
        }
        setAuthCookies(res);
        res
            .status(200)
            .json({ status: 'success', message: 'Logged in successfully', data: { require2FA: false } });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const verify2FA = async (req, res, next) => {
    try {
        const { token } = req.body;
        // Must have passed the password step first
        auth_service_1.AuthService.verifyPreAuthToken(req.cookies?.preAuthToken);
        auth_service_1.AuthService.verify2FA(token);
        res.clearCookie('preAuthToken', baseCookieOptions);
        setAuthCookies(res);
        res
            .status(200)
            .json({ status: 'success', message: 'Logged in successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.verify2FA = verify2FA;
// One-time setup helper (admin only): returns a fresh secret + QR code.
// Scan the QR in an authenticator app, then set the secret as ADMIN_2FA_SECRET on the server.
const setup2FA = async (req, res, next) => {
    try {
        const { secret, qrCode } = await auth_service_1.AuthService.generate2FASetup();
        res.status(200).json({
            status: 'success',
            data: { qrCode, secret, enabled: auth_service_1.AuthService.is2FAEnabled() },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.setup2FA = setup2FA;
const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({
            status: 'success',
            data: {
                id: user.id,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const refreshToken = async (req, res, next) => {
    try {
        const refreshTokenCookie = req.cookies?.refreshToken;
        if (!refreshTokenCookie) {
            return res.status(401).json({ status: 'fail', message: 'No refresh token provided' });
        }
        auth_service_1.AuthService.verifyRefreshToken(refreshTokenCookie);
        setAuthCookies(res);
        res.status(200).json({ status: 'success', message: 'Token refreshed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', baseCookieOptions);
        res.clearCookie('refreshToken', baseCookieOptions);
        res.clearCookie('preAuthToken', baseCookieOptions);
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
