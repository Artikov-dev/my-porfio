import { Router } from 'express';
import { submitContact, getMessages } from '../controllers/contact.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { contactSchema } from '../schemas/contact.schema';
import { contactLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/', contactLimiter, validate(contactSchema), submitContact);
router.get('/messages', requireAuth, getMessages);

export default router;
