import { Router } from 'express';
import { getSEOSettings, updateSEOSettings } from '../controllers/seo.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getSEOSettings);
router.put('/', requireAuth, updateSEOSettings);

export default router;
