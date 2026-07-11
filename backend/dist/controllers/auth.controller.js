"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup2FA = exports.verify2FA = exports.login = void 0;
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
