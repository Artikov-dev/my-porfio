import { Telegraf } from 'telegraf';
import { logger } from '../config/logger';
import dotenv from 'dotenv';
import { db } from '../config/database';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// TELEGRAM_CHAT_ID is the older variable name; accept both so existing deploys keep working
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const isConfigured = Boolean(BOT_TOKEN && ADMIN_CHAT_ID);

if (!isConfigured) {
  logger.warn('⚠️ TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID are not set — contact notifications are disabled.');
}

const bot = new Telegraf(BOT_TOKEN || 'disabled');

// Setup Admin command /stats
bot.command('stats', async (ctx) => {
  if (ctx.chat.id.toString() !== ADMIN_CHAT_ID) return;

  try {
    let projectCount = 0;
    let contactCount = 0;
    try {
      const projRes = await db.query('SELECT COUNT(*) FROM projects');
      if (projRes.rows[0]?.count) projectCount = parseInt(projRes.rows[0].count, 10);

      const contactRes = await db.query('SELECT COUNT(*) FROM contacts');
      if (contactRes.rows[0]?.count) contactCount = parseInt(contactRes.rows[0].count, 10);
    } catch (e) {}

    const message = `
📊 *Roma Artikov Portfolio Stats* 📊

*Total Projects:* ${projectCount}
*Total Contact Messages:* ${contactCount}
    `;

    ctx.replyWithMarkdown(message);
  } catch (error) {
    logger.error('Telegram /stats command error', error);
    ctx.reply('Failed to fetch stats.');
  }
});

if (process.env.NODE_ENV !== 'test' && isConfigured) {
  // launch() rejects on a bad token or a 409 Conflict (two instances polling during a Render
  // deploy). Unhandled, that rejection crashed the whole API; notifications still work without it.
  bot.launch().catch((err) => {
    logger.error(`Telegram bot polling stopped: ${err?.message || err}`);
  });
  logger.info('🤖 Telegram bot launched');
}

// Legacy Markdown mode: an unbalanced _ * ` or [ in user text makes Telegram reject the
// whole message ("can't parse entities"), so the notification would be silently lost.
const escapeMarkdown = (value: unknown) => String(value ?? '').replace(/([_*`\[])/g, '\\$1');

// Live chat pings: the first message of a conversation, then at most one per session every
// 10 minutes — enough to know someone is waiting without a notification per message.
const CHAT_NOTIFY_INTERVAL_MS = 10 * 60 * 1000;
const lastChatNotification = new Map<string, number>();

export const TelegramService = {
  async notifyChatMessage(name: string, text: string, sessionId: string) {
    if (!isConfigured) return false;

    const now = Date.now();
    for (const [id, at] of lastChatNotification) {
      if (now - at > CHAT_NOTIFY_INTERVAL_MS) lastChatNotification.delete(id);
    }
    if (lastChatNotification.has(sessionId)) return false;
    lastChatNotification.set(sessionId, now);

    const message = `
💬 *Live chat* — reply from the admin panel

👤 *${escapeMarkdown(name)}*
${escapeMarkdown(text.slice(0, 500))}
    `;
    try {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID as string, message, { parse_mode: 'Markdown' });
      return true;
    } catch (error) {
      logger.error('Failed to send Telegram chat notification', error);
      return false;
    }
  },

  async sendContactMessage(
    name: string,
    email: string,
    subject: string,
    body: string,
    ip: string,
    location: string,
  ) {
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

    if (!isConfigured) return false;

    try {
      await bot.telegram.sendMessage(ADMIN_CHAT_ID as string, text, {
        parse_mode: 'Markdown',
      });
      logger.info('Telegram notification sent successfully');
      return true;
    } catch (error) {
      logger.error('Failed to send Telegram notification', error);
      return false;
    }
  },
};
