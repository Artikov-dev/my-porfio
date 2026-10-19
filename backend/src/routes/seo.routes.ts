import { Router } from 'express';
import {
  getSEOSettings,
  updateSEOSettings,
} from '../controllers/seo.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { seoSchema } from '../schemas/seo.schema';

const router = Router();

router.get('/', getSEOSettings);
router.put('/', requireAuth, validate(seoSchema), updateSEOSettings);

export default router;
