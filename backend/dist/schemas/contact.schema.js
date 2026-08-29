"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = void 0;
const zod_1 = require("zod");
exports.contactSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
        email: zod_1.z.string().email('Invalid email address'),
        subject: zod_1.z.string().max(200, 'Subject is too long').optional().nullable(),
        body: zod_1.z.string().min(10, 'Message is too short').max(2000, 'Message is too long'),
        location: zod_1.z.string().max(200).optional().nullable(),
    }),
});
