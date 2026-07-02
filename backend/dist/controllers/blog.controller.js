"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.createBlog = exports.getBlog = exports.getAllBlogs = void 0;
const blog_service_1 = require("../services/blog.service");
const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await blog_service_1.BlogService.getAllBlogs();
        res.status(200).json({ status: 'success', data: blogs });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllBlogs = getAllBlogs;
const getBlog = async (req, res, next) => {
    try {
        const blog = await blog_service_1.BlogService.getBlogById(req.params.id);
        res.status(200).json({ status: 'success', data: blog });
    }
    catch (error) {
        next(error);
    }
};
exports.getBlog = getBlog;
const createBlog = async (req, res, next) => {
    try {
        const blog = await blog_service_1.BlogService.createBlog(req.body);
        res.status(201).json({ status: 'success', data: blog });
    }
    catch (error) {
        next(error);
    }
};
exports.createBlog = createBlog;
const deleteBlog = async (req, res, next) => {
    try {
        await blog_service_1.BlogService.deleteBlog(req.params.id);
        res.status(200).json({ status: 'success', message: 'Blog deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteBlog = deleteBlog;
