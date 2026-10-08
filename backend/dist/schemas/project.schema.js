"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = exports.httpUrl = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().min(1, 'English text is required'),
    uz: zod_1.z.string().min(1, 'Uzbek text is required'),
    ru: zod_1.z.string().min(1, 'Russian text is required'),
});
// z.string().url() also accepts `javascript:` URLs, which become XSS when rendered in <a href>
const httpUrl = (message) => zod_1.z.string().url(message).refine((value) => /^https?:\/\//i.test(value), message);
exports.httpUrl = httpUrl;
exports.projectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: localizedString,
        description: localizedString,
        content: localizedString,
        image_url: (0, exports.httpUrl)('Invalid image URL'),
        github_url: (0, exports.httpUrl)('Invalid GitHub URL').optional().nullable().or(zod_1.z.literal('')),
        live_url: (0, exports.httpUrl)('Invalid Live URL').optional().nullable().or(zod_1.z.literal('')),
        tech_stack: zod_1.z.array(zod_1.z.string()).min(1, 'At least one tech stack is required'),
    }),
});
