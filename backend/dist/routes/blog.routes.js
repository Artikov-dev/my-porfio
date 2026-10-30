"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_service_1 = require("../services/blog.service");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const blog_schema_1 = require("../schemas/blog.schema");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
router.get('/', blog_controller_1.getAllBlogs);
router.get('/:id', blog_controller_1.getBlog);
router.post('/:id/view', rateLimiter_1.viewLimiter, async (req, res) => {
    try {
        const counted = await blog_service_1.BlogService.incrementViews(String(req.params.id));
        res.json({ success: true, counted });
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
