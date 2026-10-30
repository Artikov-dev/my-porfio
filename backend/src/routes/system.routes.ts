import { Router } from 'express';
import { getSystemHealth, getSystemLogs, getClientIp } from '../controllers/system.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/health', requireAuth, getSystemHealth);
router.get('/logs', requireAuth, getSystemLogs);
router.get('/client-ip', requireAuth, getClientIp);

export default router;
