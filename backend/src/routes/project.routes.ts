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

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
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
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
