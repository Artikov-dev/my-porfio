import { Router } from 'express';
import { getAllBlogs, getBlog, createBlog, deleteBlog } from '../controllers/blog.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlog);

// Protected Admin Routes
router.post('/', requireAuth, createBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;
