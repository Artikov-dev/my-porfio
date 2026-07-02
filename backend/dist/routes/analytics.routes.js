"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const telegram_1 = require("../config/telegram");
const logger_1 = require("../config/logger");
const router = (0, express_1.Router)();
// Rate limiter: Har bir IP dan har 1 soatda faqat 1 marta yuboriladi
const visitLimiter = (0, express_rate_limit_1.default)({
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
        await (0, telegram_1.sendAdminNotification)(message);
        res.status(200).json({ success: true });
    }
    catch (error) {
        logger_1.logger.error('Failed to process visit analytics:', error);
        res.status(500).json({ success: false });
    }
});
exports.default = router;
