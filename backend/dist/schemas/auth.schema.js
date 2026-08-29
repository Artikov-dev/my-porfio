"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FASchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.verify2FASchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().length(6, '2FA token must be exactly 6 digits'),
    }),
});
