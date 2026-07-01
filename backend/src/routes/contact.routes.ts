import { Router } from 'express';
import { submitContact, getMessages } from '../controllers/contact.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', submitContact);
router.get('/messages', requireAuth, getMessages);

export default router;
