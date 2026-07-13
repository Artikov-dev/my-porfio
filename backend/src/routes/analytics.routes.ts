import { Router } from 'express';
import { getAnalytics, recordVisit } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint for analytics data (admin only)
router.get('/', requireAuth, getAnalytics);

// Endpoint to record a visit (public)
router.post('/visit', recordVisit);

export default router;
