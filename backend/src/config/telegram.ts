import { Telegraf } from 'telegraf';
import { logger } from './logger';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
export let bot: Telegraf | null = null;

if (token) {
  bot = new Telegraf(token);

  // Oddiy foydalanuvchilar (yoki o'zingiz) botga kirganda ishlaydigan xabar
  bot.start((ctx) => {
    const chatId = ctx.chat.id;
    ctx.reply(
      `Assalomu alaykum! Roma Artikovning shaxsiy botiga xush kelibsiz.\n\nSizning Chat ID raqamingiz: ${chatId}\n\n(Agar siz Admin bo'lsangiz, shu ID ni .env faylidagi TELEGRAM_CHAT_ID ga kiritib qo'ying)`
    );
  });

  bot.help((ctx) => {
    ctx.reply('Hozircha men faqat portfolioga tashriflarni adminga yetkazib beraman.');
  });

  // Botni ishga tushirish
  bot.launch().then(() => {
    logger.info('🤖 Telegram bot is running!');
  }).catch((err) => {
    logger.error('Failed to start Telegram bot:', err);
  });

  // Graceful stop
  process.once('SIGINT', () => bot?.stop('SIGINT'));
  process.once('SIGTERM', () => bot?.stop('SIGTERM'));
} else {
  logger.warn('TELEGRAM_BOT_TOKEN is not defined. Telegram bot is disabled.');
}

export const sendAdminNotification = async (message: string) => {
  if (!bot) return;
  const adminChatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!adminChatId) {
    logger.warn('TELEGRAM_CHAT_ID is not defined. Cannot send notification.');
    return;
  }

  try {
    await bot.telegram.sendMessage(adminChatId, message, { parse_mode: 'HTML' });
  } catch (error) {
    logger.error('Failed to send telegram notification:', error);
  }
};
