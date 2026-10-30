import { Router } from 'express';
import { BlogService } from '../services/blog.service';
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { blogSchema } from '../schemas/blog.schema';
import { viewLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.post('/:id/view', viewLimiter, async (req, res) => {
  try {
    const counted = await BlogService.incrementViews(String(req.params.id));
    res.json({ success: true, counted });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// Protected Admin Routes
router.post('/', requireAuth, validate(blogSchema), createBlog);
router.put('/:id', requireAuth, validate(blogSchema), updateBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;
