import { Router } from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  autoTranslate,
} from '../controllers/project.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { projectSchema } from '../schemas/project.schema';
import { viewLimiter } from '../middlewares/rateLimiter';

const router = Router();

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/:id/view', viewLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    // Built-in fallback items ('proj-0', 'blog-1') aren't DB rows; a non-UUID id used to make Postgres throw → 500
    if (!UUID_PATTERN.test(String(id))) return res.json({ success: true, counted: false });
    const { db } = await import('../config/database.js');
    await db.query(
      'UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = $1',
      [id],
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

// Protected Admin Routes
router.post('/translate', requireAuth, autoTranslate);
router.post('/', requireAuth, validate(projectSchema), createProject);
router.put('/:id', requireAuth, validate(projectSchema), updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
