"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getMe = exports.setup2FA = exports.verify2FA = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await auth_service_1.AuthService.validateCredentials(email, password);
        // Bypass 2FA for now as requested
        const { accessToken, refreshToken } = auth_service_1.AuthService.generateTokens({
            id: 'admin_id',
            role: 'admin',
        });
        // Set HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res
            .status(200)
            .json({ status: 'success', message: 'Logged in successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const verify2FA = async (req, res, next) => {
    try {
        const { token } = req.body;
        // In real scenario, verify preAuthToken from headers first.
        auth_service_1.AuthService.verify2FA(token);
        const { accessToken, refreshToken } = auth_service_1.AuthService.generateTokens({
            id: 'admin_id',
            role: 'admin',
        });
        // Set HTTP-only cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res
            .status(200)
            .json({ status: 'success', message: 'Logged in successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.verify2FA = verify2FA;
// Generate QR Code (One time setup endpoint, hidden in production ideally)
const setup2FA = async (req, res, next) => {
    try {
        const qrCode = await auth_service_1.AuthService.generate2FAQrCode('admin@antigravity.com');
        res.status(200).json({ status: 'success', data: { qrCode } });
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
                id: user.id || 'admin_id',
                role: user.role || 'admin',
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
        const decoded = auth_service_1.AuthService.verifyRefreshToken(refreshTokenCookie);
        const { accessToken, refreshToken: newRefreshToken } = auth_service_1.AuthService.generateTokens({
            id: decoded.id || 'admin_id',
            role: decoded.role || 'admin',
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000,
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ status: 'success', message: 'Token refreshed successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
