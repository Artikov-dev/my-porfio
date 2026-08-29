"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().min(1, 'English text is required'),
    uz: zod_1.z.string().min(1, 'Uzbek text is required'),
    ru: zod_1.z.string().min(1, 'Russian text is required'),
});
exports.blogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: localizedString,
        content: localizedString,
        image_url: zod_1.z.string().url('Invalid image URL'),
        tags: zod_1.z.array(zod_1.z.string()).min(1, 'At least one tag is required'),
    }),
});
