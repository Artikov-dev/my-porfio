"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const telegraf_1 = require("telegraf");
const logger_1 = require("../config/logger");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../config/database");
const redis_1 = __importDefault(require("../config/redis"));
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'mock_token');
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '123456789';
// Setup Admin command /stats
bot.command('stats', async (ctx) => {
    if (ctx.chat.id.toString() !== ADMIN_CHAT_ID)
        return;
    try {
        const activeUsers = (await redis_1.default.get('active_users')) || 0;
        let projectCount = 4;
        let contactCount = 0;
        try {
            const projRes = await database_1.db.query('SELECT COUNT(*) FROM projects');
            if (projRes.rows[0]?.count)
                projectCount = parseInt(projRes.rows[0].count, 10);
            const contactRes = await database_1.db.query('SELECT COUNT(*) FROM contacts');
            if (contactRes.rows[0]?.count)
                contactCount = parseInt(contactRes.rows[0].count, 10);
        }
        catch (e) { }
        const message = `
📊 *Roma Artikov Portfolio Stats* 📊

*Active Users Online:* ${activeUsers}
*Total Projects:* ${projectCount}
*Total Contact Messages:* ${contactCount}
    `;
        ctx.replyWithMarkdown(message);
    }
    catch (error) {
        logger_1.logger.error('Telegram /stats command error', error);
        ctx.reply('Failed to fetch stats.');
    }
});
if (process.env.NODE_ENV !== 'test' && process.env.TELEGRAM_BOT_TOKEN) {
    bot.launch();
    logger_1.logger.info('🤖 Telegram bot launched');
}
exports.TelegramService = {
    async sendContactMessage(name, email, subject, body, ip, location) {
        const text = `
📩 *New Contact Message* 📩

👤 *Name:* ${name}
✉️ *Email:* ${email}
📌 *Subject:* ${subject}
🌐 *IP Address:* ${ip}
📍 *Location:* ${location}

📝 *Message:*
${body}
    `;
        try {
            await bot.telegram.sendMessage(ADMIN_CHAT_ID, text, {
                parse_mode: 'Markdown',
            });
            logger_1.logger.info('Telegram notification sent successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to send Telegram notification', error);
        }
    },
};
