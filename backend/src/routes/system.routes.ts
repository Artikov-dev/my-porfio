import { Router } from 'express';
import { getSystemHealth, getSystemLogs } from '../controllers/system.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/health', requireAuth, getSystemHealth);
router.get('/logs', requireAuth, getSystemLogs);

export default router;
