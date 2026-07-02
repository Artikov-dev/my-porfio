"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
const requireAuth = (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new error_middleware_1.CustomError('Not authorized, no token', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(new error_middleware_1.CustomError('Not authorized, token failed', 401));
    }
};
exports.requireAuth = requireAuth;
