"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateSchema = exports.projectSchema = exports.httpUrl = exports.tagList = exports.localizedString = void 0;
const zod_1 = require("zod");
// Upper bounds keep a single admin request from storing megabytes of text (and keep the
// cached project list small). Long-form fields get more room than titles.
const localizedString = (max) => zod_1.z.object({
    en: zod_1.z.string().min(1, 'English text is required').max(max),
    uz: zod_1.z.string().min(1, 'Uzbek text is required').max(max),
    ru: zod_1.z.string().min(1, 'Russian text is required').max(max),
});
exports.localizedString = localizedString;
const tagList = (message) => zod_1.z.array(zod_1.z.string().trim().min(1).max(40)).min(1, message).max(20);
exports.tagList = tagList;
// z.string().url() also accepts `javascript:` URLs, which become XSS when rendered in <a href>
const httpUrl = (message) => zod_1.z.string().max(2000).url(message).refine((value) => /^https?:\/\//i.test(value), message);
exports.httpUrl = httpUrl;
exports.projectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: (0, exports.localizedString)(200),
        description: (0, exports.localizedString)(1000),
        content: (0, exports.localizedString)(20000),
        image_url: (0, exports.httpUrl)('Invalid image URL'),
        github_url: (0, exports.httpUrl)('Invalid GitHub URL').optional().nullable().or(zod_1.z.literal('')),
        live_url: (0, exports.httpUrl)('Invalid Live URL').optional().nullable().or(zod_1.z.literal('')),
        tech_stack: (0, exports.tagList)('At least one tech stack is required'),
    }),
});
exports.translateSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().trim().min(1).max(50000),
        from: zod_1.z.enum(['en', 'uz', 'ru']),
    }),
});
