"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoSchema = void 0;
const zod_1 = require("zod");
const project_schema_1 = require("./project.schema");
exports.seoSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: (0, project_schema_1.localizedString)(120),
        description: (0, project_schema_1.localizedString)(320),
        keywords: zod_1.z.array(zod_1.z.string().max(60)).max(30),
        og_image: (0, project_schema_1.httpUrl)('Invalid OG image URL'),
    }),
});
