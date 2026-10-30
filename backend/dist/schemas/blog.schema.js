"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogSchema = void 0;
const zod_1 = require("zod");
const project_schema_1 = require("./project.schema");
exports.blogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: (0, project_schema_1.localizedString)(200),
        content: (0, project_schema_1.localizedString)(50000),
        image_url: (0, project_schema_1.httpUrl)('Invalid image URL'),
        tags: (0, project_schema_1.tagList)('At least one tag is required'),
    }),
});
