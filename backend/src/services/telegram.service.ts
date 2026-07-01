import { Telegraf } from 'telegraf';
import { logger } from '../config/logger';
import dotenv from 'dotenv';
import { db } from '../config/database';
import redisClient from '../config/redis';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || 'mock_token');
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '123456789';

// Setup Admin command /stats
bot.command('stats', async (ctx) => {
  if (ctx.chat.id.toString() !== ADMIN_CHAT_ID) return;

  try {
    // Note: We will implement actual queries when Project & Blog tables exist
    // For now, these are placeholder queries
    const activeUsers = await redisClient.get('active_users') || 0;
    
    const message = `
📊 *Antigravity Dashboard Stats* 📊

*Active Users Online:* ${activeUsers}
*Total Projects:* 0
*Total Blog Posts:* 0
    `;

    ctx.replyWithMarkdown(message);
  } catch (error) {
    logger.error('Telegram /stats command error', error);
    ctx.reply('Failed to fetch stats.');
  }
});

if (process.env.NODE_ENV !== 'test' && process.env.TELEGRAM_BOT_TOKEN) {
  bot.launch();
  logger.info('🤖 Telegram bot launched');
}

export const TelegramService = {
  async sendContactMessage(name: string, email: string, subject: string, body: string, ip: string, location: string) {
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
      await bot.telegram.sendMessage(ADMIN_CHAT_ID, text, { parse_mode: 'Markdown' });
      logger.info('Telegram notification sent successfully');
    } catch (error) {
      logger.error('Failed to send Telegram notification', error);
    }
  }
};
