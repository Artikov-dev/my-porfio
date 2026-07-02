import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendAdminNotification } from '../config/telegram';
import { logger } from '../config/logger';

const router = Router();

// Rate limiter: Har bir IP dan har 1 soatda faqat 1 marta yuboriladi
const visitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 soat
  limit: 1, // 1 marta ruxsat
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many visits tracked from this IP' },
  // Rate limit dan o'tmagan bo'lsa hech narsa qaytarmasligi yoki error qaytarishi mumkin.
  // Lekin biz faqat muvaffaqiyatli o'tganlarini Telegramga jo'natamiz.
});

router.post('/visit', visitLimiter, async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const language = req.headers['accept-language']?.split(',')[0] || 'Unknown Language';
    const referer = req.headers.referer || 'Direct Visit';

    // Xabarni chiroyli HTML formatda shakllantirish
    const message = `
🟢 <b>Yangi Tashrif!</b>

<b>IP Manzil:</b> ${ip}
<b>Qurilma (User-Agent):</b> ${userAgent}
<b>Til:</b> ${language}
<b>Qayerdan keldi:</b> ${referer}
<b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}
    `.trim();

    // Adminga jo'natish
    await sendAdminNotification(message);

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Failed to process visit analytics:', error);
    res.status(500).json({ success: false });
  }
});

export default router;
