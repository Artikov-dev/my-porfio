import { Router } from 'express';
import { getAnalytics, recordVisit, getLocations } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { visitLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Endpoint for analytics data (admin only)
router.get('/', requireAuth, getAnalytics);

// Endpoint to record a visit (public)
router.post('/visit', visitLimiter, recordVisit);

// Endpoint for visitor locations (admin only — only the admin dashboard globe uses it)
router.get('/locations', requireAuth, getLocations);

export default router;
