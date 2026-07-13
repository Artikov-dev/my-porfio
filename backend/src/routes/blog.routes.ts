import { Router } from 'express';
import {
  getAllBlogs,
  getBlog,
  createBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { blogSchema } from '../schemas/blog.schema.js';

const router = Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
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
router.delete('/:id', requireAuth, deleteBlog);

export default router;
