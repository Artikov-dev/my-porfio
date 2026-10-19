"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoSchema = void 0;
const zod_1 = require("zod");
const project_schema_1 = require("./project.schema");
const localizedString = (max) => zod_1.z.object({
    en: zod_1.z.string().min(1, 'English text is required').max(max),
    uz: zod_1.z.string().min(1, 'Uzbek text is required').max(max),
    ru: zod_1.z.string().min(1, 'Russian text is required').max(max),
});
exports.seoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: localizedString(120),
        description: localizedString(320),
        keywords: zod_1.z.array(zod_1.z.string().max(60)).max(30),
        og_image: (0, project_schema_1.httpUrl)('Invalid OG image URL'),
    }),
});
