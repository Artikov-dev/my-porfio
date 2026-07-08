import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint for analytics data
router.get('/', requireAuth, getAnalytics);

export default router;
