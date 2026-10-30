"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const error_middleware_1 = require("./error.middleware");
const auth_service_1 = require("../services/auth.service");
const requireAuth = async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        else if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new error_middleware_1.CustomError('Not authorized, no token', 401);
        }
        // Rejects expired, revoked, wrong-algorithm and non-admin (e.g. 2FA pre-auth) tokens
        req.user = await auth_service_1.AuthService.verifyAccessToken(token);
        next();
    }
    catch (error) {
        next(new error_middleware_1.CustomError('Not authorized, token failed', 401));
    }
};
exports.requireAuth = requireAuth;
