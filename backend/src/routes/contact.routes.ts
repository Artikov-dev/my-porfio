import { Router } from 'express';
import { submitContact, getMessages } from '../controllers/contact.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { contactSchema } from '../schemas/contact.schema';

const router = Router();

router.post('/', validate(contactSchema), submitContact);
router.get('/messages', requireAuth, getMessages);

export default router;
