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
dotenv_1.default.config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// TELEGRAM_CHAT_ID is the older variable name; accept both so existing deploys keep working
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const isConfigured = Boolean(BOT_TOKEN && ADMIN_CHAT_ID);
if (!isConfigured) {
    logger_1.logger.warn('⚠️ TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID are not set — contact notifications are disabled.');
}
const bot = new telegraf_1.Telegraf(BOT_TOKEN || 'disabled');
// Setup Admin command /stats
bot.command('stats', async (ctx) => {
    if (ctx.chat.id.toString() !== ADMIN_CHAT_ID)
        return;
    try {
        let projectCount = 0;
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
if (process.env.NODE_ENV !== 'test' && isConfigured) {
    // launch() rejects on a bad token or a 409 Conflict (two instances polling during a Render
    // deploy). Unhandled, that rejection crashed the whole API; notifications still work without it.
    bot.launch().catch((err) => {
        logger_1.logger.error(`Telegram bot polling stopped: ${err?.message || err}`);
    });
    logger_1.logger.info('🤖 Telegram bot launched');
}
// Legacy Markdown mode: an unbalanced _ * ` or [ in user text makes Telegram reject the
// whole message ("can't parse entities"), so the notification would be silently lost.
const escapeMarkdown = (value) => String(value ?? '').replace(/([_*`\[])/g, '\\$1');
// Live chat pings: the first message of a conversation, then at most one per session every
// 10 minutes — enough to know someone is waiting without a notification per message.
const CHAT_NOTIFY_INTERVAL_MS = 10 * 60 * 1000;
const lastChatNotification = new Map();
exports.TelegramService = {
    async notifyChatMessage(name, text, sessionId) {
        if (!isConfigured)
            return false;
        const now = Date.now();
        for (const [id, at] of lastChatNotification) {
            if (now - at > CHAT_NOTIFY_INTERVAL_MS)
                lastChatNotification.delete(id);
        }
        if (lastChatNotification.has(sessionId))
            return false;
        lastChatNotification.set(sessionId, now);
        const message = `
💬 *Live chat* — reply from the admin panel

👤 *${escapeMarkdown(name)}*
${escapeMarkdown(text.slice(0, 500))}
    `;
        try {
            await bot.telegram.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'Markdown' });
            return true;
        }
        catch (error) {
            logger_1.logger.error('Failed to send Telegram chat notification', error);
            return false;
        }
    },
    async sendContactMessage(name, email, subject, body, ip, location) {
        const text = `
📩 *New Contact Message* 📩

👤 *Name:* ${escapeMarkdown(name)}
✉️ *Email:* ${escapeMarkdown(email)}
📌 *Subject:* ${escapeMarkdown(subject)}
🌐 *IP Address:* ${escapeMarkdown(ip)}
📍 *Location:* ${escapeMarkdown(location)}

📝 *Message:*
${escapeMarkdown(body)}
    `;
        if (!isConfigured)
            return false;
        try {
            await bot.telegram.sendMessage(ADMIN_CHAT_ID, text, {
                parse_mode: 'Markdown',
            });
            logger_1.logger.info('Telegram notification sent successfully');
            return true;
        }
        catch (error) {
            logger_1.logger.error('Failed to send Telegram notification', error);
            return false;
        }
    },
};
