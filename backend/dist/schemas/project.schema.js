"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().min(1, 'English text is required'),
    uz: zod_1.z.string().min(1, 'Uzbek text is required'),
    ru: zod_1.z.string().min(1, 'Russian text is required'),
});
exports.projectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: localizedString,
        description: localizedString,
        content: localizedString,
        image_url: zod_1.z.string().url('Invalid image URL'),
        github_url: zod_1.z.string().url('Invalid GitHub URL').optional().nullable().or(zod_1.z.literal('')),
        live_url: zod_1.z.string().url('Invalid Live URL').optional().nullable().or(zod_1.z.literal('')),
        tech_stack: zod_1.z.array(zod_1.z.string()).min(1, 'At least one tech stack is required'),
    }),
});
