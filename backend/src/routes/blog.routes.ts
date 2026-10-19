import { Router } from 'express';
import {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { blogSchema } from '../schemas/blog.schema.js';
import { viewLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.post('/:id/view', viewLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    // Built-in fallback items ('proj-0', 'blog-1') aren't DB rows; a non-UUID id used to make Postgres throw → 500
    if (!UUID_PATTERN.test(String(id))) return res.json({ success: true, counted: false });
    const { db } = await import('../config/database.js');
    await db.query(
      'UPDATE blogs SET views = COALESCE(views, 0) + 1 WHERE id = $1',
      [id],
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// Protected Admin Routes
router.post('/', requireAuth, validate(blogSchema), createBlog);
router.put('/:id', requireAuth, validate(blogSchema), updateBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;
