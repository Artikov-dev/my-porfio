"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
// Validation only — input is stored exactly as sent. An HTML filter here used to mangle
// passwords ("x&y<z" → "x&y"), contact messages and code in blog posts. XSS is prevented
// at render time instead: React escapes all text, and blog markdown is rendered to JSX
// (never injected as raw HTML). Telegram output is escaped in telegram.service.
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
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
