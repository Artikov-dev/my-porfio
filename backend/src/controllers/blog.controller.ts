import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';

export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.status(200).json({ status: 'success', data: blogs });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await BlogService.getBlogById(req.params.id as string);
    res.status(200).json({ status: 'success', data: blog });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blog = await BlogService.createBlog(req.body);
    res.status(201).json({ status: 'success', data: blog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BlogService.deleteBlog(req.params.id as string);
    res.status(200).json({ status: 'success', message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};
