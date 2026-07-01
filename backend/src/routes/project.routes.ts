import { Router } from 'express';
import { getAllProjects, getProject, createProject, updateProject, deleteProject, autoTranslate } from '../controllers/project.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProject);

// Protected Admin Routes
router.post('/translate', requireAuth, autoTranslate);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

export default router;
