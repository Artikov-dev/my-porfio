"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const blog_schema_1 = require("../schemas/blog.schema");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
router.get('/', blog_controller_1.getAllBlogs);
router.get('/:id', blog_controller_1.getBlog);
router.post('/:id/view', rateLimiter_1.viewLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        // Built-in fallback items ('proj-0', 'blog-1') aren't DB rows; a non-UUID id used to make Postgres throw → 500
        if (!UUID_PATTERN.test(String(id)))
            return res.json({ success: true, counted: false });
        await database_1.db.query('UPDATE blogs SET views = COALESCE(views, 0) + 1 WHERE id = $1', [id]);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false });
    }
});
// Protected Admin Routes
router.post('/', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(blog_schema_1.blogSchema), blog_controller_1.createBlog);
router.put('/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(blog_schema_1.blogSchema), blog_controller_1.updateBlog);
router.delete('/:id', auth_middleware_1.requireAuth, blog_controller_1.deleteBlog);
exports.default = router;
