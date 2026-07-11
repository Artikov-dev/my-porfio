"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_js_1 = require("../controllers/blog.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.get('/', blog_controller_js_1.getAllBlogs);
router.get('/:id', blog_controller_js_1.getBlog);
router.post('/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        const { db } = await import('../config/database.js');
        await db.query('UPDATE blogs SET views = COALESCE(views, 0) + 1 WHERE id = $1', [id]);
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false });
    }
});
// Protected Admin Routes
router.post('/', auth_middleware_js_1.requireAuth, blog_controller_js_1.createBlog);
router.delete('/:id', auth_middleware_js_1.requireAuth, blog_controller_js_1.deleteBlog);
exports.default = router;
