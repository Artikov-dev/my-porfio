"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const xss_1 = __importDefault(require("xss"));
// Custom XSS filter that allows some safe tags if needed, or strips completely
const sanitizeString = (str) => {
    return (0, xss_1.default)(str, {
        whiteList: {
            b: [], i: [], u: [], strong: [], em: [], p: [], br: [],
            h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
            ul: [], ol: [], li: [], a: ['href', 'title', 'target'],
            img: ['src', 'alt', 'width', 'height'],
            span: ['style'], div: ['style'],
            pre: [], code: [], blockquote: []
        },
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script', 'iframe'] // Completely remove script and iframe tags
    });
};
const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = sanitizeObject(obj[key]);
        }
        return newObj;
    }
    return obj;
};
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Parse and validate the incoming request body
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // If valid, sanitize the body before passing to controller
            if (req.body) {
                req.body = sanitizeObject(req.body);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
